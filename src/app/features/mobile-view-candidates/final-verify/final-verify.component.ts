import {ChangeDetectorRef,Component, ElementRef, ViewChild} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiService } from '../../../services/api.service';
import { GlobalService } from '../../../services/global.service';
import { ValueSet } from '../../../models/admin/value-set.model';
import {Subscription } from 'rxjs';
import { Lookup } from '../../../models/master/lookup.model';
import { Candidate } from 'src/app/models/candidates/candidate.model';
import { Qualification } from 'src/app/models/candidates/qualification';
import { Certificates } from 'src/app/models/candidates/certificates';
import { Achievements } from 'src/app/models/candidates/achievements';
import { PaymentService } from 'src/app/services/payment.service';
import { CollegeProject } from 'src/app/models/candidates/college-project';
import { DatePipe } from '@angular/common';
import { PaymentOptionComponent } from '../../candidates/payments/payment-option/payment-option.component';
import { MobileLoaderComponent } from 'src/app/shared/components/mobile-loader/mobile-loader.component';

@Component({
  selector: 'app-final-verify',
  standalone: false,
  templateUrl: './final-verify.component.html',
  styleUrl: './final-verify.component.css'
})
export class FinalVerifyComponent {
 @ViewChild('chipInput', { static: false }) chipInputRef!: ElementRef;
@ViewChild(MobileLoaderComponent) mobileLoaderComponent!: MobileLoaderComponent;

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
  imageName: any;
  returnImage:any;
  candidatesUpdateData: any;
  skill: Array<any> = [];
  templateName: any;
  isUploading:boolean = false;
  certificateEmptyFields: boolean = false;
  achievementsEmptyFields :boolean = false;

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
     this.gs.resumeName$.subscribe(response =>{
      this.templateName = response
    })

    
    this.gs.candidateDetails$.subscribe(response => {
      this.candidatesUpdateData = response;
    });  
    
  }

  ngOnInit() {
    this.createCandidateForm();
    this.generateYearList();
    this.getGenderList();
    this.getLanguages();
    this.getMaritalStatus();
    this.getFieldOfStudy();
    
    if(this.templateName === null || this.templateName === undefined){
      this.templateName = localStorage.getItem('templateName')
    }

   
    if(this.candidatesUpdateData !== null && this.candidatesUpdateData !== undefined){
       this.candidateId = this.candidatesUpdateData?.id;
      this.candidates = this.candidatesUpdateData;

       this.goToOpenAi();
      
      // const candidateClone = JSON.parse(JSON.stringify(this.candidatesUpdateData)); 
      // this.patchCandidateForm(candidateClone);
    }
    else{
      this.getCandidates();
     }

    
  }

  ngAfterViewInit() {}

  createCandidateForm() {
    this.candidateForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      mobileNumber: ['',Validators.compose([Validators.required, Validators.minLength(10)]),],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      gender: [''],
      nationality: [''],
      languagesKnown: [[]],
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
      summary:[''],
      careerObjective:['']

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
     
    // if (payload.fresher) {
    // if (Object.is(payload.collegeProject[0].collegeProjectName, '')) {
    //     payload.collegeProject = [];
    //   } else {
    //     payload.collegeProject = payload.collegeProject.map((proj: any) => ({
    //       ...proj,
    //       collegeProjectSkills: Array.isArray(proj.collegeProjectSkills)
    //         ? proj.collegeProjectSkills.join(', ')
    //         : proj.collegeProjectSkills
    //     }));
    //   }
    // } 
 
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
        payload.collegeProject = payload.collegeProject.map((project: any)  => ({
          ...project,
          collegeProjectSkills: Array.isArray(project.collegeProjectSkills)
            ? project.collegeProjectSkills.join(', ')
            : ''
        }));
      }
    } else {
      payload.collegeProject = [];
    }
    
      payload.coreCompentenciesMandatory =  this.candidates?.coreCompentenciesMandatory !== null ? this.candidates?.coreCompentenciesMandatory: false;
    
      payload.softSkillsMandatory =  this.candidates?.softSkillsMandatory !== null ? this.candidates?.softSkillsMandatory: false;
    
      payload.certificatesMandatory =  this.candidates?.certificatesMandatory !== null ? this.candidates?.certificatesMandatory: false;
    
      payload.achievementsMandatory =  this.candidates?.achievementsMandatory !== null ? this.candidates?.achievementsMandatory: false;
    
    this.api.retrieve(route, payload).subscribe({
      next: (response) => {
      
        this.candidateId = response?.id;
        this.dataLoaded = true;
        this.candidates = response as Candidate
       
        
         this.createResume(this.candidates);
      },
      error: (error) => {
        this.dataLoaded = true;
         window.alert('Error in creating please try again');
        console.log(error);
      },
    });
    this.dataLoaded = true;
  }
    else{
      this.showError = true;
       window.alert("Enter the mandatory details")
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
      projectSkills: [[]],
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
      if (removedExperience.id) {
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
      isDeleted: [''],
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
        this.dataLoaded = true;
      },
      error: (error) => {
        this.dataLoaded = true;
        //this.gs.showMessage('Error', 'Error in updating logo.');
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
     else{
          this.certificateEmptyFields = true;
        }

         if(candidate.qualification?.length > 0){
        const qualificationFormArray = this.candidateForm.get('qualification') as FormArray;
        qualificationFormArray.clear();

        candidate.qualification?.forEach(qualification => {
        qualificationFormArray.push(this.createQualificationFormGroup(qualification));
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
         collegeProjectFromArray.push(this.createCollegeProjectFormGroup(collegeProject));
      });
    }
      }
  
    if(candidate.achievements?.length > 0){
      const achievementFormArray = this.candidateForm.get('achievements') as FormArray;
        achievementFormArray.clear();

      candidate.achievements?.forEach(achievement => {
      achievementFormArray.push(this.createAchievementsFormGroup(achievement));
      });
    }
     else{
          this.achievementsEmptyFields = true;
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
        coreCompentencies:candidate?.coreCompentencies ? candidate?.coreCompentencies :[],
        summary:candidate?.summary,
        careerObjective:candidate?.careerObjective,
      });
    }
  
    createCertificateFormGroup(certificate: Certificates): FormGroup {
      return this.fb.group({
        id: certificate.id,
        courseName: certificate.courseName,
        courseStartDate: certificate.courseStartDate ? new Date(certificate.courseStartDate) : null,
        courseEndDate: certificate.courseEndDate ? new Date(certificate.courseEndDate) : null,
        
      });
    }
  
    patchExperiences(experiences: any[]) {
      
      if(experiences?.length > 0){
        const experienceFormArray = this.candidateForm.get('experiences') as FormArray;
        experienceFormArray.clear();
        experiences?.forEach((experience) => {
        
          const experienceForm = this.createExperience();
          experienceForm.patchValue({
            id:experience.id,
            companyName: experience.companyName,
            role: experience.role,
            experienceYearStartDate:  experience.experienceYearStartDate ? new Date(experience.experienceYearStartDate) : null,
            experienceYearEndDate:  experience.experienceYearEndDate ? new Date(experience.experienceYearEndDate) : null,
            currentlyWorking: experience.currentlyWorking,
            responsibilities:experience.responsibilities,
            
          });
         
          if(experience.projects?.length > 0){
            const projectFormArray = experienceForm.get('projects') as FormArray; 
            projectFormArray.clear();
           experience.projects?.forEach((project:any) => {
          
            const projectForm = this.createProject();
            projectForm.patchValue({
              id:project.id,
              projectName: project.projectName,
              projectSkills: project.projectSkills,
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

      const skillsArray = typeof collegeProject.collegeProjectSkills === 'string'
    ? collegeProject.collegeProjectSkills.split(',').map(skill => skill.trim())
    : collegeProject.collegeProjectSkills;

        return this.fb.group({
          id:collegeProject.id,
          collegeProjectName:  collegeProject.collegeProjectName,
          collegeProjectSkills: [skillsArray],
          collegeProjectDescription:collegeProject.collegeProjectDescription,
          isDeleted:false,
        });
      } 

    next(){
      this.ref.close();
      const ref = this.dialog.open(PaymentOptionComponent, {
           
            data: {
              candidates: this.candidates,
              candidateId: this.candidates?.id
            },
            closable: true,
            width: '30%',
            height: '90%',
            styleClass: 'payment-dialog-header',
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
        collegeProjectSkills: [[]],
        collegeProjectDescription: [''],
        
      });
    }

    goBack(){
      this.gs.setCandidateDetails(this.candidates);
      if( this.candidateImageUrl !== null && this.candidateImageUrl !== undefined){
      this.gs.setCandidateImage(this.candidateImageUrl);
      }
      this.router.navigate(['mob-candidate']);
    }

    
    getCandidates() {
      const route = 'candidate';
      this.api.get(route).subscribe({
        next: (response) => {
          const candidate = response as Candidate;
          if(candidate !== null){
           
            this.candidateId =  candidate?.id
             this.candidates = candidate;

            const candidateClone = JSON.parse(JSON.stringify(candidate)); 
            this.patchCandidateForm(candidateClone);
            // this.getCandidateImage(candidate?.id);

            this.getResumeContent('Summary');

            this.getResumeContent('Career Objective');



            //set global
           // this.gs.setCandidateDetails(candidate);
         
        }
        },
      });
    }
  
     getCandidateImage(id: any) {
    const route = `candidate/get-image?candidateId=${id}`;
  
    this.api.getImage(route).subscribe({
      next: (response) => {
        if(response.size > 0){
        this.candidateImageUrl = URL.createObjectURL(response);
        this.dataLoaded = true;

        //set global image
        if( this.candidateImageUrl !== null && this.candidateImageUrl !== undefined){
          this.gs.setCandidateImage(this.candidateImageUrl);
         }
        }
      },
      error: (err) => {
        console.error('Error fetching candidate image:', err);

        this.dataLoaded = false;
      }
    });
  }
  
  addSkill(controlName: string, inputId: string) {
    const inputEl = document.getElementById(inputId) as HTMLInputElement;
    const value = inputEl?.value?.trim();
  
    if (value) {
      const control = this.candidateForm.get(controlName);
      const current = control?.value || [];
  
      if (!current.includes(value)) {
        control?.setValue([...current, value]);
      }
  
      inputEl.value = '';
    }
  }

  createResume(candidates:any) {
    this.ngxLoaderStart();
    const route = 'resume/create';

  const templateName =  localStorage.getItem('templateName');
   if(this.templateName === null || this.templateName === undefined){
     this.templateName = templateName;
    }
    const payload = {...candidates,templateName: this.templateName};

    this.api.retrieve(route,payload).subscribe({
      next: (response) => {
        this.ngxLoaderStop();
                  if (response.resumePdf) {
         const base64String = response.resumePdf.trim();  
        const byteCharacters = atob(base64String);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });

        // Create a link element and trigger download
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = (response.candidateName) + '.pdf';
        document.body.appendChild(a);
        a.click();

        // Clean up
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        window.alert('Your resume is created successfully');
        localStorage.removeItem('resumeName');
        this.ngxLoaderStop();

        this.router.navigate(['/mob-candidate']);
      }
          this.ngxLoaderStop();
      },
      error: (error) => {
        this.gs.showMobileMessage('error',error.error?.message);
        this.ngxLoaderStop();
      }
    });
  }


  ngxLoaderStart(){
    this.isUploading = true;
  }

  ngxLoaderStop(){
    this.isUploading = false;
  }

    getProjectContentCount(experienceIndex: number): boolean {
        const projects = this.experienceControls.at(experienceIndex).get('projects') as FormArray;
        const projectName = projects.controls[0] as any;
        return  projectName.controls.projectName?.value !== '' ? true : false;
    }


    goToOpenAi(){

    this.mobileLoaderComponent.startLoader();

    const route = 'resume/get-content';
    const payload = {...this.candidates};

     this.api.retrieve(route, payload).subscribe({
      next: (response:any) => {
        if(response){

          response.coreCompentenciesMandatory = this.candidates?.coreCompentenciesMandatory;
          response.softSkillsMandatory = this.candidates?.softSkillsMandatory;
          response.achievementsMandatory = this.candidates?.achievementsMandatory;
          response.certificatesMandatory = this.candidates?.certificatesMandatory;

          this.candidateId = response.id;
          this.candidates = response;
      
         const candidateClone = JSON.parse(JSON.stringify(this.candidates)); 
         this.patchCandidateForm(candidateClone);

           this.mobileLoaderComponent.stopLoader();
        }
           this.mobileLoaderComponent.stopLoader();
      },
      error: (error) => {
           this.mobileLoaderComponent.stopLoader();
        this.gs.showMessage('error', error.error?.message)

      },

    });
    
  }


  getResumeContent(content:any){
      
    this.mobileLoaderComponent.startLoader();

       const route =`content/openai?content=${content}`
  
      this.api.get(route).subscribe({
        next: (response) =>{

          if(response){
            const responseContent = response as any;
            if(content === 'Summary'){
               this.candidateForm.get('summary')?.setValue(responseContent?.resumeContent);

           this.mobileLoaderComponent.stopLoader();
            }
            else{
               this.candidateForm.get('careerObjective')?.setValue(responseContent?.resumeContent);

           this.mobileLoaderComponent.stopLoader();
            }
          }
          
        },
        error: (error) => {
        this.dataLoaded = true;
        this.gs.showMessage('Error', 'Please try after some time');

        console.log(error);
      },
      });
    }

}