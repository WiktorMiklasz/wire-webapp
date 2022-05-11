import { HttpClient } from '../../http/';
import type { NewTeamInvitation, TeamInvitation, TeamInvitationChunk } from '../invitation/';
export declare class TeamInvitationAPI {
    private readonly client;
    static readonly MAX_CHUNK_SIZE = 100;
    static readonly URL: {
        INFO: string;
        INVITATIONS: string;
        EMAIL: string;
    };
    constructor(client: HttpClient);
    getInvitation(teamId: string, invitationId: string): Promise<TeamInvitation>;
    getAllInvitations(teamId: string): Promise<TeamInvitation[]>;
    getInvitations(teamId: string, startId?: string, limit?: number): Promise<TeamInvitationChunk>;
    deleteInvitation(teamId: string, invitationId: string): Promise<void>;
    headInvitation(email: string): Promise<void>;
    postInvitation(teamId: string, invitation: NewTeamInvitation): Promise<TeamInvitation>;
    getInvitationFromCode(invitationCode: string): Promise<TeamInvitation>;
}
