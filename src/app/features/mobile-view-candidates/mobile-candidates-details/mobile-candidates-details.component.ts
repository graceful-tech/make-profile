import { DatePipe } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiService } from '../../../services/api.service';
import { GlobalService } from '../../../services/global.service';
import { ValueSet } from '../../../models/admin/value-set.model';
import { Subscription } from 'rxjs';
import { Candidate } from 'src/app/models/candidates/candidate.model';
import { Certificates } from 'src/app/models/candidates/certificates';
import { Experience } from 'src/app/models/candidates/experiences';
import { Qualification } from 'src/app/models/candidates/qualification';
import { Achievements } from 'src/app/models/candidates/achievements';
import { Requirement } from 'src/app/models/candidates/requirement.model';
import { LocalStorage } from '@ng-idle/core';
import { CreateCandidatesComponent } from '../../candidates/create-candidates/create-candidates.component';
import { ChooseTemplateComponent } from '../../candidates/Templates/choose-template/choose-template.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CollegeProject } from 'src/app/models/candidates/college-project';
import { PaymentService } from 'src/app/services/payment.service';
import { ChooseTemplateWayComponent } from '../../candidates/choose-template-way/choose-template-way.component';
import { ChooseNewTemplateComponent } from '../choose-new-template/choose-new-template.component';
import { MobileLoaderComponent } from 'src/app/shared/components/mobile-loader/mobile-loader.component';
import { MobileLoaderService } from 'src/app/services/mobile.loader.service';
import { ToastService } from 'src/app/services/toast.service';
import { Chips } from 'primeng/chips';

