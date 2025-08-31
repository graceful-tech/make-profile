import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiService } from '../../../services/api.service';
import { GlobalService } from '../../../services/global.service';
import { ValueSet } from '../../../models/admin/value-set.model';
import { Subscription } from 'rxjs';
import { CreateCandidatesComponent } from '../create-candidates/create-candidates.component';
import { Candidate } from 'src/app/models/candidates/candidate.model';
import { Certificates } from 'src/app/models/candidates/certificates';
import { Qualification } from 'src/app/models/candidates/qualification';
import { Achievements } from 'src/app/models/candidates/achievements';
import { Requirement } from 'src/app/models/candidates/requirement.model';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CollegeProject } from 'src/app/models/candidates/college-project';
import { ResumeDetailsComponent } from '../resume-details/resume-details.component';
import { PaymentService } from 'src/app/services/payment.service';
import { ViewHistoryCandidatesComponent } from '../view-history-candidates/view-history-candidates.component';
import { VerifyCandidatesComponent } from '../verify-candidates/verify-candidates.component';
import { ChooseTemplateWayComponent } from '../choose-template-way/choose-template-way.component';
import { LoaderService } from 'src/app/services/loader.service';
import { ReferralComponent } from 'src/app/shared/components/referral/referral.component';
import { ToastService } from 'src/app/services/toast.service';
import { skip } from 'rxjs/operators';

@Component({
  selector: 'app-candidates-details',
  standalone: false,
  templateUrl: './candidates-details.component.html',
  styleUrl: './candidates-details.component.css',
})
export class CandidatesDetailsComponent {
  @ViewChild(ReferralComponent) referralComponent!: ReferralComponent;

