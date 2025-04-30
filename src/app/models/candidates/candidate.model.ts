import { Achievements } from "./achievements";
import { Certificates } from "./certificates";
import { CollegeProject } from "./college-project";
import { Experience } from "./experiences";
import { Qualification } from "./qualification";

export interface Candidate {
     
    id: number;
    name: string;
    mobileNumber: string;
    email: string;
    nationality: string;
    gender: string;
    languagesKnown: any;
    isFresher: boolean;
    skills: any;
    linkedIn:string;
    dob:any;
    address:any;
    experiences:  Array<Experience>;
    qualification: Array<Qualification>;
    certificates:  Array<Certificates>;
    achievements:  Array<Achievements>;
    collegeProject:  Array<CollegeProject>;
    maritalStatus:any;
    softSkills:any;
    coreCompentencies:any;

}
