export interface StatusHistory {
    id: number;
    fromStatus: string;
    toStatus: string;
    requirementId: number;
    userId: number;
    userName: string;
    updatedDate: Date;
}