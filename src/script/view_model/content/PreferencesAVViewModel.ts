/*
 * Wire
 * Copyright (C) 2018 Wire Swiss GmbH
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see http://www.gnu.org/licenses/.
 *
 */

import ko from 'knockout';
import {getLogger, Logger} from 'Util/Logger';
import {Config, Configuration} from '../../Config';
import {MediaType} from '../../media/MediaType';
import {MediaRepository} from '../../media/MediaRepository';
import {MediaStreamHandler} from '../../media/MediaStreamHandler';
import {MediaConstraintsHandler} from '../../media/MediaConstraintsHandler';
import {UserRepository} from '../../user/UserRepository';
import {Call} from '../../calling/Call';
import {DeviceIds, Devices, DeviceSupport, MediaDevicesHandler} from '../../media/MediaDevicesHandler';

type MediaSourceChanged = (mediaStream: MediaStream, mediaType: MediaType, call?: Call) => void;
type WillChangeMediaSource = (mediaType: MediaType) => boolean;
type CallBacksType = {
  replaceActiveMediaSource: MediaSourceChanged;
  stopActiveMediaSource: WillChangeMediaSource;
};

export class PreferencesAVViewModel {
  audioContext: AudioContext;
  audioInterval: number;
  audioLevel: ko.Observable<number>;
  audioSource: MediaStreamAudioSourceNode;
  availableDevices: Devices;
  brandName: string;
  Config: Configuration;
  constraintsHandler: MediaConstraintsHandler;
  currentDeviceId: DeviceIds;
  devicesHandler: MediaDevicesHandler;
  deviceSupport: DeviceSupport;
  hasAudioTrack: ko.Observable<boolean>;
  hasNoneOrOneAudioInput: ko.PureComputed<boolean>;
  hasNoneOrOneVideoInput: ko.PureComputed<boolean>;
  hasVideoTrack: ko.Observable<boolean>;
  isActivatedAccount: ko.PureComputed<boolean>;
  isRequestingAudio: ko.Observable<boolean>;
  isRequestingVideo: ko.Observable<boolean>;
  isTemporaryGuest: ko.PureComputed<boolean>;
  logger: Logger;
  mediaStream: ko.Observable<MediaStream>;
  replaceActiveMediaSource: MediaSourceChanged;
  stopActiveMediaSource: WillChangeMediaSource;
  streamHandler: MediaStreamHandler;
  userRepository: UserRepository;

  static get CONFIG() {
    return {
      AUDIO_METER: {
        FFT_SIZE: 1024,
        INTERVAL: 100,
        LEVEL_ADJUSTMENT: 0.075,
        SMOOTHING_TIME_CONSTANT: 0.2,
      },
    };
  }

  constructor(mediaRepository: MediaRepository, userRepository: UserRepository, callbacks: CallBacksType) {
    this.stopActiveMediaSource = callbacks.stopActiveMediaSource;
    this.replaceActiveMediaSource = callbacks.replaceActiveMediaSource;

    this.logger = getLogger('PreferencesAVViewModel');

    this.userRepository = userRepository;

    this.isActivatedAccount = this.userRepository.isActivatedAccount;

    this.devicesHandler = mediaRepository.devicesHandler;
    this.availableDevices = this.devicesHandler.availableDevices;
    this.currentDeviceId = this.devicesHandler.currentDeviceId;
    this.deviceSupport = this.devicesHandler.deviceSupport;
    this.Config = Config.getConfig();

    this.currentDeviceId.audioInput.subscribe(() => this.updateMediaStreamTrack(MediaType.AUDIO));
    this.currentDeviceId.videoInput.subscribe(() => this.updateMediaStreamVideoTrack());

    this.constraintsHandler = mediaRepository.constraintsHandler;
    this.streamHandler = mediaRepository.streamHandler;

    this.mediaStream = ko.observable(new MediaStream());
    this.hasAudioTrack = ko.observable(false);
    this.hasVideoTrack = ko.observable(false);
    this.hasNoneOrOneAudioInput = ko.pureComputed(() => this.availableDevices.audioInput().length < 2);
    this.hasNoneOrOneVideoInput = ko.pureComputed(() => this.availableDevices.videoInput().length < 2);

    const selfUser = this.userRepository.self;
    this.isTemporaryGuest = ko.pureComputed(() => selfUser() && selfUser().isTemporaryGuest());

    this.audioContext = undefined;
    this.audioInterval = undefined;
    this.audioLevel = ko.observable(0);
    this.audioSource = undefined;

    this.brandName = this.Config.BRAND_NAME;

    this.isRequestingAudio = ko.observable(false);
    this.isRequestingVideo = ko.observable(false);
  }

  updateMediaStreamVideoTrack() {
    return this.updateMediaStreamTrack(MediaType.VIDEO);
  }

