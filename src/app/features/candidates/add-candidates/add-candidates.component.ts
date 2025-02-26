import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DialogService } from 'primeng/dynamicdialog';
import { ApiService } from '../../../services/api.service';
import { GlobalService } from '../../../services/global.service';
import { ValueSet } from '../../../models/admin/value-set.model';
import { Subscription } from 'rxjs';
import { Lookup } from '../../../models/master/lookup.model';
import { Candidate } from '../../../models/candidates/candidate.model';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';

@Component({
  standalone: false,
  selector: 'app-add-candidates',
  templateUrl: './add-candidates.component.html',
  styleUrl: './add-candidates.component.css',
})
export class AddCandidatesComponent {
  @Output() savedCandidate = new EventEmitter();
  @Input() codeValue!: any;
  @Input() candidateUrl!: any;

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
  dataLoaded: any;
  generatedLink: any;
  clientLocations: Array<Lookup> = [];
  code: any;
  shareJobImageUrl: any;
  requirement: any;
  userName: any;
  isFresher: boolean = false;
  yearsList: any[] = [];
  

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private gs: GlobalService,
    private datePipe: DatePipe,
    private dialog: DialogService,
    private ngxLoader: NgxUiLoaderService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  

  ngOnInit() {
    this.createCandidateForm();
    this.generateYearList();
   // this.createQualification();
    // this.getGenderList();
    // this.getLanguages();
    // this.getNoticePeriodList();
    // this.getFieldDetails();
    // this.getCandidateDetailsById(this.candidateUrl);
    // this.getShareJobLogo(this.codeValue);

    this.candidateForm.controls['isFresher'].valueChanges.subscribe(
      (response: boolean) => {
        // this.patchProfessionalDetails(response);
          this.toggleFresher(response);
      }
    );

    // this.resumeDetailsSubscription = this.gs.resumeDetails$.subscribe(
    //   (response: any) => {
    //     this.resumeDetails = response?.parsedData;

    //     if (this.resumeDetails) {
    //       //this.checkIfMobileNumberExists();
    //     }
    //   }
    // );

    // this.gs.customer$.subscribe((response) => {
    //   this.customer = response;

    //   if (this.customer.id !== null) {
    //     this.getLoaderImage();
    //   }
    // });
  }

  ngAfterViewInit() {}

  toggleFresher(isFresher: boolean) {
    isFresher=== true ?
    this.candidateForm.get('isFresher')?.setValue(true):this.candidateForm.get('isFresher')?.setValue(false)
  }

