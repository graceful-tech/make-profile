export interface Candidate {
     
    id: number;
    name: string;
    mobileNumber: string;
    alternateMobileNumber: string
    email: string;
    nationality: string;
    gender: string;
    languagesKnown: string;
    isFresher: boolean;
    skills: string;
    linkedIn:string,
    experiences:  Array<any>;
    qualification: Array<any>;
    certificates:  Array<any>;
    achievements:  Array<any>;
    volunteerExperience:  Array<any>;

}