@Component({
  selector: 'app-mobile-candidates-details',
  standalone: false,
  templateUrl: './mobile-candidates-details.component.html',
  styleUrl: './mobile-candidates-details.component.css',
})
export class MobileCandidatesDetailsComponent {
  yourResume: Array<any> = [];
  candidateForm!: FormGroup;
  genderList: Array<ValueSet> = [];
  nationalityList: Array<ValueSet> = [];
  languages: Array<ValueSet> = [];
  showError: boolean = false;
  currentRequest!: Subscription;
  fieldDetails: Array<any> = [];
  dialogRef: any;
  resumeDetails: Array<any> = [];
  resumeDetailsSubscription!: Subscription;
  loaderImagePreview: any;
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
  resume: any;
  candidates: any;
  candidateId: any;
  requirements: any;
  totalRecords!: number;
  currentPage: number = 1;
  maxLimitPerPage: number = 10;
  requirementForm!: FormGroup;
  candidateScore: any;
  candidateRelated: any;
  experienceDeletedArray: Array<any> = [];
  qualificationDeletedArray: Array<any> = [];
  certificatesDeletedArray: Array<any> = [];
  achievementsDeletedArray: Array<any> = [];
  returnImage: any;
  collegeProjectDeletedArray: Array<any> = [];
  candidatesUpdateData: any;
  appliedJobs: any;
  availableCredits: any;
  isUploading: boolean = false;
  loading: boolean = true;
  user: any;
  totalCreditsAvailable: number = 0;
  credits: any;
  gettingContent: boolean = false;
  additionalDetailsForm!: FormGroup;
  stateNames: any;
  citiesName: any;
  showResumeTable: boolean = false;
  showAppliedJobs: boolean = false;
  showSuggestJobs: boolean = false;
  showCandidates: boolean = false;
  isEligibile: boolean = false;
  checkedScore: any;
  maxLimitPerPageForResume: number = 5;
  refer: boolean = false;
  referral: boolean = false;
  overAllCredits: any;
  totalCredits: any;
  editingRow: number | null = null;
  editedNickName: string = '';
  balanceCredits: any;
  navigate: boolean = false;
  separatorPattern: RegExp = /[ ,;]+/;

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private gs: GlobalService,
    private datePipe: DatePipe,
    private dialog: DialogService,
    private route: ActivatedRoute,
    private router: Router,
    public ref: DynamicDialogRef,
    private ps: PaymentService,
    private loader: MobileLoaderService,
    private toast: ToastService,
    private el:ElementRef
  ) {
    localStorage.removeItem('nickName');
    localStorage.removeItem('templateName');
  }

  ngOnInit() {
    if (
      sessionStorage.getItem('userId') == null ||
      sessionStorage.getItem('userId') == 'undefined'
    ) {
      this.route.queryParams.subscribe((params) => {
        const token = params['token'];
        const username = params['username'];
        const email = params['email'];
        const id = params['id'];

        sessionStorage.setItem('token', token);
        sessionStorage.setItem('userName', username);
        sessionStorage.setItem('email', email);
        sessionStorage.setItem('userId', id);
      });
    }
    this.getUserById();
    this.createCandidateForm();
    this.createRequirementForm();
    this.generateYearList();
    this.getGenderList();
    this.getLanguages();
    this.getMaritalStatus();
    this.getFieldOfStudy();
    //this.getAppliedJobs();
    this.getAvailableCredits();
    this.toggleAccountMenu();
    this.createAdditionalDetailsForm();
    this.getStateNames();
    // this.getOverallCredits();
    this.getSumAvailableCredits();
    this.getNationalityList();
  }

  async ngAfterViewInit() {
    await this.getCandidates();

    this.gs.navigate$.subscribe((res) => {
      if (res !== null && res !== undefined) {
        this.navigate = res;
      }

      const candidateId = localStorage.getItem('candidateId');

      if (
        (candidateId === null || candidateId === undefined) &&
        this.navigate === false
      ) {
        this.router.navigate(['mob-candidate/analyse-ai']);
      }
    });
  }

  createCandidateForm() {
    this.candidateForm = this.fb.group(
      {
        id: [''],
        name: ['', Validators.required],
        mobileNumber: [
          '',
          Validators.compose([Validators.required, Validators.minLength(10)]),
        ],
        email: [
          '',
          Validators.compose([Validators.required, Validators.email]),
        ],
        gender: ['', Validators.required],
        alternateMobileNumber: [''],
        nationality: [''],
        languagesKnown: [[]],
        fresher: [''],
        skills: ['', Validators.required],
        linkedIn: [''],
        dob: [''],
        address: [''],
        maritalStatus: [''],
        experiences: this.fb.array([]),
        qualification: this.fb.array([]),
        certificates: this.fb.array([]),
        achievements: this.fb.array([]),
        softSkills: [''],
        coreCompentencies: [''],
        collegeProject: this.fb.array([]),
        coreCompentenciesMandatory: [''],
        softSkillsMandatory: [''],
        achievementsMandatory: [''],
        certificatesMandatory: [''],
        summary: [''],
        careerObjective: [''],
        hobbies: [''],
        fatherName: [''],
      },
      { validators: [this.fresherOrExperienceValidator()] }
    );
  }

  fresherOrExperienceValidator() {
    return (formGroup: AbstractControl): { [key: string]: any } | null => {
      const fresher = formGroup.get('fresher')?.value;
      const experiences = formGroup.get('experiences') as FormArray;

      if (!fresher && experiences.length === 0) {
        return { fresherOrExperienceRequired: true };
      }

      return null;
    };
  }

  createRequirementForm() {
    this.requirementForm = this.fb.group({
      id: [''],
      designation: [''],
      locations: [''],
      skills: [[]],
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
    this.loader.start();

    if (this.candidateForm.valid) {
      this.dataLoaded = false;

      const route = 'candidate/create';
      const payload = this.candidateForm.getRawValue();

      if (payload.lastWorkingDate) {
        payload['lastWorkingDate'] = this.datePipe.transform(
          payload.lastWorkingDate,
          'yyyy-MM-dd'
        );
      }

      if (payload.dob == null && payload.dob !== '') {
        payload.dob = this.datePipe.transform(payload.dob, 'yyyy-MM-dd');
      }

      if (payload.fresher === null && payload.experiences.length === 0) {
        payload['fresher'] = true;
      } else if (payload.fresher) {
        payload['fresher'] = true;
      } else {
        payload['fresher'] = false;
      }

      if (payload.fresher) {
        payload.experiences = [];
      }

      if (!payload.fresher) {
        if (
          payload.experiences.length === 0 ||
          Object.is(payload.experiences?.[0]?.companyName, '')
        ) {
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
              ? exp.responsibilities
                  .map((r: any) =>
                    typeof r === 'string' ? r : r.task || r.value || ''
                  )
                  .join(', ')
              : exp.responsibilities;

            let projects = exp.projects || [];
            const hasEmptyProjectName = projects.some(
              (proj: any) => proj.projectName === ''
            );

            if (exp.projects.length === 0 || hasEmptyProjectName) {
              projects = [];
            } else {
              projects = projects.map((proj: any) => ({
                ...proj,
                projectSkills: Array.isArray(proj.projectSkills)
                  ? proj.projectSkills
                      .map((r: any) =>
                        typeof r === 'string' ? r : r.task || r.value || ''
                      )
                      .join(', ')
                  : proj.projectSkills,
              }));
            }

            return {
              ...exp,
              experienceYearStartDate,
              experienceYearEndDate,
              responsibilities,
              projects,
            };
          });
        }
      }

      if (
        payload.qualification.length === 0 ||
        Object.is(payload.qualification[0].institutionName, '')
      ) {
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

      if (
        payload.achievements.length === 0 ||
        Object.is(payload.achievements[0].achievementsName, '')
      ) {
        payload.achievements = [];
      } else {
        payload.achievements.forEach((cert: any) => {
          cert.achievementsDate = this.datePipe.transform(
            cert.achievementsDate,
            'yyyy-MM-dd'
          );
        });
      }

      if (
        payload.certificates.length === 0 ||
        Object.is(payload.certificates[0].courseName, '')
      ) {
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

      if (Object.is(payload.hobbies, '')) {
        payload.hobbies = '';
      } else {
        const hobbiesList: string[] = payload.hobbies;
        const commaSeparatedString: string = hobbiesList
          .map((r: any) =>
            typeof r === 'string' ? r : r.task || r.value || ''
          )
          .join(', ');
        payload.hobbies = commaSeparatedString;
      }

      if (
        payload.languagesKnown.length === 0 ||
        Object.is(payload.languagesKnown, '')
      ) {
        payload.languagesKnown = '';
      } else {
        const stringList: string[] = payload.languagesKnown;
        const commaSeparatedString: string = stringList
          .map((r: any) =>
            typeof r === 'string' ? r : r.task || r.value || ''
          )
          .join(', ');
        payload.languagesKnown = commaSeparatedString;
      }

      if (Object.is(payload.skills, '')) {
        payload.skills = '';
      } else {
        const stringList: string[] = payload.skills;
        const commaSeparatedString: string = stringList
          .map((r: any) =>
            typeof r === 'string' ? r : r.task || r.value || ''
          )
          .join(', ');
        payload.skills = commaSeparatedString;
      }

      if (Object.is(payload.softSkills, '')) {
        payload.softSkills = '';
      } else {
        const stringList: string[] = payload.softSkills;
        const commaSeparatedString: string = stringList
          .map((r: any) =>
            typeof r === 'string' ? r : r.task || r.value || ''
          )
          .join(', ');
        payload.softSkills = commaSeparatedString;
      }

      if (Object.is(payload.coreCompentencies, '')) {
        payload.coreCompentencies = '';
      } else {
        const stringList: string[] = payload.coreCompentencies;
        const commaSeparatedString: string = stringList
          .map((r: any) =>
            typeof r === 'string' ? r : r.task || r.value || ''
          )
          .join(', ');
        payload.coreCompentencies = commaSeparatedString;
      }

      if (payload.fresher) {
        if (
          payload.collegeProject.length === 0 ||
          Object.is(payload.collegeProject[0].collegeProjectName, '')
        ) {
          payload.collegeProject = [];
        } else {
          const hasValidProject = payload.collegeProject.some(
            (project: { collegeProjectName: string }) =>
              project.collegeProjectName &&
              project.collegeProjectName.trim() !== ''
          );

          if (!hasValidProject) {
            payload.collegeProject = [];
          } else {
            payload.collegeProject = payload.collegeProject.map(
              (project: any) => ({
                ...project,
                collegeProjectSkills: Array.isArray(
                  project.collegeProjectSkills
                )
                  ? project.collegeProjectSkills
                      .map((r: any) =>
                        typeof r === 'string' ? r : r.task || r.value || ''
                      )
                      .join(', ')
                  : project.collegeProjectSkills,
              })
            );
          }
        }
      }

      payload.coreCompentenciesMandatory =
        this.candidates?.coreCompentenciesMandatory !== null
          ? this.candidates?.coreCompentenciesMandatory
          : false;

      payload.softSkillsMandatory =
        this.candidates?.softSkillsMandatory !== null
          ? this.candidates?.softSkillsMandatory
          : false;

      payload.certificatesMandatory =
        this.candidates?.certificatesMandatory !== null
          ? this.candidates?.certificatesMandatory
          : false;

      payload.achievementsMandatory =
        this.candidates?.achievementsMandatory !== null
          ? this.candidates?.achievementsMandatory
          : false;

      this.api.retrieve(route, payload).subscribe({
        next: (response) => {
          this.loader.stop();
          this.candidateId = response?.id;
          this.dataLoaded = true;
          this.candidates = response as Candidate;
          localStorage.setItem('candidateId', this.candidateId);

          if (
            this.candidateImageUrl !== undefined &&
            this.multipartFile !== undefined
          ) {
            this.uploadCandidateImage();
          }

          this.gs.setCandidateDetails(this.candidates);

          if (!response?.fresher) {
            this.saveCandidateAddtionalDetails(
              this.candidateId,
              response?.mobileNumber
            );
          }

          this.loader.stop();

          window.alert('Created Successfully');
        },
        error: (error) => {
          this.loader.stop();
          this.dataLoaded = true;
          window.alert('Error in Creating Resume');

          console.log(error);
        },
      });
      this.dataLoaded = true;
    } else {
      this.loader.stop();
      this.showError = true;

      const firstInvalidControl: HTMLElement =
        this.el.nativeElement.querySelector(
          'form .ng-invalid[formcontrolname]'
        );

      if (firstInvalidControl) {
        const parentSection = firstInvalidControl.closest(
          '[id]'
        ) as HTMLElement;

        if (parentSection) {
          parentSection.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
          parentSection.focus({ preventScroll: true });
        } else {
          firstInvalidControl.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }
      }

      this.toast.showToast('error', 'Enter All Mandatory Fields');
      this.candidateForm.markAllAsTouched();
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
      id: [''],
      companyName: [''],
      role: [''],
      experienceYearStartDate: [''],
      experienceYearEndDate: [''],
      projects: this.fb.array([]),
      currentlyWorking: [''],
      responsibilities: [''],
    });
  }

  createProject(): FormGroup {
    return this.fb.group({
      id: [''],
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
    if (confirmDelete && this.experienceControls.length >= 1) {
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
      projectArray.removeAt(projectIndex);
    }
  }

  //For qualification

  createQualification(): FormGroup {
    return this.fb.group({
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
    if (confirmDelete && this.qualificationControls.length >= 1) {
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
    if (confirmDelete && this.certificateControls.length >= 1) {
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
    if (confirmDelete && this.achievementsControls.length >= 1) {
      const removedAchievement = this.achievementsControls.at(index).value;
      if (removedAchievement.id) {
        removedAchievement.isDeleted = true;
        this.achievementsDeletedArray.push(removedAchievement);
        this.achievementsControls.removeAt(index);
      } else {
        this.achievementsControls.removeAt(index);
      }
    }
  }

  createAchievements(): FormGroup {
    return this.fb.group({
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
    if (
      this.candidateImageUrl !== undefined &&
      this.multipartFile !== undefined
    ) {
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

          window.confirm('Error in updating logo.');
        },
      });
    }
  }

  onEdit(id: any) {}

  checkScore(jobId: any, tenant: any) {
    this.ngxLoaderStart();

    const route = 'score-check/get-score';

    const formData = new FormData();
    formData.append('jobId', jobId);
    formData.append('candidateId', this.candidateId);
    formData.append('tenant', tenant);

    //const payload = { jobId: jobId, candidateId: candidateIds, tenant: tenant };

    this.api.upload(route, formData).subscribe({
      next: (response) => {
        if (response) {
          this.candidateScore = response;
          this.ngxLoaderStop();
          this.isEligibile = false;
        }
        this.isEligibile = false;
      },
      error: (error) => {
        this.ngxLoaderStop();
        window.alert('Error in  matching job');
        this.isEligibile = false;
      },
    });
  }

  getScore(jobId: any, tenant: any) {
    this.isEligibile = true;
    const route = 'credits/redeem';

    const userId = sessionStorage.getItem('userId');

    const payload = {
      userId: userId,
      templateName: 'Applied Job',
    };

    this.api.retrieve(route, payload).subscribe({
      next: (response) => {
        this.credits = response as any;

        if (this.credits) {
          this.checkScore(jobId, tenant);
        } else {
          this.gs.customMobileMessageWithNickName(
            'Oops..!',
            'You don’t have enough credits to check eligibility.',
            'Applied Job',
            'Applied Job'
          );
          this.isEligibile = false;
        }
      },
      error: (error) => {
        this.isEligibile = false;
        this.gs.showMobileMessage('error', 'Error in Matching job');
      },
    });
  }

  applyJob(jobId: any, tenant: any) {
    const route = 'applied-job/save';
    const candidateIds = '23';

    const payload = {
      candidateId: candidateIds,
      jobId: jobId,
      tenant: tenant,
    };

    this.api.retrieve(route, payload).subscribe({
      next: (response) => {
        if (response) {
          this.toggleSection('suggested');
          this.toggleSection('applied');
        }
      },
      error: (error) => {
        this.ngxLoaderStop();
        window.confirm('Error in applying job please reapply it');
      },
    });
  }

  // addAttachment(event: any) {
  //   if (event.target.files[0]) {
  //     this.multipartFile = event.target.files[0];
  //     this.resume = { fileName: this.multipartFile?.name };
  //     // this.parseResume();
  //   }
  // }

  addAttachment(event: any) {
    if (this.candidateId !== null && this.candidateId !== undefined) {
      const confirmDelete = window.confirm(
        'Your existing details will be updated based on your uploaded resume.'
      );

      if (confirmDelete && event.target.files[0]) {
        this.multipartFile = event.target.files[0];
        this.resume = { fileName: this.multipartFile?.name };
        this.parseResume();
      }
    } else {
      if (event.target.files[0]) {
        this.multipartFile = event.target.files[0];
        this.resume = { fileName: this.multipartFile?.name };
        this.parseResume();
      }
    }
  }

  parseResume() {
    this.ngxLoaderStart();

    const route = 'resume-ai/upload';

    const username = sessionStorage.getItem('userName');

    const formData = new FormData();
    formData.append('resume', this.multipartFile);
    formData.append('userName', String(username));

    this.api.upload(route, formData).subscribe({
      next: (response) => {
        if (response !== null) {
          this.candidates = response;
          this.candidateId = response.id;

          localStorage.setItem('candidateId', this.candidateId);
          this.gs.setCandidateDetails(this.candidates);

          this.router.navigate(['mob-candidate/enter-new-details']);

          this.ngxLoaderStop();
        } else {
          window.alert('Please reupload the resume');
          this.ngxLoaderStop();
        }
      },
      error: (error) => {
        this.ngxLoaderStop();
        window.confirm('Error in uploading resume please reupload it');
        window.location.reload();
      },
    });
  }

  enterDetails() {
    this.gs.setCandidateDetails(null);
    this.router.navigate(['mob-candidate/create-candidate']);
  }

  UpdateCandidate() {
    this.gs.setCandidateDetails(this.candidates);
    this.router.navigate(['mob-candidate/create-candidate']);
  }

  createResume() {
    if (this.candidates !== null && this.candidates !== undefined) {
      this.dialog.open(ChooseNewTemplateComponent, {
        data: {
          candidates: this.candidates,
        },
        closable: true,
        styleClass: 'custom-dialog-headers',
      });
    } else {
      this.router.navigate(['mob-candidate/analyse-ai']);
    }
  }

  patchCandidateForm(candidate: Candidate) {
    candidate.languagesKnown = candidate?.languagesKnown
      ? candidate.languagesKnown.split(',').map((skill: string) => skill.trim())
      : [];
    candidate.skills = candidate?.skills
      ? candidate.skills.split(',').map((skill: string) => skill.trim())
      : [];
    candidate.softSkills = candidate?.softSkills
      ? candidate.softSkills.split(',').map((skill: string) => skill.trim())
      : [];
    candidate.coreCompentencies = candidate?.coreCompentencies
      ? candidate.coreCompentencies
          .split(',')
          .map((skill: string) => skill.trim())
      : [];

    candidate.hobbies = candidate?.hobbies
      ? candidate.hobbies.split(',').map((skill: string) => skill.trim())
      : [];

    if (candidate.certificates?.length > 0) {
      const certificateFormArray = this.candidateForm.get(
        'certificates'
      ) as FormArray;
      certificateFormArray.clear();

      candidate.certificates?.forEach((certificate) => {
        certificateFormArray.push(this.createCertificateFormGroup(certificate));
      });
    }

    if (candidate.experiences?.length > 0) {
      this.patchExperiences(candidate.experiences);
    } else {
      if (candidate.collegeProject?.length > 0) {
        const collegeProjectFromArray = this.candidateForm.get(
          'collegeProject'
        ) as FormArray;
        collegeProjectFromArray.clear();

        candidate.collegeProject?.forEach((collegeProject) => {
          collegeProjectFromArray.push(
            this.createCollegeProjectFormGroup(collegeProject)
          );
        });
      }
    }

    if (candidate.qualification?.length > 0) {
      const qualificationFormArray = this.candidateForm.get(
        'qualification'
      ) as FormArray;
      qualificationFormArray.clear();

      candidate.qualification?.forEach((qualification) => {
        qualificationFormArray.push(
          this.createQualificationFormGroup(qualification)
        );
      });
    }

    if (candidate.achievements?.length > 0) {
      const achievementFormArray = this.candidateForm.get(
        'achievements'
      ) as FormArray;
      achievementFormArray.clear();

      candidate.achievements?.forEach((achievement) => {
        achievementFormArray.push(
          this.createAchievementsFormGroup(achievement)
        );
      });
    }

    const candidateDob = candidate.dob ? new Date(candidate.dob) : null;

    this.candidateForm.patchValue({
      id: candidate?.id,
      name: candidate?.name,
      mobileNumber: candidate?.mobileNumber,
      email: candidate?.email,
      gender: candidate?.gender,
      nationality: candidate?.nationality,
      languagesKnown: candidate?.languagesKnown,
      fresher: candidate?.fresher,
      skills: candidate?.skills,
      linkedIn: candidate?.linkedIn,
      dob: candidateDob,
      address: candidate?.address,
      maritalStatus: candidate?.maritalStatus,
      softSkills: candidate?.softSkills,
      coreCompentencies: candidate?.coreCompentencies,
      summary: candidate?.summary,
      coreCompentenciesMandatory: candidate?.coreCompentenciesMandatory,
      softSkillsMandatory: candidate?.softSkillsMandatory,
      certificatesMandatory: candidate?.certificatesMandatory,
      achievementsMandatory: candidate?.achievementsMandatory,
      careerObjective: candidate?.careerObjective,
      hobbies: candidate?.hobbies ? candidate?.hobbies : [],
      fatherName: candidate?.fatherName,
    });
  }

  createCertificateFormGroup(certificate: Certificates): FormGroup {
    return this.fb.group({
      id: certificate.id,
      courseName: certificate.courseName,
      courseStartDate: certificate.courseStartDate
        ? new Date(certificate.courseStartDate)
        : null,
      courseEndDate: certificate.courseEndDate
        ? new Date(certificate.courseEndDate)
        : null,
      isDeleted: [''],
    });
  }

  patchExperiences(experiences: any[]) {
    if (experiences?.length > 0) {
      const experienceFormArray = this.candidateForm.get(
        'experiences'
      ) as FormArray;
      experienceFormArray.clear();
      experiences?.forEach((experience) => {
        const responsibilities = experience?.responsibilities
          ? experience.responsibilities
              .split(',')
              .map((res: string) => res.trim())
          : [];

        const experienceForm = this.createExperience();
        experienceForm.patchValue({
          id: experience.id,
          companyName: experience.companyName,
          role: experience.role,
          experienceYearStartDate: experience.experienceYearStartDate
            ? new Date(experience.experienceYearStartDate)
            : null,
          experienceYearEndDate: experience.experienceYearEndDate
            ? new Date(experience.experienceYearEndDate)
            : null,
          currentlyWorking: experience.currentlyWorking,
          responsibilities: responsibilities,
        });

        if (experience.projects?.length > 0) {
          const projectFormArray = experienceForm.get('projects') as FormArray;
          projectFormArray.clear();
          experience.projects?.forEach((project: any) => {
            const projectSkills = project.projectSkills
              ? project.projectSkills
                  .split(',')
                  .map((res: string) => res.trim())
              : [];

            const projectForm = this.createProject();
            projectForm.patchValue({
              id: project.id,
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

  createQualificationFormGroup(qualification: Qualification) {
    return this.fb.group({
      id: qualification.id,
      institutionName: qualification.institutionName,
      department: qualification.department,
      qualificationStartYear: qualification.qualificationStartYear
        ? new Date(qualification.qualificationStartYear)
        : null,
      qualificationEndYear: qualification.qualificationEndYear
        ? new Date(qualification.qualificationEndYear)
        : null,
      percentage: qualification.percentage,
      fieldOfStudy: qualification.fieldOfStudy,
    });
  }

  createAchievementsFormGroup(achievement: Achievements) {
    const formattedStartDate = this.datePipe.transform(
      achievement.achievementsDate,
      'yyyy-MM-dd'
    );
    return this.fb.group({
      id: achievement.id,
      achievementsName: achievement.achievementsName,
      achievementsDate: achievement.achievementsDate
        ? new Date(achievement.achievementsDate)
        : null,
    });
  }

  getRequirements() {
    if (
      this.requirementForm.controls['locations'].value !== '' &&
      this.requirementForm.controls['skills'].value.length > 0
    ) {
      this.loader.start();
      const route = 'hurecom/get-requirements';

      const payload = this.requirementForm.getRawValue();

      (payload['page'] = this.currentPage),
        (payload['limit'] = this.maxLimitPerPage);

      this.api.retrieve(route, payload).subscribe({
        next: (response) => {
          this.loader.stop();

          if (response) {
            this.getCheckedScore();
            this.requirements = response?.results as Requirement[];
            this.totalRecords = response?.totalRecords;

            if (response?.results.length === 0) {
              window.alert(
                'Sorry... No jobs found. Try again tomorrow or change your search.'
              );
            }
          }
          this.loader.stop();
        },
        error: (err) => {
          this.loader.stop();
          window.alert('Error in fetching job try another time');
        },
      });
    } else {
      window.confirm(
        'Please enter the both skills and locations for Searching the job'
      );
    }
  }

  get collegeProjectControls() {
    return this.candidateForm.get('collegeProject') as FormArray;
  }

  addCollegeProject() {
    this.collegeProjectControls.push(this.createCollegeProject());
  }

  getCollegeProjectCount(collegeProjectIndex: number): number {
    return (this.candidateForm.get('collegeProject') as FormArray).length;
  }

  removeCollegeProject(index: number) {
    const confirmDelete = window.confirm(
      'Are you sure you want to remove this project?'
    );
    if (confirmDelete && this.collegeProjectControls.length >= 1) {
      const removeCollegeProject = this.collegeProjectControls.at(index).value;
      if (removeCollegeProject.id) {
        removeCollegeProject.isDeleted = true;
        this.collegeProjectDeletedArray.push(removeCollegeProject);
        this.collegeProjectControls.removeAt(index);
      } else {
        this.collegeProjectControls.removeAt(index);
      }
    }
  }

  createCollegeProject(): FormGroup {
    return this.fb.group({
      id: [''],
      collegeProjectName: [''],
      collegeProjectSkills: [''],
      collegeProjectDescription: [''],
    });
  }

  onPageChange(event: any) {
    this.currentPage = event.page + 1;
    this.maxLimitPerPage = event.rows;
    this.getRequirements();
  }

  resetRequirement() {
    this.requirementForm.reset();
    window.location.reload();
  }

  getAppliedJobs() {
    const id = localStorage.getItem('candidateId');

    if (id !== null && id !== undefined) {
      const route = `applied-job?candidateId=${id}`;
      this.api.get(route).subscribe({
        next: (response) => {
          this.appliedJobs = response;
        },
      });
    }
  }

  getCandidates(): Promise<void> {
    return new Promise((resolve, reject) => {
      const route = 'candidate';
      this.api.get(route).subscribe({
        next: (response) => {
          const candidate = response as Candidate;
          if (candidate !== null) {
            this.candidates = response as any;
            this.candidateId = candidate?.id;
            localStorage.setItem('candidateId', this.candidateId);

            this.gs.setCandidateDetails(this.candidates);

            const candidateClone = JSON.parse(JSON.stringify(candidate));
            this.patchCandidateForm(candidateClone);
            this.getCandidateImage(candidate?.id);
            this.getAdditionaDetails(candidate?.mobileNumber);
          }
          resolve();
        },
        error: (err) => {
          this.dataLoaded = false;
          reject(err);
        },
      });
    });
  }

  // getCandidates() {
  //   const route = 'candidate';
  //   this.api.get(route).subscribe({
  //     next: (response) => {
  //       const candidate = response as Candidate;
  //       if (candidate !== null) {
  //         this.candidateId = candidate?.id;
  //         localStorage.setItem('candidateId', this.candidateId);
  //         this.candidates = candidate;
  //         const candidateClone = JSON.parse(JSON.stringify(candidate));
  //         this.patchCandidateForm(candidateClone);
  //         this.getCandidateImage(candidate?.id);

  //         //set global
  //         this.gs.setCandidateDetails(candidate);

  //         this.getAdditionaDetails(candidate?.mobileNumber);
  //       }
  //     },
  //   });
  // }

  getAvailableCredits() {
    const id = sessionStorage.getItem('userId');

    const route = 'credits';
    const payload = {
      userId: id,
      page: this.currentPage,
      limit: this.maxLimitPerPageForResume,
    };
    this.api.create(route, payload).subscribe({
      next: (response) => {
        if (response?.results.length > 0) {
          this.availableCredits = response?.results as any;
          if (response?.totalRecords > 0) {
            this.toggleSection('resume');
          }
          this.refer = true;

          localStorage.setItem('referralAmount', 'paid');
        }
        this.totalRecords = response?.totalRecords;
      },
    });
  }

  createCollegeProjectFormGroup(collegeProject: CollegeProject) {
    const skillsArray =
      typeof collegeProject.collegeProjectSkills === 'string'
        ? collegeProject.collegeProjectSkills
            .split(',')
            .map((skill) => skill.trim())
        : collegeProject.collegeProjectSkills;

    return this.fb.group({
      id: collegeProject.id,
      collegeProjectName: collegeProject.collegeProjectName,
      collegeProjectSkills: [skillsArray],
      collegeProjectDescription: collegeProject.collegeProjectDescription,
      isDeleted: false,
    });
  }

  getCandidateImage(id: any) {
    const route = `candidate/get-image?candidateId=${id}`;

    this.api.getImage(route).subscribe({
      next: (response) => {
        if (response.size > 0) {
          this.candidateImageUrl = URL.createObjectURL(response);
        }
        this.dataLoaded = true;

        if (
          this.candidateImageUrl !== null &&
          this.candidateImageUrl !== undefined
        ) {
          this.gs.setCandidateImage(this.candidateImageUrl);
        }
      },
      error: (err) => {
        console.error('Error fetching candidate image:', err);
        this.dataLoaded = false;
      },
    });
  }

  ngxLoaderStop() {
    // this.ngxLoader.stop();
    setTimeout(() => {
      this.isUploading = false;
    }, 2000);
  }

  ngxLoaderStart() {
    this.isUploading = true;
    // this.ngxLoader.start();
  }

  signOut() {
    sessionStorage.clear();
    this.router.navigate(['']);
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

  toggleAccountMenu() {
    const accountMenu = document.querySelector('.account-wrapper');

    accountMenu?.addEventListener('click', (event: any) => {
      accountMenu.classList.toggle('show-account-menu');
    });
  }

  getUserById() {
    // const route = `users/${this.userId}`;

    const route = `user/get_user/${sessionStorage.getItem('userName')}`;
    this.api.get(route).subscribe({
      next: (response) => {
        this.user = response;
      },
    });
  }

  close() {
    const accountMenu = document.querySelector('.account-wrapper');
    accountMenu?.classList.remove('show-account-menu');
  }

  payment(templateName: any, nickName: any) {
    const confirmedAmount = prompt('Enter final amount in ₹', '10');

    const amountNum = Number(confirmedAmount);

    if (!isNaN(amountNum) && Number.isInteger(amountNum) && amountNum >= 10) {
      const amount = amountNum * 100;
      const paymentType = 'Resume';

      this.ps.initRazorPays(() => {
        setTimeout(() => {
          this.getAvailableCredits();
        }, 2000);
      });

      this.ps.payWithRazorNewPay(amount, templateName, nickName);
    } else {
      alert('Please enter a valid amount ₹10 or more.');
    }
  }

  viewHistory() {
    this.router.navigate(['mob-candidate/view-history']);
  }

  navigateToVerify(templateName: any) {
    localStorage.setItem('templateName', templateName);
    this.gs.setResumeName(templateName);

    if (
      this.candidateImageUrl !== null &&
      this.candidateImageUrl !== undefined
    ) {
      this.gs.setCandidateImage(this.candidateImageUrl);
    }
    this.gs.setCandidateDetails(this.candidates);

    this.router.navigate(['mob-candidate/edit-candidate']);
  }

  payForApplyingJOb() {
    const confirmedAmount = prompt('Enter final amount in ₹', '10');

    const amountNum = Number(confirmedAmount);

    if (!isNaN(amountNum) && Number.isInteger(amountNum) && amountNum >= 10) {
      const amount = amountNum * 100;
      const paymentType = 'Resume';

      this.ps.initRazorPays(() => {});

      this.ps.payWithRazorNewPay(amount, 'Applied Job', 'Applied Job');
    } else {
      alert('Please enter a valid amount ₹10 or more.');
    }
  }

  createAdditionalDetailsForm() {
    this.additionalDetailsForm = this.fb.group({
      stateName: ['', Validators.required],
      preferredLocation: ['', Validators.required],
      currentCostToCompany: [''],
      expectedCostToCompany: [''],
      totalWorkExperience: [''],
      relevantExperience: [''],
      companyName: [''],
      qualification: [''],
    });
  }

  selectedState(event: any) {
    const stateId = event.value;

    const route = 'cities/retrive-cities';
    const stateIdList: Array<any> = [];
    stateId.forEach((state: any) => {
      stateIdList.push(state);
    });

    const postData = { stateIdList: stateIdList };
    this.api.retrieve(route, postData).subscribe({
      next: (response: any) => {
        this.citiesName = response;
      },
    });
  }

  getStateNames() {
    const route = 'cities';
    this.api.get(route).subscribe({
      next: (response: any) => {
        this.stateNames = response;
      },
    });
  }

  saveCandidateAddtionalDetails(id: any, number: any) {
    if (this.additionalDetailsForm.valid) {
      const stateIds = this.additionalDetailsForm.controls['stateName'].value;

      const selectedStateNames = stateIds
        .map((id: any) => {
          const state = this.stateNames.find((s: any) => s.id == id);
          return state ? state.stateName : null;
        })
        .filter((name: string | null) => name !== null)
        .join(', ');

      const location =
        this.additionalDetailsForm.controls['preferredLocation'].value;

      const preferredLocation = location.join(', ');

      const route = 'candidate/save-additoinal-details';
      const payload = this.additionalDetailsForm.getRawValue();

      payload['stateName'] = selectedStateNames;
      payload['candidateId'] = id;
      payload['preferredLocation'] = preferredLocation;
      payload['mobileNumber'] = number;

      this.api.retrieve(route, payload).subscribe({
        next: (response: any) => {},
      });
    }
  }

  patchAdditionalDetails(additonalDetails: any) {
    const stateNameArray = additonalDetails?.stateName
      ? additonalDetails.stateName
          .split(',')
          .map((state: string) => state.trim())
      : [];

    const matchedStateIds = stateNameArray
      .map((name: string) => {
        const state = this.stateNames.find((s: any) => s.stateName === name);
        return state ? state.id : null;
      })
      .filter((id: any) => id !== null);

    const preferredLocationArray = additonalDetails?.preferredLocation
      ? additonalDetails.preferredLocation
          .split(',')
          .map((city: string) => city.trim())
          .filter(
            (city: string) =>
              city && this.citiesName.some((c: any) => c.cityName === city)
          )
      : [];

    this.additionalDetailsForm.patchValue({
      stateName: matchedStateIds,
      preferredLocation: preferredLocationArray,
      currentCostToCompany: additonalDetails?.currentCostToCompany,
      expectedCostToCompany: additonalDetails?.expectedCostToCompany,
      totalWorkExperience: additonalDetails?.totalWorkExperience,
      relevantExperience: additonalDetails?.relevantExperience,
      companyName: additonalDetails?.companyName,
      qualification: additonalDetails?.qualification,
    });
  }

  getAdditionaDetails(number: any) {
    const route = `candidate/by_mobile?mobile=${number}`;
    this.api.get(route).subscribe({
      next: (response: any) => {
        if (response) {
          const candidateAdditinalDetails = response;

          this.getPrefferedLocationByStateId(response);
        }
      },
      error: (error) => {},
    });
  }

  getPrefferedLocationByStateId(additonalDetails: any) {
    const stateNameArray = additonalDetails?.stateName
      ? additonalDetails.stateName
          .split(',')
          .map((state: string) => state.trim())
      : [];

    const matchedStateIds = stateNameArray
      .map((name: string) => {
        const state = this.stateNames.find((s: any) => s.stateName === name);
        return state ? state.id : null;
      })
      .filter((id: any) => id !== null);

    const route = 'cities/retrive-cities';
    const postData = { stateIdList: matchedStateIds };
    this.api.retrieve(route, postData).subscribe({
      next: (response: any) => {
        this.citiesName = response;

        this.patchAdditionalDetails(additonalDetails);
      },
    });
  }

  toggleSection(section: string) {
    switch (section) {
      case 'resume':
        this.showResumeTable = !this.showResumeTable;
        break;
      case 'applied':
        this.showAppliedJobs = !this.showAppliedJobs;

        if (this.showAppliedJobs) {
          this.getAppliedJobs();
        }
        break;
      case 'suggested':
        this.showSuggestJobs = !this.showSuggestJobs;
        break;
      case 'showCandidates':
        this.showCandidates = !this.showCandidates;

        setTimeout(() => {
          window.scrollBy({ top: 300, behavior: 'smooth' });
        }, 100);
        break;
    }
  }

  isButtonEnabled(requirement: any): boolean {
    const hasCandidateMatch =
      this.candidateScore?.related &&
      this.candidateScore?.score !== null &&
      requirement.jobId === this.candidateScore?.jobId;

    const hasCheckedMatch = this.checkedScore?.some(
      (score: any) =>
        score.jobId === requirement.jobId && score.tenant === requirement.tenant
    );

    return hasCandidateMatch || hasCheckedMatch;
  }

  handleApply(requirement: any): void {
    const isEnabled = this.isButtonEnabled(requirement);

    if (isEnabled) {
      this.applyJob(requirement.jobId, requirement.tenant);
    } else {
      alert('Error: You cannot apply for this job at the moment.');
    }
  }

  getCheckedScore() {
    const candidateId = localStorage.getItem('candidateId');
    const route = `score-check/get-checked-score?candidateId=${candidateId}`;

    this.api.get(route).subscribe({
      next: (response) => {
        if (response) {
          this.checkedScore = response;
        }
      },
      error: (error) => {
        this.dataLoaded = true;
      },
    });
  }

  getCheckedScoreFor(requirement: any): any {
    return this.checkedScore?.find(
      (score: any) =>
        score.jobId === requirement.jobId && score.tenant === requirement.tenant
    );
  }

  enterNewDetails() {
    const confirmDelete = window.confirm(
      'Your existing details will be updated with the entered details.'
    );

    if (confirmDelete) {
      this.gs.setCandidateDetails(null);
      this.router.navigate(['mob-candidate/analyse-ai']);
    }
  }

  getAvailableCreditss() {
    const id = sessionStorage.getItem('userId');

    const route = 'credits';
    const payload = {
      userId: id,
      page: this.currentPage,
      limit: this.maxLimitPerPageForResume,
    };
    this.api.create(route, payload).subscribe({
      next: (response) => {
        if (response) {
          this.availableCredits = response?.results as any;
        }
        this.totalRecords = response?.totalRecords;
      },
    });
  }

  onPageChangeTemplate(event: any) {
    this.currentPage = event.page + 1;
    this.maxLimitPerPageForResume = event.rows;
    this.getAvailableCreditss();
  }

  referAndEarn() {
    this.referral = !this.referral;
  }

  goToRewards() {
    this.router.navigate(['mob-candidate/rewards']);
  }

  closeRewards() {
    this.referral = false;
  }

  getOverallCredits() {
    const id = sessionStorage.getItem('userId');

    const route = 'credits/get-allcredits';

    this.api.get(route).subscribe({
      next: (response) => {
        if (response) {
          this.overAllCredits = response as any;

          this.totalCredits = this.overAllCredits?.creditAvailable;
        }
      },
    });
  }

  editNickName(rowIndex: number, credits: any) {
    this.editingRow = rowIndex;
    this.editedNickName = credits.nickName;
  }

  updateNickName(credits: any, templateId: any) {
    console.log('Updated Nick Name:', credits.nickName, templateId);

    let status: boolean = false;

    this.availableCredits.forEach((ele: any) => {
      if (ele.nickName === this.editedNickName) {
        status = true;
      }
    });

    if (!status) {
      const route = 'credits/save-nickname';

      const payload = {
        id: templateId,
        nickName: this.editedNickName,
      };

      this.api.retrieve(route, payload).subscribe({
        next: (response) => {
          if (response) {
            credits.nickName = this.editedNickName;

            this.toast.showToast('success', 'NickName updated successfully');
          }
        },
        error: (error) => {
          this.ngxLoaderStop();
          this.gs.showMessage('error', error.error?.message);
        },
      });

      this.editingRow = null;
    } else {
      this.gs.showMessage('Error', 'Plase enter another nickName');
    }
  }

  cancelEdit() {
    this.editingRow = null;
  }

  getSumAvailableCredits() {
    const userId = sessionStorage.getItem('userId');

    const route = 'credits/get-available-credits';
    this.api.get(route).subscribe({
      next: (response) => {
        this.balanceCredits = response as any;
      },
    });
  }

  goToCreditHistory() {
    this.router.navigate(['mob-candidate/mob-credit-history']);
  }

  getNationalityList() {
    const route = 'value-sets/search-by-code';
    const postData = { valueSetCode: 'NATIONALITY' };
    this.api.retrieve(route, postData).subscribe({
      next: (response) => {
        this.nationalityList = response;
      },
    });
  }
}
