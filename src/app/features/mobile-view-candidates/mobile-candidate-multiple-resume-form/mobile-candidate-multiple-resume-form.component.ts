import { ActivatedRoute, Router } from '@angular/router';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { ApiService } from '../../../services/api.service';
import { GlobalService } from '../../../services/global.service';
import { ValueSet } from '../../../models/admin/value-set.model';
import { elementAt, Subscription } from 'rxjs';
import { Lookup } from '../../../models/master/lookup.model';
import { Candidate } from 'src/app/models/candidates/candidate.model';
import { Qualification } from 'src/app/models/candidates/qualification';
import { Certificates } from 'src/app/models/candidates/certificates';
import { Achievements } from 'src/app/models/candidates/achievements';
import { CollegeProject } from 'src/app/models/candidates/college-project';
import { LoaderService } from 'src/app/services/loader.service';
import { ToastService } from 'src/app/services/toast.service';
import { Project } from 'src/app/models/candidates/project';
import { Component, EventEmitter, Output } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  NgForm,
  Validators,
} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { LoaderControllerService } from 'src/app/services/loader-controller.service';


@Component({
  selector: 'app-mobile-candidate-multiple-resume-form',
  standalone: false,
  templateUrl: './mobile-candidate-multiple-resume-form.component.html',
  styleUrl: './mobile-candidate-multiple-resume-form.component.css'
})
export class MobileCandidateMultipleResumeFormComponent {
  @Output() closeUploadResume = new EventEmitter<any>();

