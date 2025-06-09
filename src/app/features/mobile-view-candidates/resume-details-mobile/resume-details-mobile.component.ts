import { DatePipe } from '@angular/common';
import {ChangeDetectorRef,Component,} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiService } from '../../../services/api.service';
import { GlobalService } from '../../../services/global.service';
import { ValueSet } from '../../../models/admin/value-set.model';
import { elementAt, Subscription } from 'rxjs';
import { Lookup } from '../../../models/master/lookup.model';
import { Candidate } from 'src/app/models/candidates/candidate.model';
import { Qualification } from 'src/app/models/candidates/qualification';
import { Certificates } from 'src/app/models/candidates/certificates';
import { Achievements } from 'src/app/models/candidates/achievements';
import { PaymentService } from 'src/app/services/payment.service';
 import { CollegeProject } from 'src/app/models/candidates/college-project';
 
@Component({
  selector: 'app-resume-details-mobile',
  standalone: false,
  templateUrl: './resume-details-mobile.component.html',
  styleUrl: './resume-details-mobile.component.css'
})
export class ResumeDetailsMobileComponent {

  candidateForm!: FormGroup;
  genderList: Array<ValueSet> = [];
  languages: Array<ValueSet> = [];
  noticePeriodList: Array<ValueSet> = [];
  candidateId: any;
  showError: boolean = false;
  mobileNumbers: Array<String> = [];
  requirementId!: number;
  customFields: Array<any> = [];
  currentRequest!: Subscription;
  fieldDetails: Array<any> = [];
  dialogRef: any;
  resumeDetails: Array<any> = [];
  resumeDetailsSubscription!: Subscription;
  loaderImagePreview: any;
  customer: any;
  generatedLink: any;
  clientLocations: Array<Lookup> = [];
  code: any;
  shareJobImageUrl: any;
  requirement: any;
  userName: any;
  fresher: boolean = false;
  yearsList: any[] = [];
  dataLoaded: boolean = true;
  maritalStatus: Array<ValueSet> = [];
  candidateImageUrl: any;
  multipartFile: any;
  candidateImageAttachments: any;
  makeProfileUrl: any;
  fieldOfStudy: any;
  inputBgColor = 'lightblue';
  candidates: any;
  isDeleted:boolean = false;
  payments: boolean = false;
  candidatesDetails: Array<Candidate> = [];
  experienceDeletedArray:Array<any> = [];
  qualificationDeletedArray:Array<any> = [];
  certificatesDeletedArray:Array<any> = [];
  achievementsDeletedArray:Array<any> = [];
  imageName: any;
  returnImage:any;
  collegeProjectDeletedArray:Array<any> = [];
  returnCandidate:any;
  resumeName: any;
  fieldsName: any;
  experience:boolean=true;
  personalDetails:boolean =true;
  course:boolean = true;
  achievements:boolean = true;
  extraSkills:boolean = true
  qualification:boolean= true;
  candidatesUpdateData: any;
  resumeDetailsFlag:boolean = false

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private gs: GlobalService,
    private datePipe: DatePipe,
    private dialog: DialogService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router,
    public ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private ps: PaymentService,
  ) 
  {
    this.candidates = this.config.data?.candidates;
  }

  ngOnInit() {
    this.createCandidateForm();
    this.generateYearList();
    this.getGenderList();
    this.getLanguages();
    this.getMaritalStatus();
    this.getFieldOfStudy();
    
    if (this.candidates !== null  && this.candidates !== undefined ) {
      this.candidateId = this.candidates.id;
      const candidateClone = JSON.parse(JSON.stringify(this.candidates));
      this.patchCandidateForm(candidateClone);
    }
   
     this.gs.candidateDetails$.subscribe(response => {
      this.candidatesUpdateData = response;
    });

    if(this.candidatesUpdateData !== null && this.candidatesUpdateData !== undefined){

       this.resumeDetailsFlag = true;

       this.candidateId = this.candidatesUpdateData?.id;
       this.candidates = this.candidatesUpdateData;
      
       const candidateClone = JSON.parse(JSON.stringify(this.candidatesUpdateData)); 
       this.patchCandidateForm(candidateClone);

    }
  }
  

  ngAfterViewInit() {
   
  }

  createCandidateForm() {
    this.candidateForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      mobileNumber: ['',Validators.compose([Validators.required, Validators.minLength(10)]),],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      gender: [''],
      nationality: [''],
      languagesKnown: [''],
      fresher: [''],
      skills: ['', Validators.required],
      linkedIn: [''],
      dob: [''],
      address: [''],
      maritalStatus: [''],
      experiences: this.fb.array([this.createExperience()]),
      qualification: this.fb.array([this.createQualification()]),
      certificates: this.fb.array([this.createCertificates()]),
      achievements: this.fb.array([this.createAchievements()]),
      softSkills:[''],
      coreCompentencies:[''],
      collegeProject: this.fb.array([this.createCollegeProject()]),

    });
  }

  getGenderList() {
    const route = 'value-sets/search-by-code';
    const postData = { valueSetCode: 'GENDER' };
    this.api.retrieve(route, postData).subscribe({
      next: (response) => {
        this.genderList = response;
      },
    });
  }

  addMandatoryValidation() {
    this.fieldDetails.forEach((field) => {
      if (
        field.displayFlag == 'Y' &&
        field.mandatoryFlag == 'Y' &&
        field.editFlag == 'Y'
      ) {
        this.candidateForm.controls[field.fieldName].addValidators(
          Validators.required
        );
        this.candidateForm.controls[field.fieldName].updateValueAndValidity();
      }
    });
  }

  isRequired(fieldName: string) {
    return this.candidateForm.controls[fieldName].hasValidator(
      Validators.required
    );
  }

  display(fieldName: string) {
    return this.fieldDetails.some(
      (field) => field.fieldName == fieldName && field.displayFlag == 'Y'
    );
  }

  createCandidate() {
    if(this.candidateForm.valid){
    
    this.dataLoaded = false;

    const route = 'candidate/create';
    const payload = this.candidateForm.getRawValue();

    if (payload.lastWorkingDate) {
      payload['lastWorkingDate'] = this.datePipe.transform(
        payload.lastWorkingDate,
        'yyyy-MM-dd'
      );
    }

   if(payload.dob !=null){
    payload.dob = this.datePipe.transform(payload.dob,'yyyy-MM-dd');
   }

    if (payload.fresher != null && payload.fresher) {
      payload['fresher'] = true;
    } else {
      payload['fresher'] = false;
    }

  

    if (payload.fresher) {
      payload.experiences = [];
    }  
     
    if (payload.fresher) {
    if (Object.is(payload.collegeProject[0].collegeProjectName, '')) {
        payload.collegeProject = [];
      } else {
        payload.collegeProject = payload.collegeProject.map((proj: any) => ({
          ...proj,
          collegeProjectSkills: Array.isArray(proj.collegeProjectSkills)
            ? proj.collegeProjectSkills.join(', ')
            : proj.collegeProjectSkills
        }));
      }
    } 

   
    if (!payload.fresher) {
      if (Object.is(payload.experiences?.[0]?.companyName, '')) {
        payload.experiences = [];
      } else {
        payload.experiences = payload.experiences.map((exp: any) => {
          const experienceYearStartDate = this.datePipe.transform(
            exp.experienceYearStartDate,
            'yyyy-MM-dd'
          );
          const experienceYearEndDate = this.datePipe.transform(
            exp.experienceYearEndDate,
            'yyyy-MM-dd'
          );
    
          const responsibilities = Array.isArray(exp.responsibilities)
            ? exp.responsibilities.join(', ')
            : exp.responsibilities;
    
          let projects = exp.projects || [];
          const hasEmptyProjectName = projects.some(
            (proj: any) => proj.projectName === ''
          );
    
          if (hasEmptyProjectName) {
            projects = [];
          } else {
            projects = projects.map((proj: any) => ({
              ...proj,
              projectSkills: Array.isArray(proj.projectSkills)
                ? proj.projectSkills.join(', ')
                : proj.projectSkills
            }));
          }
    
          return {
            ...exp,
            experienceYearStartDate,
            experienceYearEndDate,
            responsibilities,
            projects
          };
        });
      }
    
    }
    
     
    if (Object.is(payload.qualification[0].institutionName, '')) {
      payload.qualification = [];
    } else {
      payload.qualification.forEach((q: any) => {
        q.qualificationStartYear = this.datePipe.transform(
          q.qualificationStartYear,
          'yyyy-MM-dd'
        );
        q.qualificationEndYear = this.datePipe.transform(
          q.qualificationEndYear,
          'yyyy-MM-dd'
        );
      });
    }
    
    if (Object.is(payload.achievements[0].achievementsName, '')) {
        payload.achievements = [];
    } else{
      payload.achievements.forEach((cert: any) => {
        cert.achievementsDate = this.datePipe.transform(
          cert.achievementsDate,
          'yyyy-MM-dd'
        );
      });
    }
   
    if (Object.is(payload.certificates[0].courseName, ''))  {
      payload.certificates = [];
    } else {
      payload.certificates.forEach((cert: any) => {
        cert.courseStartDate = this.datePipe.transform(
          cert.courseStartDate,
          'yyyy-MM-dd'
        );
        cert.courseEndDate = this.datePipe.transform(
          cert.courseEndDate,
          'yyyy-MM-dd'
        );
      });
    }
    

    if (Object.is(payload.languagesKnown, '')) {
      payload.languagesKnown = '';
    }
    else{
      const stringList: string[] = payload.languagesKnown;
      const commaSeparatedString: string = stringList.join(', ');
      payload.languagesKnown = commaSeparatedString;
    }

    if (Object.is(payload.skills, '')) {
      payload.skills = '';
    }else{
      const stringList: string[] = payload.skills;
      const commaSeparatedString: string = stringList.join(', ');
      payload.skills = commaSeparatedString;
    }

    if (Object.is(payload.softSkills, '')) {
      payload.softSkills = '';
    }
    else{
      const stringList: string[] = payload.softSkills;
      const commaSeparatedString: string = stringList.join(', ');
      payload.softSkills = commaSeparatedString;
    }

    if (Object.is(payload.coreCompentencies, '')) {
      payload.coreCompentencies = '';
    }
    else{
      const stringList: string[] = payload.coreCompentencies;
      const commaSeparatedString: string = stringList.join(', ');
      payload.coreCompentencies = commaSeparatedString;
    }
 

    if (payload.fresher) {
      const hasValidProject = payload.collegeProject.some((project: { collegeProjectName: string; }) =>
        project.collegeProjectName && project.collegeProjectName.trim() !== ''
      );
    
      if (!hasValidProject) {
        payload.collegeProject = [];
      } else {
        payload.collegeProject = payload.collegeProject.map((project: { collegeProjectSkills: any[]; })  => ({
          ...project,
          collegeProjectSkills: Array.isArray(project.collegeProjectSkills)
            ? project.collegeProjectSkills.join(', ')
            : ''
        }));
      }
    } else {
      payload.collegeProject = [];
    }
    


    this.api.retrieve(route, payload).subscribe({
      next: (response) => {

        this.candidateId = response?.id;
        this.dataLoaded = true;
        localStorage.setItem('candidateId',this.candidateId);
       
        this.uploadCandidateImage();

        this.returnCandidate = response;
        this.returnCandidate.candidateLogo = this.candidateImageUrl;
        response.candidateLogo = this.candidateImageUrl; 
        
       
        this.close(this.returnCandidate);

        this.gs.showMessage('Success','Created Successfully')
     
      },
      error: (error) => {
        this.dataLoaded = true;
         this.gs.showMessage('error','Error in Creating Resume ')
      },
    });
    this.dataLoaded = true;

    }
    else{
      this.gs.showMessage('error','Please fill the mandatory fields');
      this.showError = true;
    }
  }

  reset() {
    this.candidateForm.reset();
  }

  //For experience

  get experienceControls() {
    return this.candidateForm.get('experiences') as FormArray;
  }

  createExperience(): FormGroup {
    return this.fb.group({
      id:[''],
      companyName: [''],
      role: [''],
      experienceYearStartDate: [''],
      experienceYearEndDate: [''],
      projects: this.fb.array([this.createProject()]),
      currentlyWorking: [''],
      responsibilities:[''],
      
    });
  }

  createProject(): FormGroup {
    return this.fb.group({
      id:[''],
      projectName: [''],
      projectSkills: [''],
      projectRole: [''],
      projectDescription: [''],
      
    });
  }

  addExperience(): void {
    this.experienceControls.push(this.createExperience());
  }

  removeExperience(index: number): void {
    const confirmDelete = window.confirm(
      'Are you sure you want to remove this Experience?'
    );
    if (confirmDelete && this.experienceControls.length > 1) {
      const removedExperience = this.experienceControls.at(index).value;
      console.log('Removed Experience:', removedExperience);
      if (removedExperience.id) {
        removedExperience.isDeleted = true; 
       this.experienceDeletedArray.push(removedExperience);
       this.experienceControls.removeAt(index);
      } else {
        this.experienceControls.removeAt(index);
      }
    }
  }

  getProjects(experienceIndex: number): FormArray {
    return this.experienceControls
      .at(experienceIndex)
      .get('projects') as FormArray;
  }

  getProjectCount(experienceIndex: number): number {
    return (
      this.experienceControls.at(experienceIndex).get('projects') as FormArray
    ).length;
  }

  getExperienceCount(experienceIndex: number): number {
    return (this.candidateForm.get('experiences') as FormArray).length;
  }

  addProject(experienceIndex: number): void {
    this.getProjects(experienceIndex).push(this.createProject());
  }

  removeProject(experienceIndex: number, projectIndex: number): void {
    const confirmDelete = window.confirm(
      'Are you sure you want to remove this Project?'
    );
  
    const projectArray = this.getProjects(experienceIndex);
  
    if (confirmDelete && projectArray.length > 1) {
      const removedProject = projectArray.at(projectIndex).value;

      if (removedProject.id) {
        removedProject.isDeleted = true;
        const experienceGroup = this.experienceControls.at(experienceIndex);
        const projectsControl = experienceGroup.get('projects') as FormArray;
        projectsControl.at(projectIndex).patchValue(removedProject);
      }
      projectArray.removeAt(projectIndex);
    }
  }
  
  //For qualification

  createQualification(): FormGroup {
    return this.fb.group({
      id:[''],
      institutionName: [''],
      department: [''],
      qualificationStartYear: [''],
      qualificationEndYear: [''],
      percentage: [''],
      fieldOfStudy: [''],
      
    });
  }

  get qualificationControls() {
    return this.candidateForm.get('qualification') as FormArray;
  }

  addQualication() {
    this.qualificationControls.push(this.createQualification());
  }

  removeQualification(index: number) {
    const confirmDelete = window.confirm(
      'Are you sure you want to remove this qualification?'
    );
    if (confirmDelete && this.qualificationControls.length > 1) {
      const removedQualification = this.qualificationControls.at(index).value;
       if (removedQualification.id) {
        removedQualification.isDeleted = true; 
          this.qualificationDeletedArray.push(removedQualification);
          this.qualificationControls.removeAt(index);
      } else {
        this.qualificationControls.removeAt(index);
      }
    }
  }

  generateYearList() {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1980; year--) {
      this.yearsList.push({ label: year.toString(), value: year });
    }
  }

  //For certificate

  get certificateControls() {
    return this.candidateForm.get('certificates') as FormArray;
  }

  addCertificates() {
    this.certificateControls.push(this.createCertificates());
  }

  removeCertificates(index: number) {
    const confirmDelete = window.confirm(
      'Are you sure you want to remove this certificates?'
    );
    if (confirmDelete && this.certificateControls.length > 1) {
    const removedCertificate = this.certificateControls.at(index).value;
       if (removedCertificate.id) {
          removedCertificate.isDeleted = true; 
          this.certificatesDeletedArray.push(removedCertificate);
          this.certificateControls.removeAt(index);
      } else {
        this.certificateControls.removeAt(index);
      }
    }
  }

  createCertificates(): FormGroup {
    return this.fb.group({
      id:[''],
      courseName: [''],
      courseStartDate: [''],
      courseEndDate: [''],
      
    });
  }

  //For achiecements

  get achievementsControls() {
    return this.candidateForm.get('achievements') as FormArray;
  }

  addAchievements() {
    this.achievementsControls.push(this.createAchievements());
  }

  removeaddAchievements(index: number) {
    const confirmDelete = window.confirm(
      'Are you sure you want to remove this achievements?'
    );
    if (confirmDelete && this.achievementsControls.length > 1) {
      const removedAchievement = this.achievementsControls.at(index).value;
       if (removedAchievement.id) {
        removedAchievement.isDeleted =true;
        this.achievementsDeletedArray.push(removedAchievement);
        this.achievementsControls.removeAt(index);
       } else {
        this.achievementsControls.removeAt(index);
      }
    }
  }

  createAchievements(): FormGroup {
    return this.fb.group({
      id:[''],
      achievementsName: [''],
      achievementsDate: [''],
    });
  }

  getLanguages() {
    const route = 'value-sets/search-by-code';
    const postData = { valueSetCode: 'LANGUAGES' };
    this.api.retrieve(route, postData).subscribe({
      next: (response) => {
        this.languages = response;
      },
    });
  }

  getMaritalStatus() {
    const route = 'value-sets/search-by-code';
    const postData = { valueSetCode: 'MARITALSTATUS' };
    this.api.retrieve(route, postData).subscribe({
      next: (response) => {
        this.maritalStatus = response;
      },
    });
  }

  getFieldOfStudy() {
    const route = 'value-sets/search-by-code';
    const postData = { valueSetCode: 'QUALIFICATION' };
    this.api.retrieve(route, postData).subscribe({
      next: (response) => {
        this.fieldOfStudy = response;
      },
    });
  }

  addCandidateImage(event: any) {
    this.candidateImageAttachments = [];
    this.multipartFile = event.target.files[0];
    this.imageName = this.multipartFile.name;
    const candidateImageAttachment = { fileName: this.multipartFile.name };
    this.candidateImageAttachments.push(candidateImageAttachment);
    this.updateCandidateImage();
  }

  updateCandidateImage() {
    var reader = new FileReader();
    reader.onload = () => {
      this.candidateImageUrl = reader.result;
    };
    reader.readAsDataURL(this.multipartFile);
  }

  uploadCandidateImage() {
    if(this.candidateImageUrl !== undefined && this.multipartFile !== undefined ){
    this.dataLoaded = false;
    const route = 'candidate/upload-image';
    const formData = new FormData();
    formData.append('attachment', this.multipartFile);
    formData.append('candidateId', this.candidateId);
     this.api.downloadFile(route, formData).subscribe({
      next: (response) => {
        this.candidateImageUrl = URL.createObjectURL(response);
      },
      error: (error) => {
        this.dataLoaded = true;
        this.gs.showMessage('Error', 'Error in updating logo.');
      },
    });
  }
  }

  close(response: any) {
    this.ref.close(response);
  }


  patchCandidateForm(candidate: Candidate) {

    candidate.languagesKnown = candidate?.languagesKnown ? candidate.languagesKnown .split(',').map((skill: string) => skill.trim()) : [];
    candidate.skills = candidate?.skills ? candidate.skills.split(',').map((skill: string) => skill.trim()) : [];
    candidate.softSkills = candidate?.softSkills ? candidate.softSkills.split(',').map((skill: string) => skill.trim()) : [];
    candidate.coreCompentencies = candidate?.coreCompentencies ? candidate.coreCompentencies.split(',').map((skill: string) => skill.trim()) : [];

    if(candidate.certificates?.length >0){
      const certificateFormArray = this.candidateForm.get('certificates') as FormArray;
      certificateFormArray.clear();
  
      candidate.certificates?.forEach(certificate => {
        certificateFormArray.push(this.createCertificateFormGroup(certificate));
      });
    }

      if(candidate.experiences?.length > 0){
      this.patchExperiences(candidate.experiences);
      }
      else{
          if(candidate.collegeProject?.length > 0){
      const collegeProjectFromArray = this.candidateForm.get('collegeProject') as FormArray;
      collegeProjectFromArray.clear();

      candidate.collegeProject?.forEach(collegeProject => {
        collegeProject.collegeProjectSkills = collegeProject?.collegeProjectSkills ? collegeProject.collegeProjectSkills.split(',').map((skill: string) => skill.trim()) : [];
        collegeProjectFromArray.push(this.createCollegeProjectFormGroup(collegeProject));
      });
    }
      }
  
      if(candidate.qualification?.length > 0){
        const qualificationFormArray = this.candidateForm.get('qualification') as FormArray;
        qualificationFormArray.clear();

        candidate.qualification?.forEach(qualification => {
        qualificationFormArray.push(this.createQualificationFormGroup(qualification));
      });
    }
  
    if(candidate.achievements?.length > 0){
      const achievementFormArray = this.candidateForm.get('achievements') as FormArray;
        achievementFormArray.clear();

      candidate.achievements?.forEach(achievement => {
      achievementFormArray.push(this.createAchievementsFormGroup(achievement));
      });
    }

      const candidateDob = candidate.dob ? new Date(candidate.dob) : null;

      this.candidateForm.patchValue({
        id: candidate?.id,
        name: candidate?.name,
        mobileNumber:candidate?.mobileNumber,
        email: candidate?.email,
        gender: candidate?.gender,
        nationality:candidate?.nationality,
        languagesKnown: candidate?.languagesKnown,
        fresher: candidate?.fresher,
        skills: candidate?.skills,
        linkedIn: candidate?.linkedIn,
        dob: candidateDob,  
        address: candidate?.address,
        maritalStatus: candidate?.maritalStatus,
        softSkills:candidate?.softSkills ? candidate?.softSkills :[],
        coreCompentencies:candidate?.coreCompentencies ? candidate?.coreCompentencies :[]
      });
    }

  
    createCertificateFormGroup(certificate: Certificates): FormGroup {
      return this.fb.group({
        id: certificate.id,
        courseName: certificate.courseName,
        courseStartDate: certificate.courseStartDate ? new Date(certificate.courseStartDate) : null,
        courseEndDate: certificate.courseEndDate ? new Date(certificate.courseEndDate) : null,
        isDeleted:['']
      });
    }
  
    patchExperiences(experiences: any[]) {
      
      if(experiences?.length > 0){
        const experienceFormArray = this.candidateForm.get('experiences') as FormArray;
        experienceFormArray.clear();
        experiences?.forEach((experience) => {
        
          const responsibilities = experience?.responsibilities ? experience.responsibilities.split(',').map((res: string) => res.trim()) : [];

          const experienceForm = this.createExperience();
          experienceForm.patchValue({
            id:experience.id,
            companyName: experience.companyName,
            role: experience.role,
            experienceYearStartDate:  experience.experienceYearStartDate ? new Date(experience.experienceYearStartDate) : null,
            experienceYearEndDate:  experience.experienceYearEndDate ? new Date(experience.experienceYearEndDate) : null,
            currentlyWorking: experience.currentlyWorking,
            responsibilities:responsibilities,
            
          });
         
          if(experience.projects?.length > 0){
            const projectFormArray = experienceForm.get('projects') as FormArray; 
            projectFormArray.clear();
           experience.projects?.forEach((project:any) => {
            const projectSkills = project?.projectSkills ? project.projectSkills.split(',').map((skill: string) => skill.trim()) : [];
            const projectForm = this.createProject();
            projectForm.patchValue({
              id:project.id,
              projectName: project.projectName,
              projectSkills: projectSkills,
              projectRole: project.projectRole,
              projectDescription: project.projectDescription,
              
            });
            projectFormArray.push(projectForm);
          });
        }
          experienceFormArray.push(experienceForm);
        });
      }
      }
  
    createQualificationFormGroup(qualification: Qualification){
      return this.fb.group({
        id:qualification.id,
        institutionName: qualification.institutionName,
        department: qualification.department,
        qualificationStartYear: qualification.qualificationStartYear ? new Date(qualification.qualificationStartYear) : null,
        qualificationEndYear: qualification.qualificationEndYear ? new Date(qualification.qualificationEndYear) : null,
        percentage: qualification.percentage,
        fieldOfStudy: qualification.fieldOfStudy,
        
      });
    }
  
    createAchievementsFormGroup(achievement: Achievements){
      const formattedStartDate = this.datePipe.transform(achievement.achievementsDate, 'yyyy-MM-dd');
      return this.fb.group({
        id:achievement.id,
        achievementsName: achievement.achievementsName,
        achievementsDate:  achievement.achievementsDate ? new Date(achievement.achievementsDate) : null,
        
      });
    }

    createCollegeProjectFormGroup(collegeProject: CollegeProject){
      return this.fb.group({
        id:collegeProject.id,
        collegeProjectName:  collegeProject.collegeProjectName,
        collegeProjectSkills: collegeProject.collegeProjectSkills,
        collegeProjectDescription:collegeProject.collegeProjectDescription,
        
      });
    }

    

   get collegeProjectControls() {
    return this.candidateForm.get('collegeProject') as FormArray;
  }

  addCollegeProject(){
    this.collegeProjectControls.push(this.createCollegeProject());
  }

  getCollegeProjectCount(collegeProjectIndex: number): number {
    return (this.candidateForm.get('collegeProject') as FormArray).length;
  }

  removeCollegeProject(index: number){
   const confirmDelete = window.confirm(
      'Are you sure you want to remove this project?'
    );
    if (confirmDelete && this.collegeProjectControls.length > 1) {
      const removeCollegeProject = this.collegeProjectControls.at(index).value;
       if (removeCollegeProject.id) {
        removeCollegeProject.isDeleted =true;
         this.collegeProjectDeletedArray.push(removeCollegeProject);
         this.collegeProjectControls.removeAt(index);
       } else {
        this.collegeProjectControls.removeAt(index);
      }
    }
  }

    createCollegeProject(): FormGroup {
      return this.fb.group({
        id:[''],
        collegeProjectName: [''],
        collegeProjectSkills: [''],
        collegeProjectDescription: [''],
        
      });
    }

    getCandidates() {
      const route = 'candidate';
      this.api.get(route).subscribe({
        next: (response) => {
          const candidate = response as Candidate;
          if(candidate !== null){
          this.candidates = candidate;
          this.candidateId=candidate?.id;
        
          const candidateClone = JSON.parse(JSON.stringify(candidate)); 

          this.patchCandidateForm(candidateClone);
          this.getCandidateImage(candidate?.id);

          if (this.candidateId !== null && this.candidateId !== undefined) {
            this.candidateForm.controls['mobileNumber'].disable();
          }
        }
        },

      });
    }
  
    getCandidateImage(id:any){
      const route ='candidate/get-image'
  
      const formData = new FormData();
      formData.append('candidateId',id)
  
      this.api.upload(route,formData).subscribe({
        next: (response) =>{
          this.candidateImageUrl = URL.createObjectURL(response);
          this.dataLoaded = true;
        }
      });
  
    }

    saveandcreateresume() {
       if(this.candidateForm.valid){
    
    this.dataLoaded = false;

    const route = 'candidate/create';
    const payload = this.candidateForm.getRawValue();

    if (payload.lastWorkingDate) {
      payload['lastWorkingDate'] = this.datePipe.transform(
        payload.lastWorkingDate,
        'yyyy-MM-dd'
      );
    }

   if(payload.dob !=null){
    payload.dob = this.datePipe.transform(payload.dob,'yyyy-MM-dd');
   }

    if (payload.fresher != null && payload.fresher) {
      payload['fresher'] = true;
    } else {
      payload['fresher'] = false;
    }

  

    if (payload.fresher) {
      payload.experiences = [];
    }  
     
    if (payload.fresher) {
    if (Object.is(payload.collegeProject[0].collegeProjectName, '')) {
        payload.collegeProject = [];
      } else {
        payload.collegeProject = payload.collegeProject.map((proj: any) => ({
          ...proj,
          collegeProjectSkills: Array.isArray(proj.collegeProjectSkills)
            ? proj.collegeProjectSkills.join(', ')
            : proj.collegeProjectSkills
        }));
      }
    } 

   
    if (!payload.fresher) {
      if (Object.is(payload.experiences?.[0]?.companyName, '')) {
        payload.experiences = [];
      } else {
        payload.experiences = payload.experiences.map((exp: any) => {
          const experienceYearStartDate = this.datePipe.transform(
            exp.experienceYearStartDate,
            'yyyy-MM-dd'
          );
          const experienceYearEndDate = this.datePipe.transform(
            exp.experienceYearEndDate,
            'yyyy-MM-dd'
          );
    
          const responsibilities = Array.isArray(exp.responsibilities)
            ? exp.responsibilities.join(', ')
            : exp.responsibilities;
    
          let projects = exp.projects || [];
          const hasEmptyProjectName = projects.some(
            (proj: any) => proj.projectName === ''
          );
    
          if (hasEmptyProjectName) {
            projects = [];
          } else {
            projects = projects.map((proj: any) => ({
              ...proj,
              projectSkills: Array.isArray(proj.projectSkills)
                ? proj.projectSkills.join(', ')
                : proj.projectSkills
            }));
          }
    
          return {
            ...exp,
            experienceYearStartDate,
            experienceYearEndDate,
            responsibilities,
            projects
          };
        });
      }
    
    }
    
     
    if (Object.is(payload.qualification[0].institutionName, '')) {
      payload.qualification = [];
    } else {
      payload.qualification.forEach((q: any) => {
        q.qualificationStartYear = this.datePipe.transform(
          q.qualificationStartYear,
          'yyyy-MM-dd'
        );
        q.qualificationEndYear = this.datePipe.transform(
          q.qualificationEndYear,
          'yyyy-MM-dd'
        );
      });
    }
    
    if (Object.is(payload.achievements[0].achievementsName, '')) {
        payload.achievements = [];
    } else{
      payload.achievements.forEach((cert: any) => {
        cert.achievementsDate = this.datePipe.transform(
          cert.achievementsDate,
          'yyyy-MM-dd'
        );
      });
    }
   
    if (Object.is(payload.certificates[0].courseName, ''))  {
      payload.certificates = [];
    } else {
      payload.certificates.forEach((cert: any) => {
        cert.courseStartDate = this.datePipe.transform(
          cert.courseStartDate,
          'yyyy-MM-dd'
        );
        cert.courseEndDate = this.datePipe.transform(
          cert.courseEndDate,
          'yyyy-MM-dd'
        );
      });
    }
    

    if (Object.is(payload.languagesKnown, '')) {
      payload.languagesKnown = '';
    }
    else{
      const stringList: string[] = payload.languagesKnown;
      const commaSeparatedString: string = stringList.join(', ');
      payload.languagesKnown = commaSeparatedString;
    }

    if (Object.is(payload.skills, '')) {
      payload.skills = '';
    }else{
      const stringList: string[] = payload.skills;
      const commaSeparatedString: string = stringList.join(', ');
      payload.skills = commaSeparatedString;
    }

    if (Object.is(payload.softSkills, '')) {
      payload.softSkills = '';
    }
    else{
      const stringList: string[] = payload.softSkills;
      const commaSeparatedString: string = stringList.join(', ');
      payload.softSkills = commaSeparatedString;
    }

    if (Object.is(payload.coreCompentencies, '')) {
      payload.coreCompentencies = '';
    }
    else{
      const stringList: string[] = payload.coreCompentencies;
      const commaSeparatedString: string = stringList.join(', ');
      payload.coreCompentencies = commaSeparatedString;
    }
 

    if (payload.fresher) {
      const hasValidProject = payload.collegeProject.some((project: { collegeProjectName: string; }) =>
        project.collegeProjectName && project.collegeProjectName.trim() !== ''
      );
    
      if (!hasValidProject) {
        payload.collegeProject = [];
      } else {
        payload.collegeProject = payload.collegeProject.map((project: { collegeProjectSkills: any[]; })  => ({
          ...project,
          collegeProjectSkills: Array.isArray(project.collegeProjectSkills)
            ? project.collegeProjectSkills.join(', ')
            : ''
        }));
      }
    } else {
      payload.collegeProject = [];
    }
    


    this.api.retrieve(route, payload).subscribe({
      next: (response) => {

        this.candidateId = response?.id;
       
        localStorage.setItem('candidateId',this.candidateId);
         this.candidates = response;
        this.uploadCandidateImage();

        this.chooseTemplate();

          this.dataLoaded = true;  
      },
      error: (error) => {
        this.dataLoaded = true;
        window.alert('Error in Creating Resume');
        console.log(error);
      },
    });
    this.dataLoaded = true;

    }
    else{
      this.gs.showMessage('error','Please fill the mandatory fields');
      this.showError = true;
    }
     
    }
    backToDashboard(){
      history.back();
    }

    chooseTemplate(){
     this.gs.setCandidateDetails(this.candidates)
     if(this.candidateImageUrl !== null && this.candidateImageUrl !== undefined){
     this.gs.setCandidateImage(this.candidateImageUrl)
      }
     if(this.candidates !== null && this.candidates !== undefined){
    this.router.navigate(['mob-candidate/choose-Template']);
     }
     else{
      window.alert("Please enter the details")
     }
    }
}
