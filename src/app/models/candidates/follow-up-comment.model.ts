export interface FollowUpComment {
    id: number;
    comment: string;
    nature: string;
    createdDate: Date;
    userName: string;
    appliedJobId: number;
    candidateName: string;
    clientName: string;
    city: string;
}