  step = 1; // current step tracker
  candidateForm!: FormGroup;
  genderList: Array<ValueSet> = [];
  languages: Array<ValueSet> = [];
  nationalityList: Array<ValueSet> = [];
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
  inputBgColor = 'lightblue';
  candidates: any;
  isDeleted: boolean = false;
  payments: boolean = false;
  candidatesDetails: Array<Candidate> = [];
  experienceDeletedArray: Array<any> = [];
  qualificationDeletedArray: Array<any> = [];
  certificatesDeletedArray: Array<any> = [];
  achievementsDeletedArray: Array<any> = [];
  imageName: any;
  returnImage: any;
  collegeProjectDeletedArray: Array<any> = [];
  returnCandidate: any;
  resumeName: any;
  fieldsName: any;
  experience: boolean = true;
  personalDetails: boolean = true;
  course: boolean = true;
  achievements: boolean = true;
  extraSkills: boolean = true;
  qualification: boolean = true;
  isUploading: boolean = false;
  citiesName: any;
  stateNames: any;
  fieldOfStudy: any;
  additionalDetailsForm: any;
  showExperienceError: boolean = false;
  templateName: any;
  showOtherFields: boolean = false;
  jobRole = '';
  skills = '';
  name = '';
  mobile = '';
  email = '';
  gender = '';
  jobRoleEntered = false;
  showSuggestions = false;
  filteredJobs: any;
  showAllFields: boolean = false;
  hideSkillbutton: boolean = false;
  showUploadResume: boolean = false;
  showSuggestJonFields: boolean = false;
  selectedResumeOption: 'Yes' | 'No' | null = null;
  resume: any;
  isSchoolEducationOpen = true;
  isCollegeEducationOpen = false;
  isDiplomaEducationOpen = false;
  schoolEducationlength: number = 0;
  showSchoolError: boolean = false;
  showCollegeError: boolean = false;
  showSoftSkillsError: boolean = false;
  showCoreCompentenciesError: boolean = false;
  showHobbiesError: boolean = false;
  schoolEducation: Array<ValueSet> = [];
  suggestedSkills: any;
  suggestedSoftSkills: any;
  suggestedCoreCompentencies: any;
  firstSkillApiCalled = false;
  showLanguageKnownError: boolean = false;
  showNationalityError: boolean = false;
  showFatherNameError: boolean = false;
  showDobError: boolean = false;
  showMartialError: boolean = false;
  diplomaEducationlength: number = 0;
  diplomaEducation: Array<ValueSet> = [];
  showStrengthsError: boolean = false;
  showGoalsError: boolean = false;
  showExtraCurricularError: boolean = false;

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private gs: GlobalService,
    private datePipe: DatePipe,
    private router: Router,
    public ref: DynamicDialogRef,
    private toast: ToastService,
    private newLoader: LoaderControllerService
  ) {
  }

  ngOnInit() {
    this.createCandidateForm();
    this.createCandidateForm();
    this.generateYearList();
    this.getGenderList();
    this.getLanguages();
    this.getMaritalStatus();
    this.getFieldOfStudy();
    // this.getStateNames();
    this.getNationalityList();
    this.getSchoolEducationFields();
    this.getDiplomaEducationFields();
  }

  ngAfterViewInit() { }

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
        nationality: [''],
        languagesKnown: [''],
        fresher: [''],
        skills: ['', Validators.required],
        linkedIn: [''],
        dob: [''],
        address: [''],
        maritalStatus: [''],
        experiences: this.fb.array([]),
        qualification: this.fb.array([this.createQualification()]),
        certificates: this.fb.array([]),
        achievements: this.fb.array([]),
        softSkills: [''],
        coreCompentencies: [''],
        collegeProject: this.fb.array([]),
        coreCompentenciesMandatory: [''],
        softSkillsMandatory: [''],
        certificatesMandatory: [''],
        achievementsMandatory: [''],
        summary: [''],
        careerObjective: [''],
        fatherName: [''],
        hobbies: [''],
        schoolEducation: this.fb.array([this.createSchoolEducation()]),
        diplomaEducation: this.fb.array([this.createDiplomaEducation()]),
        strengths: [''],
        goals: [''],
        extraCurricularActivities: [''],

      }
      // { validators: [this.fresherOrExperienceValidator()] }
    );
  }

  onJobInput() {
    const input = this.jobRole.toLowerCase();

    const route = 'job-category';

    if (input !== '') {
      const payload = {
        searchName: input,
      };
      this.api.retrieve(route, payload).subscribe({
        next: (response: any) => {
          this.stateNames = response;
          this.filteredJobs = this.stateNames?.categoryName;
        },
      });

      this.showSuggestions =
        this.stateNames?.categoryName.length > 0 && !this.jobRoleEntered;
    } else {
      this.showSuggestions = false;
    }
  }

  hideBUtton(key: any) {
    if (key === 'skills') {
      this.hideSkillbutton = true;
      this.showAllFields = true;
    }
  }

  selectJob(job: string) {
    this.jobRole = job;
    this.showSuggestions = false;
  }

  hideSuggestionsWithDelay() {
    setTimeout(() => {
      this.showSuggestions = false;
    }, 250);
  }

  nextStep(jobRoleField: any) {
    if (jobRoleField.valid) {
      this.jobRoleEntered = true;
      this.showOtherFields = true;
    } else {
      jobRoleField.control.markAsTouched();
    }
  }

  submitForm(form: NgForm) {
    const isjobRoleValid = this.jobRole?.trim()?.length === 10;
    const isMobileValid = this.mobile?.trim()?.length === 10;
    const isEmailValid = this.email.trim()?.length > 0;
    const isGender = this.email.trim()?.length > 0;

    if (
      !form.valid ||
      !isMobileValid ||
      !isEmailValid ||
      !isGender ||
      isjobRoleValid
    ) {
      this.toast.showToast('error', 'Enter All Mandatory Fields');
      Object.values(form.controls).forEach((control) =>
        control.markAsTouched()
      );
      return;
    }

    localStorage.setItem('userJobInterest', this.jobRole);
    this.next();
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

  getStateNames() {
    const route = 'cities';
    this.api.get(route).subscribe({
      next: (response: any) => {
        this.stateNames = response;
      },
    });
  }

  getGenderList() {
    const route = 'value-sets/search-by-code';
    const postData = { valueSetCode: 'GENDER' };
    this.api.retrieve(route, postData).subscribe({
      next: (response: any) => {
        this.genderList = response;
      },
    });
  }

  // async next() {
  //   if (this.step < 5 && this.step > 1 && this.step !== 3) {
  //     this.step++;
  //   } else if (this.step === 1) {

  //     this.step++;

  //   } else if (this.step === 3) {
  //     const fresher = this.candidateForm.get('fresher')?.value;
  //     const experiences = this.candidateForm.get('experiences') as FormArray;

  //     if (!fresher && experiences.length === 0) {
  //       this.showExperienceError = true;

  //       this.candidateForm.get('fresher')?.valueChanges.subscribe(() => {
  //         this.hideExperienceErrorIfValid('fresher');
  //       });

  //       (
  //         this.candidateForm.get('experiences') as FormArray
  //       ).valueChanges.subscribe(() => {
  //         this.hideExperienceErrorIfValid('exp');
  //       });
  //     } else {
  //       const payload = this.candidateForm.getRawValue();

  //       if (
  //         (payload.experiences.length > 0 &&
  //           payload.experiences?.[0]?.companyName !== '') ||
  //         fresher
  //       ) {
  //         this.step++;
  //       } else {
  //         this.toast.showToast('info', 'Enter your Experience Details');
  //       }
  //     }
  //   }
  // }

  async next() {


    switch (this.step) {

      case 1:
        this.step++;
        break;

      case 2:
        this.showSchoolError = false;
        this.showCollegeError = false;
        const isFresher = localStorage.getItem('isFresher');
        if (isFresher === 'true') {

          const schoolEducation = this.candidateForm.get('schoolEducation') as FormArray;
          const qualification = this.candidateForm.get('qualification') as FormArray;

          if (schoolEducation.length > 0) {
            const firstGroup = schoolEducation.at(0) as FormGroup;
            const schoolName = firstGroup.get('schoolName')?.value;

            if (!schoolName || schoolName.trim() === '') {
              this.showSchoolError = true;
              this.toast.showToast('error', 'Please enter atleast one Schooling Details');
              break;
            }

          }

          if (qualification.length > 0) {
            const firstGroup = qualification.at(0) as FormGroup;
            const institutionName = firstGroup.get('institutionName')?.value;

            if (!institutionName || institutionName.trim() === '') {
              this.showCollegeError = true;
              this.toast.showToast('error', 'Please enter one  College Details');
              break;
            }

          }
          this.step++;
        }
        else {
          this.step++;
        }
        break;

      case 3:
        const fresher = this.candidateForm.get('fresher')?.value;
        const experiences = this.candidateForm.get('experiences') as FormArray;

        if (!fresher && experiences.length === 0) {
          this.showExperienceError = true;

          this.candidateForm.get('fresher')?.valueChanges.subscribe(() => {
            this.hideExperienceErrorIfValid('fresher');
          });

          (this.candidateForm.get('experiences') as FormArray).valueChanges.subscribe(() => {
            this.hideExperienceErrorIfValid('exp');
          });

        } else {
          const payload = this.candidateForm.getRawValue();

          if (
            (payload.experiences.length > 0 &&
              payload.experiences?.[0]?.companyName !== '') ||
            fresher
          ) {
            this.step++;
          } else {
            this.toast.showToast('info', 'Enter your Experience Details');
          }
        }
        break;


      default:
        if (this.step < 5 && this.step > 1 && this.step !== 3) {
          this.step++;
        }
        break;
    }
  }

  hideExperienceErrorIfValid(field: any) {
    const result = this.fresherOrExperienceValidator()(this.candidateForm);
    if (!result) {
      this.showExperienceError = false;
    }
  }

  back() {
    if (this.step > 1) {
      this.step--;
    }
  }

  submit() {
    const isFresher = localStorage.getItem('isFresher');

    if (isFresher === 'true') {
      const ValidateMandatory = this.checkAllDetailsMandatoryForFreshers();
      if (ValidateMandatory) {
        localStorage.removeItem('skillsData');
        this.createCandidateAfterLogin();
      }
      else {
        this.toast.showToast('error', 'Enter All Mandatory Fields');
      }
    }
    else {
      localStorage.removeItem('skillsData');
      this.createCandidateAfterLogin();
    }


  }

  havingResume(key: any) {
    if (key === 'Yes') {
      this.showUploadResume = true;
      this.showSuggestJonFields = false;
      this.selectedResumeOption = 'Yes';
    }
    if (key === 'No') {
      this.showUploadResume = false;
      this.showSuggestJonFields = true;
      this.selectedResumeOption = 'No';
    }
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

  createCandidateAfterLogin() {


    this.candidateForm.get('mobileNumber')?.setValue(this.mobile);
    this.candidateForm.get('email')?.setValue(this.email);
    this.candidateForm.get('gender')?.setValue(this.gender);
    this.candidateForm.get('name')?.setValue(this.name);
    this.candidateForm.get('skills')?.setValue(this.skills);


    this.startProcess();

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
      payload.schoolEducation.length === 0 ||
      payload.schoolEducation?.every((s: any) => s.schoolName?.trim() === '')

    ) {
      payload.schoolEducation = [];
    } else {
      payload.schoolEducation.forEach((q: any) => {
        q.schoolStartYear = this.datePipe.transform(
          q.schoolStartYear,
          'yyyy-MM-dd'
        );
        q.schoolEndYear = this.datePipe.transform(
          q.schoolEndYear,
          'yyyy-MM-dd'
        );
      });
    }


    if (
      payload.diplomaEducation.length === 0 ||
      payload.diplomaEducation?.every((s: any) => s.diplomaInstitutionName?.trim() === '')
    ) {
      payload.diplomaEducation = [];
    } else {
      payload.diplomaEducation.forEach((q: any) => {
        q.diplomaStartYear = this.datePipe.transform(
          q.diplomaStartYear,
          'yyyy-MM-dd'
        );
        q.diplomaEndYear = this.datePipe.transform(
          q.diplomaEndYear,
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

    if (Object.is(this.skills, '')) {
      payload.skills = '';
    } else {
      const stringList: any = this.skills;
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

    if (Object.is(payload.strengths, '')) {
      payload.strengths = '';
    } else {
      const stringList: string[] = payload.strengths;
      const commaSeparatedString: string = stringList
        .map((r: any) =>
          typeof r === 'string' ? r : r.task || r.value || ''
        )
        .join(', ');
      payload.strengths = commaSeparatedString;
    }

    if (Object.is(payload.goals, '')) {
      payload.goals = '';
    } else {
      const stringList: string[] = payload.goals;
      const commaSeparatedString: string = stringList
        .map((r: any) =>
          typeof r === 'string' ? r : r.task || r.value || ''
        )
        .join(', ');
      payload.goals = commaSeparatedString;
    }

    if (Object.is(payload.extraCurricularActivities, '')) {
      payload.extraCurricularActivities = '';
    } else {
      const stringList: string[] = payload.extraCurricularActivities;
      const commaSeparatedString: string = stringList
        .map((r: any) =>
          typeof r === 'string' ? r : r.task || r.value || ''
        )
        .join(', ');
      payload.extraCurricularActivities = commaSeparatedString;
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
        if (response) {
          this.stopProcess();
          this.candidateId = response?.id;
          this.candidates = response;

          localStorage.setItem('candidateId', this.candidateId);

          this.gs.setCandidateDetails(response);

          this.router.navigate(['mob-candidate/choose-Template']);
        }
      },
      error: (error) => {
        this.stopProcess();
        this.dataLoaded = true;
        this.gs.showMessage('Error', 'Error in Creating Detais');

        console.log(error);
      },
    });
    this.dataLoaded = true;

  }

  reset() {
    this.candidateForm.reset();
  }

  async createCandidate() {
    this.startProcess();

    const isValid = await this.checkIfDetailsExists(
      this.candidateForm.get('mobileNumber')?.value
    );

    if (this.candidateForm.valid && isValid) {
      this.dataLoaded = false;

      const route = 'user/create-by-resume';
      const postData = {
        name: this.candidateForm.get('name')?.value,
        email: this.candidateForm.get('email')?.value,
        mobileNumber: this.candidateForm.get('mobileNumber')?.value,
        userName: this.candidateForm.get('name')?.value,
      };

      this.api.retrieve(route, postData).subscribe({
        next: (response) => {
          if (response) {
            this.gs.navigate.next(false);
            sessionStorage.setItem('authType', 'custom');
            sessionStorage.setItem('token', response.token);
            sessionStorage.setItem('userName', response.userName);
            sessionStorage.setItem('mobileNumber', response.mobileNumber);
            sessionStorage.setItem('userId', response.id);
            sessionStorage.setItem('password', response.password);

            this.createCandidateAfterLogin();
          }
        },
        error: (error) => {
          this.stopProcess();
          this.dataLoaded = true;
          this.gs.showMessage(error.error?.status, error.error?.message);
        },
      });
    } else {
      this.stopProcess();
      this.showError = true;
      this.toast.showToast('error', 'Enter All Mandatory Fields');
      this.candidateForm.markAllAsTouched();
    }
  }



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
      isDeleted: false,
    });
  }

  createProject(): FormGroup {
    return this.fb.group({
      id: [''],
      projectName: [''],
      projectSkills: [''],
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

    if (confirmDelete && projectArray.length >= 1) {
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
      id: [''],
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
      id: [''],
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
      id: [''],
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
      next: (response: any[]) => {
        this.fieldOfStudy = response.map(item => ({
          ...item,

          filterText: item.displayValue
            ? item.displayValue.replace(/\./g, '').toLowerCase()
            : ''
        }));
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
          this.gs.showMessage('Error', 'Error in updating logo.');
        },
      });
    }
  }

  close(response: any) {
    this.ref.close(response);
  }

  createCertificateFormGroup(certificate: Certificates): FormGroup {
    return this.fb.group({
      id: certificate.id,
      courseName: certificate.courseName,
      courseStartDate: this.toValidDate(certificate.courseStartDate),
      courseEndDate: this.toValidDate(certificate.courseEndDate),
      isDeleted: [''],
    });
  }

  createQualificationFormGroup(qualification: Qualification) {
    return this.fb.group({
      id: qualification.id,
      institutionName: qualification.institutionName,
      department: qualification.department,
      qualificationStartYear: this.toValidDate(
        qualification.qualificationStartYear
      ),
      qualificationEndYear: this.toValidDate(
        qualification.qualificationEndYear
      ),
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
      achievementsDate: this.toValidDate(achievement.achievementsDate),
      isDeleted: false,
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
      isDeleted: false,
    });
  }

  getResumeContent(content: any) {
    this.startProcess();

    const route = `content/openai?content=${content}`;

    this.api.get(route).subscribe({
      next: (response) => {
        if (response) {
          const responseContent = response as any;
          if (content === 'Summary') {
            this.candidateForm
              .get('summary')
              ?.setValue(responseContent?.resumeContent);

            this.stopProcess();
          } else {
            this.candidateForm
              .get('careerObjective')
              ?.setValue(responseContent?.resumeContent);

            this.stopProcess();
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
      },
    });
  }

  home() {
    this.router.navigate(['enter-details']);
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

  openSoftSkillsExample() {
    const popup = document.getElementById('examplePopup');
    if (popup !== null) {
      popup.style.display = popup.style.display === 'block' ? 'none' : 'block';
    }
  }

  openSoftCoreCompentienciesExample() {
    const popup = document.getElementById('exampleCorePopup');
    if (popup !== null) {
      popup.style.display = popup.style.display === 'block' ? 'none' : 'block';
    }
  }

  copyTextToChips(text: string, controlName: string) {
    const control = this.candidateForm.get(controlName);
    if (control) {
      let currentValue = control.value || [];
      // Prevent duplicates
      if (!currentValue.includes(text)) {
        currentValue.push(text);
        control.setValue(currentValue);
      }
    }
  }

  toValidDate(value: any): Date | null {
    if (!value || value === 'NaN/NaN/NaN') return null;

    if (value instanceof Date && !isNaN(value.getTime())) return value;

    if (typeof value === 'string') {
      const trimmed = value.trim();

      // dd/MM/yyyy format
      const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(trimmed);
      if (match) {
        const day = parseInt(match[1], 10);
        const month = parseInt(match[2], 10) - 1;
        const year = parseInt(match[3], 10);
        const date = new Date(year, month, day);
        return !isNaN(date.getTime()) ? date : null;
      }

      // fallback
      const date = new Date(trimmed);
      return !isNaN(date.getTime()) ? date : null;
    }

    return null;
  }

  loginIntoApplication() {
    const route = 'user/create';
    const postData = { valueSetCode: 'NATIONALITY' };
    this.api.retrieve(route, postData).subscribe({
      next: (response) => { },
    });
  }
  checkIfDetailsExists(mobile: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (mobile && mobile.length === 10) {
        const route = 'candidate/check_mobile';
        const formData = new FormData();
        formData.append('mobile', mobile);

        this.api.upload(route, formData).subscribe({
          next: (response) => {
            const control = this.candidateForm.get('mobileNumber');
            if (control) {
              if (response === true) {
                control.setErrors({
                  ...(control.errors || {}),
                  mobileExists: true,
                });
                resolve(false);
              } else {
                if (control.hasError('mobileExists')) {
                  const errors = { ...control.errors };
                  delete errors['mobileExists'];
                  control.setErrors(Object.keys(errors).length ? errors : null);
                }
                resolve(true);
              }
            }
          },
          error: (err) => {
            console.error('Error checking mobile number:', err);
            resolve(false);
          },
        });
      } else {
        resolve(false);
      }
    });
  }



  saveCandidate(): Promise<boolean> {
    this.startProcess();

    this.candidateForm.get('mobileNumber')?.setValue(this.mobile);
    this.candidateForm.get('email')?.setValue(this.email);
    this.candidateForm.get('gender')?.setValue(this.gender);
    this.candidateForm.get('name')?.setValue(this.name);
    this.candidateForm.get('skills')?.setValue(this.skills);

    return new Promise((resolve, reject) => {
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
            this.candidateId = response?.id;
            this.dataLoaded = true;
            this.candidates = response;

            this.stopProcess();
            this.gs.setCandidateDetails(response);

            resolve(true);
          },
          error: (error) => {
            this.stopProcess();
            this.dataLoaded = true;
            this.gs.showMessage('Error', 'Error in Creating Resume');

            resolve(true);
          },
        });
        this.dataLoaded = true;
      } else {
        // this.stopProcess();
        // this.showError = true;
        // this.toast.showToast('error', 'Enter All Mandatory Fields');
        // this.candidateForm.markAllAsTouched();

        resolve(true);
      }
    });
  }

  goHome() {
    this.router.navigate(['/get-details-using-ai']);
  }

  moveTo(step: any) {
    if (this.step > step && step !== 1) {
      this.step = step;
    }

    if (step === 1) {
      this.step = 1;
    }
  }

  allowOnlyNumbers(event: KeyboardEvent) {
    const pattern = /[0-9]/;
    if (!pattern.test(event.key)) {
      event.preventDefault();
    }
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
    this.startProcess();

    const route = 'resume-ai/upload-resume';

    const formData = new FormData();
    formData.append('resume', this.multipartFile);

    this.api.upload(route, formData).subscribe({
      next: async (response) => {
        if (response) {
          this.candidates = response as any;
          const mobile = response?.mobileNumber;

          let valid = true;
          if (mobile !== null && mobile !== undefined) {
            valid = await this.checkIfDetailsExists(mobile);
          }

          if (valid) {
            this.showSuggestJonFields = true;
            this.gs.setCandidateDetails(response);
            this.patchResponseCandidate(response);
            this.stopProcess();
          } else {
            this.stopProcess();

            this.resume = null;
          }
        } else {
          this.stopProcess();
          this.gs.showMobileMessage(
            'Note!..',
            'Error in uploading resume please reupload it '
          );
          window.location.reload();
        }
        this.stopProcess();
      },
      error: (error) => {
        this.stopProcess();
        this.gs.showMessage(
          'error',
          'Error in uploading resume please reupload it '
        );
        window.location.reload();
      },
    });
  }


  patchResponseCandidate(candidates: any) {
    this.stopProcess();

    this.patchCandidateForm(candidates);

    this.name = candidates?.name;
    this.mobile = candidates?.mobileNumber;
    this.skills = candidates?.skills;
    this.gender = candidates?.gender;
    this.email = candidates?.email;
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

    if (candidate.certificates?.some((c) => c && c.courseName?.trim())) {
      const certificateFormArray = this.candidateForm.get(
        'certificates'
      ) as FormArray;
      certificateFormArray.clear();

      candidate.certificates?.forEach((certificate) => {
        certificateFormArray.push(this.createCertificateFormGroup(certificate));
      });
    }

    if (candidate.experiences?.some((e) => e && e.companyName.trim())) {
      this.patchExperiences(candidate.experiences);
    } else {
      if (
        candidate?.collegeProject.some((c) => c && c.collegeProjectName.trim())
      ) {
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

    if (
      candidate.qualification?.some(
        (q) => q && (q.institutionName?.trim() || q.fieldOfStudy?.trim())
      )
    ) {
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

    if (candidate.achievements?.some((a) => a && a.achievementsName.trim())) {
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
      softSkills: candidate?.softSkills ? candidate?.softSkills : [],
      coreCompentencies: candidate?.coreCompentencies
        ? candidate?.coreCompentencies
        : [],
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
          experienceYearStartDate: this.isValidDate(
            experience.experienceYearStartDate
          ),

          experienceYearEndDate: this.isValidDate(
            experience.experienceYearEndDate
          ),

          currentlyWorking: experience.currentlyWorking,
          responsibilities: responsibilities,
        });

        if (experience?.projects.some((p: Project) => p?.projectName?.trim())) {
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

  isValidDate(value: any): Date | null {
    if (!value || value === 'NaN/NaN/NaN') return null;

    if (value instanceof Date && !isNaN(value.getTime())) return value;

    if (typeof value === 'string') {
      const trimmed = value.trim();

      // dd/MM/yyyy format
      const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(trimmed);
      if (match) {
        const day = parseInt(match[1], 10);
        const month = parseInt(match[2], 10) - 1;
        const year = parseInt(match[3], 10);
        const date = new Date(year, month, day);
        return !isNaN(date.getTime()) ? date : null;
      }

      // fallback
      const date = new Date(trimmed);
      return !isNaN(date.getTime()) ? date : null;
    }

    return null;
  }

  startProcess() {
    const messages = [
      'Please wait...',
      'Preparing things for you...',
      'Almost ready...',
      'Just a moment more...',
      'Ready to view...',
    ];

    this.newLoader.showLoader(messages, 3500);
  }

  stopProcess() {
    this.newLoader.hideLoader();
  }



  toggleEducation(keys: any) {
    if (keys === 'isSchoolEducationOpen') {
      this.isSchoolEducationOpen = !this.isSchoolEducationOpen;
    }
    else if (keys === 'isDiplomaEducationOpen') {
      this.isDiplomaEducationOpen = !this.isDiplomaEducationOpen;
    }
    else {
      this.isCollegeEducationOpen = !this.isCollegeEducationOpen;
    }
  }

  createSchoolEducation(): FormGroup {
    return this.fb.group({
      id: [''],
      schoolName: [''],
      educationLevel: [''],
      schoolStartYear: [''],
      schoolEndYear: [''],
      percentage: ['']
    });
  }

  get schoolControls() {
    return this.candidateForm.get('schoolEducation') as FormArray;
  }

  addSchoolEducation() {
    this.schoolControls.push(this.createSchoolEducation());
    this.schoolEducationlength = this.schoolEducationlength + 1;
  }

  removeSchoolEducation(index: number) {
    const confirmDelete = window.confirm(
      'Are you sure you want to remove this school education?'
    );
    if (confirmDelete && this.schoolControls.length >= 1) {
      this.schoolControls.removeAt(index);
      this.schoolEducationlength = this.schoolEducationlength - 1;
    }

  }

  getSchoolEducationFields() {
    const route = 'value-sets/search-by-code';
    const postData = { valueSetCode: 'SCHOOL_QUALIFICATION' };
    this.api.retrieve(route, postData).subscribe({
      next: (response) => {
        this.schoolEducation = response;
      },
    });
  }

  onSkillAdded(event: any) {
    if (!this.firstSkillApiCalled && this.skills.length === 1) {
      const firstSkill = this.skills;
      this.firstSkillApiCalled = true;
      this.callAISkillAPI(firstSkill);
    }
  }

  callAISkillAPI(skill: string) {
    this.startSuggestedProcess();
    const route = `content/get-suggested-skills?skills=${skill}`;
    this.api.get(route).subscribe({
      next: (response) => {
        if (response) {
          localStorage.setItem('skillsData', JSON.stringify(response));

          const suggested = response as any;

          this.suggestedSkills = suggested?.skills;
          this.suggestedSoftSkills = suggested?.softSkills;
          this.suggestedCoreCompentencies = suggested?.coreCompentencies;

          this.stopProcess();
        }
      },
      error: (error) => {
        this.stopProcess();
        this.dataLoaded = true;
      },
    });
  }


  startSuggestedProcess() {
    const messages = [
      'Get Suggested Skills From Ai...',
      'Please Wait...',
      'Almost Done...',
      'Ready To View...'
    ];

    this.newLoader.showLoader(messages, 4000);
  }



  addSkill(newSkill: string, key: any) {
    const skills = this.candidateForm.get(key)?.value || [];

    if (key === 'skills') {
      if (newSkill && !this.skills.includes(newSkill)) {
        this.skills = this.skills.concat(newSkill);
      }
    }
    else {
      if (newSkill && !skills.includes(newSkill)) {
        const updatedSkills = [...skills, newSkill];
        this.candidateForm.get(key)?.setValue(updatedSkills);
      }
    }
  }

  goBack() {
    this.router.navigate(['mob-candidate']);
  }

  checkAllDetailsMandatoryForFreshers(): boolean {

    const languageKnown = this.candidateForm.get('languagesKnown')?.value;
    const dob = this.candidateForm.get('dob')?.value;
    const fatherName = this.candidateForm.get('fatherName')?.value;
    const nationality = this.candidateForm.get('nationality')?.value;
    const martialStatus = this.candidateForm.get('maritalStatus')?.value;
    const strengths = this.candidateForm.get('strengths')?.value;
    const goals = this.candidateForm.get('goals')?.value;
    const extraCurricularActivities = this.candidateForm.get('extraCurricularActivities')?.value;
    const softSkills: string[] = this.candidateForm.get('softSkills')?.value;
    const coreCompentencies: string[] = this.candidateForm.get('coreCompentencies')?.value;
    const hobbies: string[] = this.candidateForm.get('hobbies')?.value;


    this.showNationalityError = false;
    this.showLanguageKnownError = false;
    this.showFatherNameError = false;
    this.showDobError = false;
    this.showMartialError = false;
    this.showStrengthsError = false;
    this.showGoalsError = false;
    this.showExtraCurricularError = false;
    this.showSoftSkillsError = false;
    this.showCoreCompentenciesError = false;
    this.showHobbiesError = false;

    let valueCheck: boolean = true


    if (softSkills?.length < 3) {
      this.showSoftSkillsError = true;
      valueCheck = false
    }
    if (coreCompentencies?.length < 3) {
      this.showCoreCompentenciesError = true;
      valueCheck = false
    }
    if (hobbies?.length < 3) {
      this.showHobbiesError = true;
      valueCheck = false
    }

    if (!nationality || nationality.length === 0) {
      this.showNationalityError = true
      valueCheck = false
    }

    if (!languageKnown || languageKnown.length === 0) {
      this.showLanguageKnownError = true;
      valueCheck = false
    }

    if (!fatherName || fatherName === null) {
      this.showFatherNameError = true
      valueCheck = false
    }

    if (!dob || dob === null) {
      this.showDobError = true
      valueCheck = false
    }

    if (!martialStatus || martialStatus === null) {
      this.showMartialError = true
      valueCheck = false
    }

    if (!strengths || strengths.length === 0) {
      this.showStrengthsError = true;
      valueCheck = false
    }

    if (!goals || goals.length === 0) {
      this.showGoalsError = true;
      valueCheck = false
    }

    if (!extraCurricularActivities || extraCurricularActivities.length === 0) {
      this.showExtraCurricularError = true;
      valueCheck = false
    }

    if (valueCheck) {
      return true;
    }
    else {
      return false
    }

  }

  getDiplomaEducationFields() {
    const route = 'value-sets/search-by-code';
    const postData = { valueSetCode: 'DIPLOMA_QUALIFICATION' };
    this.api.retrieve(route, postData).subscribe({
      next: (response) => {
        this.diplomaEducation = response;
      },
    });
  }


  createDiplomaEducation(): FormGroup {
    return this.fb.group({
      id: [''],
      diplomaInstitutionName: [''],
      qualificationLevel: [''],
      diplomaStartYear: [''],
      diplomaEndYear: [''],
      percentage: ['']
    });
  }

  get diplomaControls() {
    return this.candidateForm.get('diplomaEducation') as FormArray;
  }

  addDiplomaEducation() {
    this.diplomaControls.push(this.createDiplomaEducation());
    this.diplomaEducationlength = this.diplomaEducationlength + 1;
  }

  removeDiplomaEducation(index: number) {
    const confirmDelete = window.confirm(
      'Are you sure you want to remove this Diploma/ITI education?'
    );
    if (confirmDelete && this.diplomaControls.length >= 1) {
      this.diplomaControls.removeAt(index);
      this.diplomaEducationlength = this.diplomaEducationlength - 1;
    }
  }

}