  createCandidateForm() {
    this.candidateForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      mobileNumber: [
        '',
        Validators.compose([Validators.required, Validators.minLength(10)]),
      ],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      gender: ['', Validators.required],
      alternateMobileNumber: [''],
      languagesKnown: [[]],
      //qualification: ['', Validators.required],
      isFresher: [''],
      companyName: [''],
      designation: [''],
      totalWorkExperience: [''],
      relevantExperience: [''],
      skills: ['', Validators.required],
      currentLocation: [''],
      preferredLocation: [''],
      currentCostToCompany: [''],
      expectedCostToCompany: [''],
      noticePeriod: [''],
      lastWorkingDate: [''],
      reasonToChange: [''],
      sourceOfHiring: [''],
      offers: [''],
      reference: [''],
      remark: [''],
      customFields: this.fb.array([]),
      byCandidate: [false],
      clientLocationId: [''],
      experiences: this.fb.array([this.createExperience()]),
      qualification: this.fb.array([this.createQualification()]),
      certificates: this.fb.array([this.createCertificates()]),
      achievements: this.fb.array([this.createAchievements()])
    });
  }

  patchCandidateForm(candidate: Candidate) {
    this.candidateForm.controls['mobileNumber'].enable();
    let lastWorkingDate = this.datePipe.transform(
      candidate?.lastWorkingDate,
      'dd-MMM-yyyy'
    );

    this.candidateForm.patchValue({
      id: candidate?.id,
      name: candidate?.name,
      mobileNumber: candidate?.mobileNumber,
      alternateMobileNumber: candidate?.alternateMobileNumber,
      email: candidate?.email,
      nationality: candidate?.nationality,
      panNumber: candidate?.panNumber,
      passportNumber: candidate?.passportNumber,
      gender: candidate?.gender,
      languagesKnown: candidate?.languagesKnown,
      isFresher: candidate?.isFresher,
      qualification: candidate?.qualification,
      companyName: candidate?.companyName,
      designation: candidate?.designation,
      totalWorkExperience: candidate?.totalWorkExperience,
      relevantExperience: candidate?.relevantExperience,
      skills: candidate?.skills ? candidate?.skills : [],
      currentLocation: candidate?.currentLocation,
      preferredLocation: candidate?.preferredLocation,
      currentCostToCompany: candidate?.currentCostToCompany,
      expectedCostToCompany: candidate?.expectedCostToCompany,
      noticePeriod: candidate?.noticePeriod,
      lastWorkingDate: lastWorkingDate,
      reasonToChange: candidate?.reasonToChange,
      sourceOfHiring: candidate?.sourceOfHiring,
      reference: candidate?.reference,
      offers: candidate?.offers,
      remark: candidate?.remark,
    });
  }

  patchProfessionalDetails(isFresher: boolean) {
    if (isFresher) {
      this.candidateForm.patchValue({
        companyName: 'Not Applicable',
        designation: 'Not Applicable',
        totalWorkExperience: 0,
        relevantExperience: 0,
        currentLocation: 'Not Applicable',
        currentCostToCompany: 0,
        noticePeriod: 'Immediate',
        reasonToChange: 'Not Applicable',
      });
    } else {
      this.candidateForm.patchValue({
        companyName: '',
        designation: '',
        totalWorkExperience: '',
        relevantExperience: '',
        currentLocation: '',
        currentCostToCompany: '',
        noticePeriod: '',
        reasonToChange: '',
      });
    }
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

  // getLanguages() {
  //   const route = 'value-sets/search-by-code';
  //   const postData = { valueSetCode: 'LANGUAGES' };
  //   this.api.retrieve(route, postData).subscribe({
  //     next: (response) => {
  //       this.languages = response;
  //     },
  //   });
  // }

  // getNoticePeriodList() {
  //   const route = 'value-sets/search-by-code';
  //   const postData = { valueSetCode: 'NOTICE_PERIOD' };
  //   this.api.retrieve(route, postData).subscribe({
  //     next: (response) => {
  //       this.noticePeriodList = response;
  //     },
  //   });
  // }

  // searchMobileNumbers(event: any) {
  //   const route = 'candidates/search-mobile-numbers';
  //   const postData = { mobileNumber: event.query };
  //   this.api.retrieve(route, postData).subscribe({
  //     next: (response) => {
  //       this.mobileNumbers = response as String[];
  //     },
  //   });
  // }

  // getFieldDetails() {
  //   const route = 'field-details';
  //   const payload = {};

  //   this.api.retrieve(route, payload).subscribe({
  //     next: (response) => {
  //       this.fieldDetails = response;
  //       this.addMandatoryValidation();
  //     },
  //   });
  // }

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

  // saveCandidate() {
  //   this.ngxLoader.start();
  //   const route = 'candidates/create';
  //   const payload = this.candidateForm.getRawValue();

  //   if (payload.lastWorkingDate) {
  //     payload['lastWorkingDate'] = this.datePipe.transform(
  //       payload.lastWorkingDate,
  //       'yyyy-MM-dd'
  //     );
  //   }

  //   if (Object.is(payload.languagesKnown, '')) {
  //     payload.languagesKnown = [];
  //   }

  //   if (Object.is(payload.skills, '')) {
  //     payload.skills = [];
  //   }

  //   payload['customFields'] = this.processCustomFieldsData;

  //   payload['candidateUrl'] = this.candidateUrl;

  //   this.api.apply(route, payload, this.userName, this.codeValue).subscribe({
  //     next: (response) => {
  //       this.candidateId = response;
  //       this.uploadResume.candidateId = this.candidateId;
  //       this.uploadResume.uploadResume();
  //       this.savedCandidate.emit({
  //         response: 'success',
  //         candidateId: this.candidateId,
  //       });
  //       this.ngxLoader.stop();
  //     },
  //     error: (error) => {
  //       this.gs.showMessage('Error', 'Error in Updating');
  //       this.savedCandidate.emit({ response: 'error' });
  //       this.ngxLoader.stop();
  //     },
  //   });
  // }

  // getCandidateCustomFields() {
  //   const route = 'custom-fields/retrieve';
  //   const payload = { screenName: 'Candidates' };

  //   this.api.retrieve(route, payload).subscribe({
  //     next: (response) => {
  //       const customFields = response;
  //       if (customFields) {
  //         this.createCandidateCustomFields(customFields);
  //       }

  //       if (this.candidateId) {
  //         this.getCandidateCustomFieldValues();
  //       }
  //     },
  //   });
  // }

  // getCandidateCustomFieldValues() {
  //   const route = 'custom-field-values';
  //   const payload = { screenName: 'Candidates', targetId: this.candidateId };

  //   this.api.retrieve(route, payload).subscribe({
  //     next: (response) => {
  //       const customFieldValues = response;
  //       if (customFieldValues) {
  //         this.customFieldComponents.forEach((customFieldComponent) => {
  //           customFieldComponent.patchCustomFields(customFieldValues);
  //         });
  //       }
  //     },
  //   });
  // }

  // createCandidateCustomFields(customFields: Array<any>) {
  //   this.customFieldComponents.forEach((customFieldComponent) => {
  //     customFieldComponent.reset();
  //   });

  //   const personalCustomFields = customFields.filter(
  //     (customField: any) => customField.sectionName == 'Candidates - Personal'
  //   );
  //   const professionalCustomFields = customFields.filter(
  //     (customField: any) =>
  //       customField.sectionName == 'Candidates - Professional'
  //   );
  //   this.customFieldComponents.forEach((customFieldComponent) => {
  //     if (customFieldComponent.sectionName == 'Candidates - Personal') {
  //       customFieldComponent.createCustomFields(personalCustomFields);
  //     } else if (
  //       customFieldComponent.sectionName == 'Candidates - Professional'
  //     ) {
  //       customFieldComponent.createCustomFields(professionalCustomFields);
  //     }
  //   });
  // }

  // get processCustomFieldsData() {
  //   const customFields: Array<any> = [];
  //   this.customFieldComponents.forEach((customFieldComponent) => {
  //     customFieldComponent.processCustomFieldsData.forEach((customField) => {
  //       customFields.push(customField);
  //     });
  //   });
  //   return customFields;
  // }

  // reset() {
  //   this.candidateId = null;
  //   this.candidateForm.reset();
  //   this.candidateForm.controls['mobileNumber'].enable();
  //   // this.uploadResumeComponent.reset();
  //   this.customFieldComponents.forEach((customFieldComponent) => {
  //     customFieldComponent.reset();
  //   });
  //   this.getCandidateCustomFields();
  //   this.resumeDetails = [];
  //   //this.gs.setResumeDetails(null);
  // }

  // ngOnDestroy() {
  //   this.reset();
  //   if (this.resumeDetailsSubscription) {
  //     this.resumeDetailsSubscription.unsubscribe();
  //   }
  // }

  // getLoaderImage() {
  //   const route = 'customer-miscellaneous/get-loader-image';
  //   const payload = { customerId: this.customer.id };

  //   this.api.downloadFile(route, payload).subscribe({
  //     next: (response) => {
  //       if (response?.size > 30) {
  //         this.loaderImagePreview = URL.createObjectURL(response);
  //       } else {
  //         this.loaderImagePreview = 'assets/logo/loader-logo.png';
  //       }
  //     },
  //     error: (error) => {},
  //   });
  // }

  // getClientLocationsByRequirement(requirementId: number) {
  //   const route = 'requirements/locations';
  //   const postData = { id: requirementId };
  //   this.api.retrieve(route, postData).subscribe({
  //     next: (response) => {
  //       this.clientLocations = response as Lookup[];
  //     },
  //   });
  // }

  // getCandidateDetailsById(candidateUrls: any) {
  //   const route = `candidates?candiateUrl=${candidateUrls}`;
  //   this.api.get(route).subscribe({
  //     next: (response) => {
  //       const candidate = response as Candidate;
  //       this.candidateUrl = candidate.candidateUrl;
  //       this.candidateId = candidate.id;
  //       this.patchCandidateForm(candidate);
  //       this.candidateForm.controls['mobileNumber'].enable();
  //       this.candidateId = candidate.id;
  //       // this.getCandidateCustomFields();
  //       this.userName = candidate.modifiedUserName;

  //       this.uploadResume.resume = candidate.candidateResume;

  //     },
  //   });
  // }

  // getShareJobLogo(customerId: any) {
  //   const route = 'customer-miscellaneous/get-apply-share-job-logo';
  //   const payload = { logoName: customerId };
  //   this.api.downloadFile(route, payload).subscribe({
  //     next: (response) => {
  //       this.shareJobImageUrl = URL.createObjectURL(response);
  //     },
  //   });
  // }
  get experienceControls() {
    return this.candidateForm.get('experiences') as FormArray;
  }

  createExperience(): FormGroup {
    return this.fb.group({
      companyName: ['', Validators.required],
      designation: ['', Validators.required],
      totalWorkExperience: [
        '',
        [Validators.required, Validators.pattern('^[0-9]*$')],
      ],
      projects: this.fb.array([this.createProject()]),
    });
  }

  createProject(): FormGroup {
    return this.fb.group({
      projectName: ['', Validators.required],
      skills: [[]],
      description: ['', Validators.required],
    });
  }

  addExperience(): void {
    this.experienceControls.push(this.createExperience());
  }

  removeExperience(index: number): void {
    const confirmDelete = window.confirm("Are you sure you want to remove this Experience?");
    if (confirmDelete && this.experienceControls.length > 1) {
      this.experienceControls.removeAt(index);
    }
  }

  getProjects(experienceIndex: number): FormArray {
    return this.experienceControls.at(experienceIndex).get('projects') as FormArray;
  }

  getProjectCount(experienceIndex: number): number {
    return (this.experienceControls.at(experienceIndex).get('projects') as FormArray).length;
  }

  getExperienceCount(experienceIndex: number): number{
    return (this.candidateForm.get('experiences') as FormArray).length;
  }
  

  addProject(experienceIndex: number): void {
    this.getProjects(experienceIndex).push(this.createProject());

  }

  removeProject(experienceIndex: number, projectIndex: number): void {

    const confirmDelete = window.confirm("Are you sure you want to remove this Project?");
    const projectArray = this.getProjects(experienceIndex);
    if (confirmDelete && projectArray.length > 1) {
      projectArray.removeAt(projectIndex);
    }
  }


  createQualification(): FormGroup {
    return this.fb.group({
      instutionName: [''],
      department: [''],
      startYear : [''],
      endYear:[''],
      percentage:['']
    });
  }

  get qualificationControls() {
    return this.candidateForm.get('qualification') as FormArray;
  }

  addQualication(){
    this.qualificationControls.push(this.createQualification());
  }
  
  removeQualification(index: number){
    const confirmDelete = window.confirm("Are you sure you want to remove this qualification?");
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

  get certificateControls() {
    return this.candidateForm.get('certificates') as FormArray;
  }

  addCertificates(){
    this.certificateControls.push(this.createCertificates());
  }

  removeCertificates(index: number){
    const confirmDelete = window.confirm("Are you sure you want to remove this certificates?");
    if (confirmDelete && this.certificateControls.length > 1) {
      this.certificateControls.removeAt(index);
    }
  }

  createCertificates(): FormGroup  {
    return this.fb.group({
      courseName: [''],
      courseStartDate: [''],
      courseEndDate : [''],
    });
  }

  get  achievementsControls() {
    return this.candidateForm.get('achievements') as FormArray;
  }

  addAchievements(){
    this.achievementsControls.push(this.createAchievements());
  }

  removeaddAchievements(index: number){
    const confirmDelete = window.confirm("Are you sure you want to remove this achievements?");
    if (confirmDelete && this.achievementsControls.length > 1) {
      this.achievementsControls.removeAt(index);
    }
  }

  createAchievements(): FormGroup  {
    return this.fb.group({
      achievementsName: [''],
      achievementsDate: [''],
    });
  }

  


}
