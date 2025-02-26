export interface Candidate {
    jmMatcher: boolean;
    id: number;
    name: string;
    mobileNumber: string;
    alternateMobileNumber: string
    email: string;
    nationality: string;
    panNumber: string;
    passportNumber: string;
    gender: string;
    languagesKnown: string;
    qualification: string;
    isFresher: boolean;
    companyName: string;
    designation: string;
    totalWorkExperience: number;
    relevantExperience: number;
    skills: string;
    currentLocation: string;
    preferredLocation: string;
    currentCostToCompany: number;
    expectedCostToCompany: number;
    noticePeriod: string;
    lastWorkingDate: Date,
    reasonToChange: string;
    sourceOfHiring: string;
    reference: string;
    offers: string;
    remark: string;
    candidateResume: any;
    customFields: Array<any>;
    customFieldValues: Array<any>;
    jobId:any;
    isMatcherVisible:any;
    candidateUrl:any
    modifiedUserName: any;
}
