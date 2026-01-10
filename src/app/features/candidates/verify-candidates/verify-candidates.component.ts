import { DatePipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
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
import { PaymentService } from 'src/app/services/payment.service';
import { PaymentOptionComponent } from '../payments/payment-option/payment-option.component';
import { CollegeProject } from 'src/app/models/candidates/college-project';
import { AddCandidatesComponent } from '../add-candidates/add-candidates.component';
import { LoaderService } from 'src/app/services/loader.service';
import { ResumeCreatingComponent } from '../resume-creating/resume-creating.component';
import { ToastService } from 'src/app/services/toast.service';
import { LoaderControllerService } from 'src/app/services/loader-controller.service';
import { SchoolEducation } from 'src/app/models/candidates/schoolEducation';
import { DiplomaEducation } from 'src/app/models/candidates/diploma-education';

@Component({
  selector: 'app-verify-candidates',
  standalone: false,
  templateUrl: './verify-candidates.component.html',
  styleUrl: './verify-candidates.component.css',
})
export class VerifyCandidatesComponent {
  candidateForm!: FormGroup;
  genderList: Array<ValueSet> = [];
  nationalityList: Array<ValueSet> = [];
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
  nickName: any;
  templateName: any;
  isUploading: boolean = false;
  qualificationlength: number = -1;
  schoolEducationlength: number = -1;
  schoolEducation: Array<ValueSet> = [];
  diplomaEducationlength: number = -1;
  diplomaEducation: Array<ValueSet> = [];
  showStrenghtsError: boolean = false;
  showGoalsError: boolean = false;
  showExtraCurricularError: boolean = false;


  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private gs: GlobalService,
    private datePipe: DatePipe,
    private dialog: DialogService,
    private router: Router,
    public ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private toast: ToastService,
    private el: ElementRef,
    private newLoader: LoaderControllerService
  ) {
    this.candidates = this.config.data?.candidates;
    this.payments = this.config.data?.payments;
    this.candidateImageUrl = this.config.data?.candidateImage;
    this.templateName = this.config.data?.resumeName;

    this.gs.candidateDetails$.subscribe((response) => {
      if (response !== null) {
        this.candidates = response;
      }
    });

    this.gs.candidateImage$.subscribe((response) => {
      if (response !== null && response !== undefined) {
        this.candidateImageUrl = response;
      }
    });

    this.gs.resumeName$.subscribe((response) => {
      if (response !== null) {
        this.templateName = response;
      }
    });
  }

  ngOnInit() {
    this.createCandidateForm();
    this.generateYearList();
    this.getGenderList();
    this.getLanguages();
    this.getMaritalStatus();
    this.getFieldOfStudy();
    //this.getCandidates();
    this.getNationalityList();
    this.getSchoolEducationFields();
    this.getDiplomaEducationFields();


    if (this.candidates !== null && this.candidates !== undefined) {
      this.candidateId = this.candidates.id;
      const candidateClone = JSON.parse(JSON.stringify(this.candidates));
      this.patchCandidateForm(candidateClone);
      if (
        this.candidateImageUrl === null &&
        this.candidateImageUrl === undefined
      ) {
        this.getCandidateImage(this.candidateId);
      }
    } else {
      this.getCandidates();
    }


  }

  ngAfterViewInit() {

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
        nationality: [''],
        languagesKnown: [''],
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
        hobbies: [''],
        fatherName: [''],
        schoolEducation: this.fb.array([]),
        diplomaEducation: this.fb.array([]),
        strengths: [''],
        goals: [''],
        extraCurricularActivities: [''],
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

  async createCandidate() {
    console.log('hai');

    const isValid = await this.checkCandidateOldDetails();

    // this.isUploading = true;
    this.startProcess();

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
        payload.schoolEducation.length === 0 ||
        Object.is(payload.schoolEducation[0].schoolName, '')
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
        Object.is(payload.diplomaEducation[0].diplomaInstitutionName, '')
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
        const commaSeparatedString: string = hobbiesList.join(', ');
        payload.hobbies = commaSeparatedString;
      }

      if (
        payload.languagesKnown.length === 0 ||
        Object.is(payload.languagesKnown, '')
      ) {
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

      if (Object.is(payload.strengths, '')) {
        payload.strengths = '';
      } else {
        const stringList: string[] = payload.strengths;
        const commaSeparatedString: string = stringList.join(', ');
        payload.strengths = commaSeparatedString;
      }

      if (Object.is(payload.goals, '')) {
        payload.goals = '';
      } else {
        const stringList: string[] = payload.goals;
        const commaSeparatedString: string = stringList.join(', ');
        payload.goals = commaSeparatedString;
      }

      if (Object.is(payload.extraCurricularActivities, '')) {
        payload.extraCurricularActivities = '';
      } else {
        const stringList: string[] = payload.extraCurricularActivities;
        const commaSeparatedString: string = stringList.join(', ');
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
          this.candidateId = response?.id;
          this.dataLoaded = true;
          localStorage.setItem('candidateId', this.candidateId);
          this.returnCandidate = response;
          // this.uploadCandidateImage();
          // this.returnCandidate.candidateLogo = this.candidateImageUrl;
          this.candidates = response;
          response.candidateLogo = this.candidateImageUrl;

          // this.isUploading = false;
          this.stopProcess();

          if (isValid) {
            this.getResumeContentFromOpenAi(response);
          } else {
            this.openCreateResumeDialog(response);
          }

          // this.gs.showMessage('Success', 'Create Successfully');
        },
        error: (error) => {
          // this.isUploading = false;
          this.stopProcess();

          this.dataLoaded = true;
          this.gs.showMessage(
            'Error',
            'Error in Saving Details Please Recheck the Details'
          );
        },
      });
      this.dataLoaded = true;
    } else {
      // this.isUploading = false;
      this.stopProcess();
      this.showError = true;

      this.candidateForm.markAllAsTouched();
      this.toast.showToast('error', 'Enter All Mandatory Fields');
    }
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', inline: 'start' });
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
      isDeleted: false,
    });
  }

  get qualificationControls() {
    return this.candidateForm.get('qualification') as FormArray;
  }

  addQualication() {
    this.qualificationControls.push(this.createQualification());

    this.qualificationlength = this.qualificationlength + 1;
  }

  removeQualification(index: number) {
    const confirmDelete = window.confirm(
      'Are you sure you want to remove this qualification?'
    );
    if (confirmDelete && this.qualificationControls.length >= 1) {
      const removedQualification = this.qualificationControls.at(index).value;
      if (removedQualification.id) {
        this.qualificationControls.removeAt(index);
        this.qualificationlength = this.qualificationlength - 1;
      } else {
        this.qualificationlength = this.qualificationlength - 1;
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

  async addCandidateImage(event: any) {
    this.candidateImageAttachments = [];
    this.multipartFile = event.target.files[0];
    this.imageName = this.multipartFile.name;
    const candidateImageAttachment = { fileName: this.multipartFile.name };
    this.candidateImageAttachments.push(candidateImageAttachment);
    await this.updateCandidateImage();
    this.uploadCandidateImage();
  }

  // updateCandidateImage() {
  //   var reader = new FileReader();
  //   reader.onload = () => {
  //     this.candidateImageUrl = reader.result;
  //   };
  //   reader.readAsDataURL(this.multipartFile);
  // }

  updateCandidateImage(): Promise<void> {
    return new Promise<void>((resolve) => {
      const reader = new FileReader();

      reader.onload = () => {
        this.candidateImageUrl = reader.result;
        resolve(); // 🔑 MUST call resolve
      };

      reader.onerror = () => {
        resolve(); // fail-safe
      };

      reader.readAsDataURL(this.multipartFile);
    });
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

    candidate.strengths = candidate?.strengths
      ? candidate.strengths
        .split(',')
        .map((skill: string) => skill.trim())
      : [];

    candidate.goals = candidate?.goals
      ? candidate.goals
        .split(',')
        .map((skill: string) => skill.trim())
      : [];

    candidate.extraCurricularActivities = candidate?.extraCurricularActivities
      ? candidate.extraCurricularActivities
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


    if (candidate.schoolEducation?.length > 0) {
      const schoolFormArray = this.candidateForm.get(
        'schoolEducation'
      ) as FormArray;
      schoolFormArray.clear();

      candidate.schoolEducation?.forEach((qualification) => {
        schoolFormArray.push(
          this.createSchoolEducationFormGroup(qualification)
        );
      });
    }

    if (candidate.diplomaEducation?.length > 0) {
      const schoolFormArray = this.candidateForm.get(
        'diplomaEducation'
      ) as FormArray;
      schoolFormArray.clear();

      candidate.diplomaEducation?.forEach((qualification) => {
        schoolFormArray.push(
          this.createDiplomaEducationFormGroup(qualification)
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
      softSkills: candidate?.softSkills ? candidate?.softSkills : [],
      coreCompentencies: candidate?.coreCompentencies
        ? candidate?.coreCompentencies
        : [],
      coreCompentenciesMandatory: candidate?.certificatesMandatory,
      softSkillsMandatory: candidate?.softSkillsMandatory,
      certificatesMandatory: candidate?.certificatesMandatory,
      achievementsMandatory: candidate?.achievementsMandatory,
      hobbies: candidate?.hobbies ? candidate?.hobbies : [],
      fatherName: candidate?.fatherName,
      strengths: candidate?.strengths ? candidate?.strengths : [],
      goals: candidate?.goals ? candidate?.goals : [],
      extraCurricularActivities: candidate?.extraCurricularActivities ? candidate?.extraCurricularActivities : [],
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

  createSchoolEducationFormGroup(qualification: SchoolEducation) {
    return this.fb.group({
      id: qualification.id,
      schoolName: qualification.schoolName,
      educationLevel: qualification.educationLevel,
      schoolStartYear: qualification.schoolStartYear
        ? new Date(qualification.schoolStartYear)
        : null,
      schoolEndYear: qualification.schoolEndYear
        ? new Date(qualification.schoolEndYear)
        : null,
      percentage: qualification.percentage,
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

  verifyDetails() {
    const route = 'template/checker';
    const payload = {
      ...this.candidates,
      templateName: this.templateName,
    };

    this.api.retrieve(route, payload).subscribe({
      next: (response: any) => {
        const fieldname = response?.fieldName;
        const count = response?.count !== null ? response?.count : 0;

        if (fieldname !== null && fieldname.length > 0) {
          this.createResume(fieldname, count);
        } else {
          this.payment();
        }
      },
    });
  }

  createResume(fieldsName: any, count: any) {
    this.ref.close();
    const candidateId = localStorage.getItem('candidateId');

    const resumeNames = localStorage.getItem('templateName');

    const ref = this.dialog.open(AddCandidatesComponent, {
      data: {
        candidates: this.candidates,
        payments: true,
        candidateImage: this.candidateImageUrl,
        resumeName: resumeNames,
        fieldsName: fieldsName,
        count: count,
      },
      closable: true,
      width: '70%',
      height: '90%',
      header: 'Please fill out the missing details',
    });

    ref.onClose.subscribe((response) => {
      if (response) {
        this.candidates = response;
        this.candidateId = response.id;
        const candidate = response as Candidate;
        // this.patchCandidateForm(candidate);
      }
    });
  }

  payment() {
    this.ref.close();
    const ref = this.dialog.open(PaymentOptionComponent, {
      data: {
        candidates: this.candidates,
        candidateId: this.candidates?.id,
        resumeName: this.templateName,
        nickName: this.nickName,
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

  getCandidates(): Promise<void> {
    this.newLoader.showLoader(['Please Wait'], 3500);


    return new Promise<void>((resolve) => {
      const route = 'candidate';
      this.api.get(route).subscribe({
        next: (response) => {
          const candidate = response as Candidate;
          if (candidate !== null) {
            this.candidates = candidate;
            this.candidateId = candidate?.id;

            const candidateClone = JSON.parse(JSON.stringify(candidate));

            this.patchCandidateForm(candidateClone);
            this.getCandidateImage(candidate?.id);

            if (this.candidateId !== null && this.candidateId !== undefined) {
              this.candidateForm.controls['mobileNumber'].disable();
            }
            this.stopProcess();

          }
          this.stopProcess();
        },
        error: (err) => {
          this.stopProcess();
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
        }
      },
      error: (err) => {
        console.error('Error fetching candidate image:', err);

      },
    });
  }

  getResumeContentFromOpenAi(candidateDetails: any) {
    this.close(this.returnCandidate);

    // this.isUploading = true;
    this.startProcess();


    let job;
    if (candidateDetails?.fresher) {
      job = localStorage.getItem('userJobInterest');
    } else {
      job = 'Experience';
    }

    const route = `resume/get-content?jobFor=${job}`;
    const payload = { ...candidateDetails };

    this.api.retrieve(route, payload).subscribe({
      next: (response: any) => {
        if (response) {
          // this.isUploading = false;
          this.stopProcess();
          const responseCandidate = response as Candidate;
          this.openCreateResumeDialog(responseCandidate);
        }
      },
      error: (error) => {
        // this.isUploading = false;
        this.stopProcess();
        this.gs.showMessage('error', error.error?.message);
      },
    });
  }

  openCreateResumeDialog(candidate: any) {
    localStorage.removeItem('skillsData');

    if (this.templateName === null || this.templateName === undefined) {
      this.templateName = localStorage.getItem('templateName');
    }

    this.gs.setCandidateDetails(candidate);
    this.gs.setResumeName(this.templateName);

    // this.router.navigate(['candidate/generate-resume']);

    localStorage.removeItem('skillsData');

    this.router.navigate(['candidate/create-resume']);
  }

  backBtn() {
    this.router.navigate(['candidate/template']);
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

  checkCandidateOldDetails(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (this.candidateForm.valid) {
        this.dataLoaded = false;

        const route = 'candidate/check_candidate';
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
          const commaSeparatedString: string = hobbiesList.join(', ');
          payload.hobbies = commaSeparatedString;
        }

        if (
          payload.languagesKnown.length === 0 ||
          Object.is(payload.languagesKnown, '')
        ) {
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

        if (Object.is(payload.strengths, '')) {
          payload.strengths = '';
        } else {
          const stringList: string[] = payload.strengths;
          const commaSeparatedString: string = stringList.join(', ');
          payload.strengths = commaSeparatedString;
        }

        if (Object.is(payload.goals, '')) {
          payload.goals = '';
        } else {
          const stringList: string[] = payload.goals;
          const commaSeparatedString: string = stringList.join(', ');
          payload.goals = commaSeparatedString;
        }

        if (Object.is(payload.extraCurricularActivities, '')) {
          payload.extraCurricularActivities = '';
        } else {
          const stringList: string[] = payload.extraCurricularActivities;
          const commaSeparatedString: string = stringList.join(', ');
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
            if (!response) {
              resolve(true);
            } else {
              resolve(false);
            }
          },
          error: (error) => {
            // this.isUploading = false;
            this.stopProcess();

            this.dataLoaded = true;
          },
        });
        this.dataLoaded = true;
      } else {
        // this.isUploading = false;
        this.stopProcess();
        this.showError = true;

        this.candidateForm.markAllAsTouched();

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
      }
    });
  }

  startProcess() {
    const messages = [
      'Please wait...',
      'Verifying Your Details...',
      'Almost ready...',
      'Just a moment more...',
      'Ready to view...',
    ];

    this.newLoader.showLoader(messages, 3500);
  }

  stopProcess() {
    this.newLoader.hideLoader();
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

  getDiplomaEducationFields() {
    const route = 'value-sets/search-by-code';
    const postData = { valueSetCode: 'DIPLOMA_QUALIFICATION' };
    this.api.retrieve(route, postData).subscribe({
      next: (response) => {
        this.diplomaEducation = response;
      },
    });
  }


  createDiplomaEducationFormGroup(qualification: DiplomaEducation) {
    return this.fb.group({
      id: qualification.id,
      diplomaInstitutionName: qualification.diplomaInstitutionName,
      qualificationLevel: qualification.qualificationLevel,
      diplomaStartYear: qualification.diplomaStartYear
        ? new Date(qualification.diplomaStartYear)
        : null,
      diplomaEndYear: qualification.diplomaEndYear
        ? new Date(qualification.diplomaEndYear)
        : null,
      percentage: qualification.percentage,
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


  removeCandidateImage() {
    this.candidateImageUrl = null;

    const route = `candidate/delete-image?candidateId=${this.candidateId}`;
    this.api.get(route).subscribe({
      next: (response) => {

      },
      error: (err) => {

      },
    });

  }
}
