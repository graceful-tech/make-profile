import { Project } from "./project";

export interface Experience  {
    id:any;
    companyName: any;
    role: any;
    experienceYearStartDate:any;
    experienceYearEndDate: any;
    projects: Array<Project>;
    currentlyWorking: any;
}
