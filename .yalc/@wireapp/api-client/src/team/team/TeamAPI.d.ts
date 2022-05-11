import type { NewTeamData, TeamChunkData, TeamData } from '../';
import { HttpClient, RequestCancelable } from '../../http/';
import type { TeamSizeData } from './TeamSizeData';
import type { UpdateTeamData } from './UpdateTeamData';
import { LeadData } from './LeadData';
export declare class TeamAPI {
    private readonly client;
    constructor(client: HttpClient);
    static readonly URL: {
        SIZE: string;
        TEAMS: string;
        CONSENT: string;
        MARKETO: string;
        LEAD: string;
    };
    postTeam(team: NewTeamData): Promise<void>;
    putTeam(teamId: string, teamData: UpdateTeamData): Promise<void>;
    getTeams(): Promise<TeamChunkData>;
    getTeam(teamId: string): Promise<TeamData>;
    deleteTeam(teamId: string, password: string, verificationCode?: string): Promise<void>;
    getTeamSize(teamId: string): Promise<RequestCancelable<TeamSizeData>>;
    postLead(data: LeadData): Promise<any>;
    putLead(data: LeadData): Promise<any>;
}
