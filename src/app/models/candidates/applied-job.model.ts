import { Candidate } from "./candidate.model";
 

export interface AppliedJob {
    id: number;
    candidate: Candidate;
    interviewMode: string;
    interviewLocation: string;
    interviewDate: Date;
    interviewTime: string;
    callBackDate: Date;
    callBackTime: string;
    joiningDate: Date;
    acceptedCostToCompany: number;
    statusCategory: string;
    status: string;
    documentChecked: boolean;
    customFieldValues: Array<any>;
}
