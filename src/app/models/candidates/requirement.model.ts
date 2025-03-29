 

export interface Requirement {
    id: number;
    jobId: string;
    requirementName: string;
    noOfPositions: number;
    designation: string;
    clientLocations: string;
    clientRecruiters: string;
    clientLevels: string;
    minExperience: number;
    maxExperience: number;
    maxCostToCompany: number;
    skillsRequired: string;
    skills: string[];
    jobDescription: string;
    status: string;
    billDurationInDays: number;
    typeOfCommission: string;
    rateOfCommission: number;
    attachments: any[];
    customFields: any[];
    statusCategoryReport: any;
    optionalFields: any[];
    source:any;
    
}

