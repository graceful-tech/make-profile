import { Achievements } from "./achievements";
import { Certificates } from "./certificates";
import { Experience } from "./experiences";
import { Qualification } from "./qualification";

export interface Candidate {
     
    id: number;
    name: string;
    mobileNumber: string;
    email: string;
    nationality: string;
    gender: string;
    languagesKnown: string;
    isFresher: boolean;
    skills: string;
    linkedIn:string;
    dob:any;
    address:any;
    experiences:  Array<Experience>;
    qualification: Array<Qualification>;
    certificates:  Array<Certificates>;
    achievements:  Array<Achievements>;
    maritalStatus:any;

}
