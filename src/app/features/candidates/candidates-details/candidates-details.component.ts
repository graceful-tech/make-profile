import { DatePipe } from '@angular/common';
import {ChangeDetectorRef,Component, } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { ApiService } from '../../../services/api.service';
import { GlobalService } from '../../../services/global.service';
import { ValueSet } from '../../../models/admin/value-set.model';
import { Subscription } from 'rxjs';
 

@Component({
  selector: 'app-candidates-details',
  standalone: false,
  templateUrl: './candidates-details.component.html',
  styleUrl: './candidates-details.component.css'
})
export class CandidatesDetailsComponent {

  yourResume:Array<any> = [];
    candidateForm!: FormGroup;
    genderList: Array<ValueSet> = [];
    languages: Array<ValueSet> = [];
    showError: boolean = false;
    currentRequest!: Subscription;
    fieldDetails: Array<any> = [];
    dialogRef: any;
    resumeDetails: Array<any> = [];
    resumeDetailsSubscription!: Subscription;
    loaderImagePreview: any;
    userName: any;
    isFresher: boolean = false;
    yearsList: any[] = [];
    dataLoaded: boolean = true;
    maritalStatus: Array<ValueSet> = [];
    candidateImageUrl: any;
    multipartFile: any;
    candidateImageAttachments: any;
    makeProfileUrl: any;
    fieldOfStudy: any;
    inputBgColor = 'lightblue';
    resume:any;

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private gs: GlobalService,
    private datePipe: DatePipe,
    private dialog: DialogService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.createCandidateForm();
    this.loadDummyData();
    this.generateYearList();
    this.getGenderList();
    this.getLanguages();
    this.getMaritalStatus();
    this.getFieldOfStudy();
  }

  loadDummyData() {
    this.yourResume = [
      { id: 1, name: 'Professional Resume', remainingEdits: 3, amountPaid: '$10' },
      { id: 2, name: 'Fresher Resume', remainingEdits: 5, amountPaid: '$5' },
      { id: 3, name: 'Senior Engineer Resume', remainingEdits: 2, amountPaid: '$15' },
      { id: 4, name: 'Designer Resume', remainingEdits: 4, amountPaid: '$8' }
    ];
    this.cdr.detectChanges(); // Ensures UI updates properly
  }

  ngAfterViewInit() {}
  
    createCandidateForm() {
      this.candidateForm = this.fb.group({
        id: [''],
        name: ['', Validators.required],
        mobileNumber: [
          '',
          Validators.compose([Validators.required, Validators.minLength(10)]),
        ],
        email: ['', Validators.compose([Validators.required, Validators.email])],
        gender: [''],
        alternateMobileNumber: [''],
        nationality: [''],
        languagesKnown: [[]],
        isFresher: [''],
        skills: ['', Validators.required],
        linkedIn: [''],
        dob: [''],
        address: [''],
        maritalStatus: [''],
        experiences: this.fb.array([this.createExperience()]),
        qualification: this.fb.array([this.createQualification()]),
        certificates: this.fb.array([this.createCertificates()]),
        achievements: this.fb.array([this.createAchievements()]),
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
  
    generatingResume() {
      this.dataLoaded = false;
  
      const route = 'candidate/create';
      const payload = this.candidateForm.getRawValue();
  
      payload['candidateLogo'] = this.multipartFile;
  
      if (payload.lastWorkingDate) {
        payload['lastWorkingDate'] = this.datePipe.transform(
          payload.lastWorkingDate,
          'yyyy-MM-dd'
        );
      }
      if (payload.isFresher != null && payload.isFresher) {
        payload['isFresher'] = true;
      } else {
        payload['isFresher'] = false;
      }
  
      if (
        Object.is(payload.experiences[0].companyName, '') &&
        Object.is(payload.experiences[0].projects[0].projectName, '')
      ) {
        payload.experiences = [];
      } else {
        payload.qualification.forEach((ele: any) => {
          ele.experienceYearStartDate = this.datePipe.transform(
            ele.experienceYearStartDate,
            'yyyy-MM-dd'
          );
          ele.experienceYearEndDate = this.datePipe.transform(
            ele.experienceYearEndDate,
            'yyyy-MM-dd'
          );
        });
      }
  
      if (Object.is(payload.qualification[0].instutionName, '')) {
        payload.qualification = [];
      } else {
        payload.qualification.forEach((ele: any) => {
          ele.qualificationStartYear = this.datePipe.transform(
            ele.qualificationStartYear,
            'yyyy-MM-dd'
          );
          ele.qualificationEndYear = this.datePipe.transform(
            ele.qualificationEndYear,
            'yyyy-MM-dd'
          );
        });
      }
  
      if (Object.is(payload.achievements[0].achievementsName, '')) {
        payload.achievements = [];
      }
  
      if (Object.is(payload.certificates[0].courseName, '')) {
        payload.certificates = [];
      } else {
        payload.certificates.forEach((ele: any) => {
          ele.courseStartDate = this.datePipe.transform(
            ele.courseStartDate,
            'yyyy-MM-dd'
          );
          ele.courseEndDate = this.datePipe.transform(
            ele.courseEndDate,
            'yyyy-MM-dd'
          );
        });
      }
  
      if (Object.is(payload.languagesKnown, '')) {
        payload.languagesKnown = [];
      }
  
      if (Object.is(payload.skills, '')) {
        payload.skills = [];
      }
  
      this.api.retrieve(route, payload).subscribe({
        next: (response) => {
          this.gs.showMessage('Success', 'Successfully Created Resume');
          this.dataLoaded = true;
          this.uploadCandidateImage();
        },
        error: (error) => {
          this.dataLoaded = true;
          this.gs.showMessage('Error', 'Error in Creating Resume');
  
          console.log(error);
        },
      });
      this.dataLoaded = true;
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
        companyName: ['', Validators.required],
        role: ['', Validators.required],
        experienceYearStartDate: [''],
        experienceYearEndDate: [''],
        projects: this.fb.array([this.createProject()]),
        currentlyWorking: [''],
      });
    }
  
    createProject(): FormGroup {
      return this.fb.group({
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
        this.experienceControls.removeAt(index);
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
        projectArray.removeAt(projectIndex);
      }
    }
  
    //For qualification
  
    createQualification(): FormGroup {
      return this.fb.group({
        instutionName: [''],
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
        this.qualificationControls.removeAt(index);
        this.cdr.detectChanges();
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
        this.certificateControls.removeAt(index);
      }
    }
  
    createCertificates(): FormGroup {
      return this.fb.group({
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
        const achievement = this.achievementsControls.at(index).value;
  
        if (achievement.id) {
          this.achievementsControls.at(index).patchValue({ isDeleted: true });
        } else {
          this.achievementsControls.removeAt(index);
        }
      }
    }
  
    createAchievements(): FormGroup {
      return this.fb.group({
        achievementsName: [''],
        achievementsDate: [''],
        isDeleted: [false],
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
      this.dataLoaded = false;
      const route = 'candiate/logo';
      const formData = new FormData();
      formData.append('attachment', this.multipartFile);
      this.api.upload(route, formData).subscribe({
        next: (response) => {
          this.dataLoaded = true;
          this.reset();
        },
        error: (error) => {
          this.dataLoaded = true;
          this.gs.showMessage('Error', 'Error in updating logo.');
        },
      });
    }


    onEdit(id:any){

    }

    getScore(){

    }

    applyJob(){

    }

    addAttachment(event: any) {
      if (event.target.files[0]) {
        this.multipartFile = event.target.files[0];
        this.resume = { fileName: this.multipartFile?.name };
        this.parseResume();
      }
    }

    parseResume() {
      const route = 'resume/parsing';
      const formData = new FormData();
      formData.append('resume', this.multipartFile);
      this.api.upload(route, formData).subscribe({
        next: (response) => {
          if (response) {
            
          }
        },
      });
    }

    
}