  yourResume: Array<any> = [];
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
  candidates: Array<Candidate> = [];
  candidateId: any;
  requirements: any;
  totalRecords!: number;
  currentPage: number = 1;
  maxLimitPerPage: number = 10;
  maxLimitPerPageForResume: number = 5;
  requirementForm!: FormGroup;
  candidateScore: any;
  candidateRelated: any;
  experienceDeletedArray: Array<any> = [];
  qualificationDeletedArray: Array<any> = [];
  certificatesDeletedArray: Array<any> = [];
  achievementsDeletedArray: Array<any> = [];
  returnImage: any;
  collegeProjectDeletedArray: Array<any> = [];
  appliedJobs: any;
  availableCredits: any;
  isUploading: boolean = false;
  customLoaderMessage: any;
  user: any;
  totalCreditsAvailable: number = 0;
  credits: any;
  matchingJob: boolean = false;
  stateNames: any;
  citiesName: any;
  additionalDetailsForm!: FormGroup;
  statusList: any;
  showDetails = false;
  showResumeTable: boolean = false;
  showAppliedJobs: boolean = false;
  showSuggestJobs: boolean = false;
  showCandidates: boolean = false;
  checkedScore: any;
  referral: boolean = false;
  refer: boolean = false;
  referralService: boolean = false;
  overAllCredits: any;
  totalCredits: any;
  editingRow: number | null = null;
  editedNickName: string = '';
  balanceCredits: any;
  navigate: boolean = false;

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    public gs: GlobalService,
    private datePipe: DatePipe,
    private dialog: DialogService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router,
    public ref: DynamicDialogRef,
    private ngxLoader: NgxUiLoaderService,
    private ps: PaymentService,
    private loader: LoaderService,
    private toast: ToastService
  ) {
    localStorage.removeItem('nickName');
    localStorage.removeItem('templateName');

    if (
      sessionStorage.getItem('userId') === null ||
      sessionStorage.getItem('userId') === 'undefined'
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

    this.gs.referral$.subscribe((refer) => {
      this.referralService = refer;
    });
  }

  ngOnInit() {
    this.getUserById();
    this.createCandidateForm();
    this.createRequirementForm();
    this.generateYearList();
    this.getGenderList();
    this.getLanguages();
    this.getMaritalStatus();
    this.getFieldOfStudy();
    this.getAvailableCredits();
    this.toggleAccountMenu();
    this.createAdditionalDetailsForm();
    this.getStateNames();
    this.getSumAvailableCredits();
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
        this.router.navigate(['candidate/analyse-ai']);
      }
    });
  }

  toggleAccountMenu() {
    const accountMenu = document.querySelector('.account-wrapper');

    accountMenu?.addEventListener('click', (event: any) => {
      accountMenu.classList.toggle('show-account-menu');
    });
  }

  close() {
    const accountMenu = document.querySelector('.account-wrapper');
    accountMenu?.classList.remove('show-account-menu');
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
      softSkills: [''],
      coreCompentencies: [''],
      collegeProject: this.fb.array([this.createCollegeProject()]),
      coreCompentenciesMandatory: [''],
      softSkillsMandatory: [''],
      certificatesMandatory: [''],
      achievementsMandatory: [''],
    });
  }

  createRequirementForm() {
    this.requirementForm = this.fb.group({
      id: [''],
      designation: [''],
      locations: [''],
      skills: [[]],
    });
  }

  signOut() {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['']);
  }
  goToViewAccount() {
    console.log('entered view account');
    this.router.navigate(['/candidate/view-account']);
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

      if (payload.dob != null) {
        payload.dob = this.datePipe.transform(payload.dob, 'yyyy-MM-dd');
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
      //   if (Object.is(payload.collegeProject[0].collegeProjectName, '')) {
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
      } else {
        payload.achievements.forEach((cert: any) => {
          cert.achievementsDate = this.datePipe.transform(
            cert.achievementsDate,
            'yyyy-MM-dd'
          );
        });
      }

      if (Object.is(payload.certificates[0].courseName, '')) {
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
      } else {
        const stringList: string[] = payload.languagesKnown;
        const commaSeparatedString: string = stringList.join(', ');
        payload.languagesKnown = commaSeparatedString;
      }

      if (Object.is(payload.skills, '')) {
        payload.skills = '';
      } else {
        const stringList: string[] = payload.skills;
        const commaSeparatedString: string = stringList.join(', ');
        payload.skills = commaSeparatedString;
      }

      if (Object.is(payload.softSkills, '')) {
        payload.softSkills = '';
      } else {
        const stringList: string[] = payload.softSkills;
        const commaSeparatedString: string = stringList.join(', ');
        payload.softSkills = commaSeparatedString;
      }

      if (Object.is(payload.coreCompentencies, '')) {
        payload.coreCompentencies = '';
      } else {
        const stringList: string[] = payload.coreCompentencies;
        const commaSeparatedString: string = stringList.join(', ');
        payload.coreCompentencies = commaSeparatedString;
      }

      if (payload.fresher) {
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
              collegeProjectSkills: Array.isArray(project.collegeProjectSkills)
                ? project.collegeProjectSkills.join(', ')
                : '',
            })
          );
        }
      } else {
        payload.collegeProject = [];
      }

      this.api.retrieve(route, payload).subscribe({
        next: (response) => {
          this.candidateId = response?.id;
          this.dataLoaded = true;
          localStorage.setItem('candidateId', this.candidateId);
          this.candidates = response;
          this.uploadCandidateImage();
          this.dataLoaded = true;

          if (!response?.fresher) {
            this.saveCandidateAddtionalDetails(
              this.candidateId,
              response?.mobileNumber
            );
          }

          this.gs.showMessage('Success', 'Create Successfully');
        },
        error: (error) => {
          this.dataLoaded = true;
          this.gs.showMessage('Error', 'Error in Creating Creating');
        },
      });
      this.dataLoaded = true;
    } else {
      this.showError = true;
    }
  }

  reset() {
    this.candidateForm.reset();
    this.additionalDetailsForm.reset();
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
      projects: this.fb.array([this.createProject()]),
      currentlyWorking: [''],
      responsibilities: [''],
      isDeleted: false,
    });
  }

  createProject(): FormGroup {
    return this.fb.group({
      id: [''],
      projectName: [''],
      projectSkills: [[]],
      projectRole: [''],
      projectDescription: [''],
      isDeleted: false,
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
      isDeleted: false,
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
      courseName: [''],
      courseStartDate: [''],
      courseEndDate: [''],
      isDeleted: false,
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
      isDeleted: false,
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
          this.dataLoaded = true;
        },
        error: (error) => {
          this.dataLoaded = true;
          this.gs.showMessage('Error', 'Error in updating logo.');
        },
      });
    }
    this.dataLoaded = true;
  }

  onEdit(id: any) {}

  checkScore(jobId: any, tenant: any) {
    this.matchingJob = true;

    const route = 'score-check/get-score';
    const formData = new FormData();

    formData.append('jobId', jobId);
    formData.append('candidateId', this.candidateId);
    formData.append('tenant', tenant);

    const payload = {
      jobId: jobId,
      candidateId: this.candidateId,
      tenant: tenant,
    };

    this.api.upload(route, formData).subscribe({
      next: (response) => {
        this.candidateScore = response;
        this.matchingJob = false;
      },
      error: (error) => {
        this.dataLoaded = true;
        this.matchingJob = false;
      },
    });
  }

  getScore(jobId: any, tenant: any) {
    //  this.ngxLoaderStart("hai");
    this.matchingJob = true;
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
          //  this.matchingJob = false;
        } else {
          this.gs.customWebMessage(
            'Oops..!',
            'You don’t have enough credits to check eligibility.',
            'Applied Job',
            'Applied Jobs'
          );
          this.matchingJob = false;
        }
      },
      error: (error) => {
        this.matchingJob = false;
        this.gs.showMessage('error', 'Error in  creating Resume');
      },
    });
  }

  applyJob(jobId: any, tenant: any) {
    const route = 'applied-job/save';
    const candidateIds = this.candidateId;

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
        this.gs.showMessage('error', error.error?.message);
      },
    });
  }

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
    this.ngxLoaderStart('Resume is getting ready, please wait...');

    const route = 'resume-ai/upload';

    const username = sessionStorage.getItem('userName');

    const formData = new FormData();
    formData.append('resume', this.multipartFile);
    formData.append('username', String(username));

    this.api.upload(route, formData).subscribe({
      next: (response) => {
        if (response) {
          this.ngxLoaderStop();
          this.candidates = response;
          this.candidateId = response.id;

          localStorage.setItem('candidateId', this.candidateId);

          this.gs.setCandidateDetails(response);
          this.router.navigate(['candidate/new-details-with-ai']);
        } else {
          this.ngxLoaderStop();
          this.gs.showMessage(
            'Note!..',
            'Error in uploading resume please reupload it '
          );
          window.location.reload();
        }
        this.ngxLoaderStop();
      },
      error: (error) => {
        this.ngxLoaderStop();
        this.gs.showMessage(
          'error',
          'Error in uploading resume please reupload it '
        );
        window.location.reload();
      },
    });
  }

  enterDetails() {
    const ref = this.dialog.open(CreateCandidatesComponent, {
      data: {
        candidates: this.candidates,
        candidateImage: this.candidateImageUrl,
      },
      closable: true,
      width: '70%',
      height: '90%',
      header: 'Create Your Resume',
    });

    ref.onClose.subscribe((response) => {
      if (response) {
        localStorage.setItem('candidateId', response.id);
        this.candidates = response;
        this.candidateId = response.id;
        const candidate = response as Candidate;
        const candidateClone = JSON.parse(JSON.stringify(candidate));
        this.patchCandidateForm(candidateClone);
        this.candidateImageUrl = response.candidateLogo;
      }
      this.getAvailableCredits();
    });

    // this.router.navigate(['candidate/mob-create/view-templates'])
  }

  UpdateCandidate() {
    const ref = this.dialog.open(CreateCandidatesComponent, {
      data: {
        candidates: this.candidates,
        candidateImage: this.candidateImageUrl,
      },
      closable: true,
      width: '70%',
      height: '95%',
      header: 'Update Your Resume',
      styleClass: 'update-dialog-header',
    });

    ref.onClose.subscribe((response) => {
      if (response) {
        this.candidates = response;
        this.candidateId = response.id;
        const candidate = response as Candidate;
        const candidateClone = JSON.parse(JSON.stringify(candidate));
        this.patchCandidateForm(candidateClone);

        this.candidateImageUrl = response.candidateLogo;
      }
      this.getAvailableCredits();
    });
  }

  createResume() {
    if (this.candidateId !== null && this.candidateId !== undefined) {
      const ref = this.dialog.open(ChooseTemplateWayComponent, {
        data: {
          candidates: this.candidates,
          candidateImage: this.candidateImageUrl,
        },
        closable: true,
        styleClass: 'custom-dialog-headers',
      });
    } else {
      this.router.navigate(['candidate/analyse-ai']);
      //this.router.navigate(['candidate/new-details-with-ai']);
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
          collegeProject.collegeProjectSkills =
            collegeProject?.collegeProjectSkills
              ? collegeProject.collegeProjectSkills
                  .split(',')
                  .map((skill: string) => skill.trim())
              : [];
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
      coreCompentenciesMandatory: candidate?.coreCompentenciesMandatory,
      softSkillsMandatory: candidate?.softSkillsMandatory,
      certificatesMandatory: candidate?.certificatesMandatory,
      achievementsMandatory: candidate?.achievementsMandatory,
      summary: candidate?.summary,
      careerObjective: candidate?.careerObjective,
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
  viewUser() {
    this.router.navigate(['viewUser']);
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
          isDeleted: false,
        });

        if (experience.projects?.length > 0) {
          const projectFormArray = experienceForm.get('projects') as FormArray;
          projectFormArray.clear();
          experience.projects?.forEach((project: any) => {
            const projectSkills = project?.projectSkills
              ? project.projectSkills
                  .split(',')
                  .map((skill: string) => skill.trim())
              : [];
            const projectForm = this.createProject();
            projectForm.patchValue({
              id: project.id,
              projectName: project.projectName,
              projectSkills: projectSkills,
              projectRole: project.projectRole,
              projectDescription: project.projectDescription,
              isDeleted: false,
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
      isDeleted: false,
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
      isDeleted: false,
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
              this.gs.showMessage(
                'Sorry...',
                'No jobs found. Try again tomorrow or change your search.'
              );
            }
          }
        },
        error: (err) => {
          this.loader.stop();
          this.gs.showMessage(
            'Error',
            'Error in fetching job please try after sometime'
          );
        },
      });
    } else {
      this.loader.stop();
      this.gs.showMessage(
        'Note..!',
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
    if (confirmDelete && this.collegeProjectControls.length > 1) {
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
      isDeleted: false,
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

  getAvailableCredits() {
    const id = sessionStorage.getItem('userId');

    const route = 'credits';
    const payload = {
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

  getCandidateImage(id: any) {
    const route = `candidate/get-image?candidateId=${id}`;

    this.api.getImage(route).subscribe({
      next: (response) => {
        if (response.size > 0) {
          this.candidateImageUrl = URL.createObjectURL(response);
          this.dataLoaded = true;
        }
      },
      error: (err) => {
        console.error('Error fetching candidate image:', err);
        this.dataLoaded = false;
      },
    });
  }

  ngxLoaderStop() {
    //this.ngxLoader.stop();
    setTimeout(() => {
      this.isUploading = false;
    }, 2000);
  }

  ngxLoaderStart(message: any) {
    this.isUploading = true;
    //  this.ngxLoader.start();
    this.customLoaderMessage = message;
  }

  resumeDetailComponent(candidateDetails: any) {
    const ref = this.dialog.open(ResumeDetailsComponent, {
      data: {
        candidates: candidateDetails,
      },
      closable: true,
      width: '70%',
      height: '90%',
      header: 'Check your details',
    });

    ref.onClose.subscribe((response) => {
      if (response) {
        this.candidates = response;
        this.candidateId = response.id;
        const candidate = response as Candidate;
        const candidateClone = JSON.parse(JSON.stringify(candidate));
        this.patchCandidateForm(candidateClone);
        this.candidateImageUrl = response.candidateLogo;

        this.resume = null;
      }
      this.getAvailableCredits();
    });
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
        }, 1000);
      });

      this.ps.payWithRazorNewPay(amount, templateName, nickName);
    } else {
      alert('Please enter a valid amount ₹10 or more.');
    }
  }

  viewHistory() {
    this.loader.start();

    const route = 'history/candidate';

    this.api.get(route).subscribe({
      next: (response) => {
        const candidateList = response;
        this.viewCandidateSHistory(candidateList);
        this.loader.stop();
      },
      error: (err) => {
        this.loader.stop();
        this.dataLoaded = false;
      },
    });
  }

  viewCandidateSHistory(candidateList: any) {
    const ref = this.dialog.open(ViewHistoryCandidatesComponent, {
      data: {
        candidates: candidateList,
      },
      closable: true,
      width: '80%',
      height: '90%',
      header: 'View History',
    });

    ref.onClose.subscribe((response) => {
      if (response) {
        this.candidates = response;
        this.candidateId = response.id;
        const candidate = response as Candidate;
        const candidateClone = JSON.parse(JSON.stringify(candidate));
        this.patchCandidateForm(candidateClone);
        this.candidateImageUrl = response.candidateLogo;
      }
      this.getAvailableCredits();
    });
  }

  navigateToVerify(templateName: any) {
    if (this.balanceCredits > 0) {
      localStorage.setItem('templateName', templateName);

      this.gs.setCandidateDetails(this.candidates);
      this.gs.setCandidateImage(this.candidateImageUrl);
      this.gs.setResumeName(templateName);

      this.router.navigate(['candidate/verify-details']);
    } else {
    }
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

  openDetails() {
    this.showDetails = true;
  }

  closeDetails() {
    this.showDetails = false;
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
        if (this.showSuggestJobs) {
          this.getCheckedScore();
        }
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
        this.matchingJob = false;
      },
    });
  }

  getCheckedScoreFor(requirement: any): any {
    return this.checkedScore?.find(
      (score: any) =>
        score.jobId === requirement.jobId && score.tenant === requirement.tenant
    );
  }

  chooseTemplate(candidate: any) {
    this.gs.setCandidateDetails(this.candidates);
    this.gs.setCandidateImage(this.candidateImageUrl);
    this.router.navigate(['candidate/template']);
  }

  enterNewDetails() {
    const confirmDelete = window.confirm(
      'Your existing details will be updated with the entered details.'
    );

    if (confirmDelete) {
      this.router.navigate(['candidate/new-details-with-ai']);
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
    this.router.navigate(['candidate/rewards']);
  }

  closeReward() {
    this.referral = false;
  }

  reorder() {
    this.router.navigate(['candidate/reorderd']);
  }

  editNickName(rowIndex: number, credits: any) {
    this.editingRow = rowIndex;
    this.editedNickName = credits.nickName;
  }

  updateNickName(credits: any, templateId: any) {

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
           this.toast.showToast('success','NickName updated successfully')
          }
        },
        error: (error) => {
          this.ngxLoaderStop();
          this.gs.showMessage('error', error.error?.message);
        },
      });

      this.editingRow = null;
    } else {
      this.gs.showMessage('error', 'Plase enter another nickName');
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
}