  private async initiateDevices(mediaType: MediaType): Promise<void> {
    switch (mediaType) {
      case MediaType.AUDIO: {
        if (this.isRequestingAudio()) {
          return;
        }
        this.isRequestingAudio(true);
        break;
      }
      case MediaType.VIDEO: {
        if (this.isRequestingVideo()) {
          return;
        }
        this.isRequestingVideo(true);
        break;
      }
      case MediaType.AUDIO_VIDEO: {
        if (this.isRequestingAudio() || this.isRequestingVideo()) {
          return;
        }
        this.isRequestingAudio(true);
        this.isRequestingVideo(true);
      }
    }

    try {
      const mediaStream = await this.getMediaStream(mediaType);
      mediaStream.getTracks().forEach(track => this.mediaStream().addTrack(track));

      if (this.mediaStream().getAudioTracks().length && !this.audioInterval) {
        this.initiateAudioMeter(this.mediaStream());
      }

      await this.stopActiveMediaSource(mediaType);
      this.replaceActiveMediaSource(this.mediaStream(), mediaType);
    } catch (error) {
      this.logger.warn(`Requesting MediaStream for type "${mediaType}" failed: ${error.message}`, error);
    } finally {
      if (this.mediaStream().getAudioTracks().length === 0) {
        this.hasAudioTrack(false);
      } else {
        this.hasAudioTrack(true);
      }

      if (this.mediaStream().getVideoTracks().length === 0) {
        this.hasVideoTrack(false);
      } else {
        this.hasVideoTrack(true);
      }

      switch (mediaType) {
        case MediaType.AUDIO: {
          this.isRequestingAudio(false);
          break;
        }
        case MediaType.VIDEO: {
          this.isRequestingVideo(false);
          break;
        }
        case MediaType.AUDIO_VIDEO: {
          this.isRequestingAudio(false);
          this.isRequestingVideo(false);
        }
        default: {
          this.isRequestingAudio(false);
          this.isRequestingVideo(false);
        }
      }
    }
  }

  async updateMediaStreamTrack(mediaType: MediaType): Promise<void> {
    // TODO: Check if there is already a pending media stream request
    await this.releaseDevices(mediaType);
    await this.initiateDevices(mediaType);
  }

  private async releaseDevices(mediaType: MediaType): Promise<void> {
    if (mediaType === MediaType.AUDIO || mediaType === MediaType.AUDIO_VIDEO) {
      await this.releaseAudioMeter();
    }
    this.streamHandler.releaseTracksFromStream(this.mediaStream(), mediaType);
  }

  private async getMediaStream(requestedMediaType: MediaType): Promise<MediaStream> {
    if (!this.deviceSupport.videoInput() && !this.deviceSupport.audioInput()) {
      return Promise.resolve(undefined);
    }
    const supportsVideo = this.deviceSupport.videoInput();
    const supportsAudio = this.deviceSupport.audioInput();

    const requestAudio = supportsAudio && [MediaType.AUDIO, MediaType.AUDIO_VIDEO].includes(requestedMediaType);
    const requestVideo = supportsVideo && [MediaType.VIDEO, MediaType.AUDIO_VIDEO].includes(requestedMediaType);

    return this.getStreamsSeparately(requestAudio, requestVideo);
  }

  private async getStreamsSeparately(requestAudio: boolean, requestVideo: boolean): Promise<MediaStream> {
    const mediaStreams = [];

    if (requestAudio) {
      try {
        const audioStream = await this.streamHandler.requestMediaStream(true, false, false, false);
        mediaStreams.push(audioStream);
      } catch (error) {
        this.logger.warn(error);
      }
    }

    if (requestVideo) {
      try {
        const videoStream = await this.streamHandler.requestMediaStream(false, true, false, false);
        mediaStreams.push(videoStream);
      } catch (error) {
        this.logger.warn(error);
      }
    }

    if (mediaStreams.length === 0) {
      throw new Error('No media streams available.');
    }

    const tracks = mediaStreams.reduce((trackList, mediaStream) => {
      return trackList.concat(mediaStream.getTracks());
    }, []);

    return new MediaStream(tracks);
  }

  private initiateAudioMeter(mediaStream: MediaStream): void {
    this.logger.info(`Initiating new audio meter for stream ID "${mediaStream.id}"`, mediaStream);
    if (!window.AudioContext || !window.AudioContext.prototype.createMediaStreamSource) {
      this.logger.warn('AudioContext is not supported, no volume indicator can be generated');
    }
    this.audioContext = new window.AudioContext();

    const audioAnalyser = this.audioContext.createAnalyser();
    audioAnalyser.fftSize = PreferencesAVViewModel.CONFIG.AUDIO_METER.FFT_SIZE;
    audioAnalyser.smoothingTimeConstant = PreferencesAVViewModel.CONFIG.AUDIO_METER.SMOOTHING_TIME_CONSTANT;

    const audioDataArray = new Float32Array(audioAnalyser.frequencyBinCount);

    this.audioInterval = window.setInterval(() => {
      audioAnalyser.getFloatFrequencyData(audioDataArray);
      let volume = 0;

      // Data is in the db range of -100 to -30, but can also be -Infinity. We normalize the value up to -50 to the range of 0, 1.
      for (const dataPoint of audioDataArray) {
        volume += Math.abs(Math.max(dataPoint, -100) + 100) / 50;
      }

      const averageVolume = volume / audioDataArray.length;

      this.audioLevel(averageVolume - PreferencesAVViewModel.CONFIG.AUDIO_METER.LEVEL_ADJUSTMENT);
    }, PreferencesAVViewModel.CONFIG.AUDIO_METER.INTERVAL);

    this.audioSource = this.audioContext.createMediaStreamSource(mediaStream);
    this.audioSource.connect(audioAnalyser);
  }

  private async releaseAudioMeter(): Promise<void> {
    window.clearInterval(this.audioInterval);
    this.audioInterval = undefined;

    if (this.audioContext) {
      try {
        await this.audioContext.close();
        this.logger.info('Closed existing AudioContext', this.audioContext);
        this.audioContext = undefined;
      } catch (error) {
        this.logger.error(error);
      }
    }

    if (this.audioSource) {
      this.audioSource.disconnect();
      this.audioSource = undefined;
    }
  }
}