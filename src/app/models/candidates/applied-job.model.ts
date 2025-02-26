import { Candidate } from "./candidate.model";
import { ClientLocation } from "../master/client-location.model";
import { Requirement } from "../master/requirement.model";
import { Client } from "../master/client.model";

export interface AppliedJob {
    id: number;
    candidate: Candidate;
    client: Client;
    location: ClientLocation;
    requirement: Requirement;
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
