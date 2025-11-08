import {
  ChangeDetectorRef,
  Component,
  ElementRef,
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
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { ApiService } from '../../../services/api.service';
import { GlobalService } from '../../../services/global.service';
import { ValueSet } from '../../../models/admin/value-set.model';
import { Subscription } from 'rxjs';
import { Lookup } from '../../../models/master/lookup.model';
import { Candidate } from 'src/app/models/candidates/candidate.model';
import { Qualification } from 'src/app/models/candidates/qualification';
import { Certificates } from 'src/app/models/candidates/certificates';
import { Achievements } from 'src/app/models/candidates/achievements';
import { PaymentService } from 'src/app/services/payment.service';
import { CollegeProject } from 'src/app/models/candidates/college-project';
import { DatePipe } from '@angular/common';
import { MobileLoaderService } from 'src/app/services/mobile.loader.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-mobile-edit-candidates',
  standalone: false,
  templateUrl: './mobile-edit-candidates.component.html',
  styleUrl: './mobile-edit-candidates.component.css',
})
export class MobileEditCandidatesComponent {
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
  fieldOfStudy: any;
  inputBgColor = 'lightblue';
  candidates: any;
  isDeleted: boolean = false;
  payments: boolean = false;
  candidatesDetails: Array<Candidate> = [];
  imageName: any;
  returnImage: any;
  candidatesUpdateData: any;
  resumeName: any;
  nickName: any;
  isUploading: boolean = false;

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
    private loader: MobileLoaderService,
    private toast: ToastService,
    private el: ElementRef
  ) {
    this.gs.candidateDetails$.subscribe((response) => {
      if (response !== null) {
        this.candidates = response;
      }
    });

    this.gs.resumeName$.subscribe((response) => {
      if (response !== null) {
        this.templateName = response;
      }
    });

    this.gs.candidateImage$.subscribe((response) => {
      if (response !== null) {
        this.candidateImageUrl = response;
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
    this.getNationalityList();

    if (this.candidates !== null && this.candidates !== undefined) {
      this.candidateId = this.candidates?.id;

      const candidateClone = JSON.parse(JSON.stringify(this.candidates));
      this.patchCandidateForm(candidateClone);
    } else {
      this.getCandidates();
    }
  }

  ngAfterViewInit() {
    if (
      this.candidateImageUrl === null &&
      this.candidateImageUrl === undefined
    ) {
      this.getCandidateImage(this.candidateId);
    }
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
        summary: [''],
        careerObjective: [''],
        coreCompentenciesMandatory: [''],
        softSkillsMandatory: [''],
        achievementsMandatory: [''],
        certificatesMandatory: [''],
        fatherName: [''],
        hobbies: [''],
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

  async generatingResume() {
    const isValid = await this.checkCandidateDetailsExistAlready();

    this.isUploading = true;
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
          if (response) {
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
            response.candidateLogo = this.candidateImageUrl;

            this.isUploading = false;

            if (isValid) {
              this.getResumeContentFromOpenAi(response);
            } else {
              this.openCreateResumeDialog(response);
            }
          }
        },
        error: (error) => {
          this.isUploading = false;
          this.dataLoaded = true;
          window.alert('Error in Updating please try again');
          console.log(error);
        },
      });
      this.dataLoaded = true;
    } else {
      this.isUploading = false;
      this.showError = true;
      this.toast.showToast('error', 'Enter All Mandatory Fields');
    }
  }

  reset() {
    this.candidateForm.reset();
  }

  getResumeContentFromOpenAi(response: any) {
    this.isUploading = true;

    const route = 'resume/get-content';
    const payload = { ...this.candidates };

    this.api.retrieve(route, payload).subscribe({
      next: (response: any) => {
        if (response) {
          response.coreCompentenciesMandatory =
            this.candidates?.coreCompentenciesMandatory;
          response.softSkillsMandatory = this.candidates?.softSkillsMandatory;
          response.achievementsMandatory =
            this.candidates?.achievementsMandatory;
          response.certificatesMandatory =
            this.candidates?.certificatesMandatory;

          this.candidateId = response.id;
          this.candidates = response;

          this.isUploading = false;

          this.openCreateResumeDialog(response);
        }
        this.isUploading = false;
      },
      error: (error) => {
        this.isUploading = false;
        this.gs.showMobileMessage('error', error.error?.message);
      },
    });
  }

  openCreateResumeDialog(response: any) {
    localStorage.removeItem('skillsData');

    if (this.templateName !== null && this.templateName !== undefined) {
      this.gs.setResumeName(this.templateName);
      this.gs.setCandidateDetails(response);
      this.gs.setCandidateImage(this.candidateImageUrl);
      this.router.navigate(['/mob-candidate/create-resume']);
    } else {
      const resumeName = localStorage.getItem('templateName');
      this.gs.setResumeName(resumeName);
      this.gs.setCandidateDetails(this.candidates);
      this.gs.setCandidateImage(this.candidateImageUrl);
      this.router.navigate(['/mob-candidate/create-resume']);
    }
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
    if (this.imageName !== null && this.imageName !== '') {
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
          //this.gs.showMessage('Error', 'Error in updating logo.');
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

  next() {
    this.gs.setCandidateDetails(this.candidates);
    if (this.templateName !== null && this.templateName !== undefined) {
      this.gs.setResumeName(this.templateName);
    }
    this.router.navigate(['mob-candidate/verify-components']);
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
      collegeProjectSkills: [[]],
      collegeProjectDescription: [''],
    });
  }

  goBack() {
    this.gs.setCandidateDetails(this.candidates);
    if (this.candidateImageUrl !== null) {
      this.gs.setCandidateImage(this.candidateImageUrl);
    }
    this.gs.setResumeName(this.templateName);
    this.router.navigate(['mob-candidate/choose-Template']);
  }
  templateName(templateName: any) {
    throw new Error('Method not implemented.');
  }

  getCandidates() {
    const route = 'candidate';
    this.api.get(route).subscribe({
      next: (response) => {
        const candidate = response as Candidate;
        if (candidate !== null) {
          this.candidateId = candidate?.id;
          this.candidates = candidate;

          const candidateClone = JSON.parse(JSON.stringify(candidate));
          this.patchCandidateForm(candidateClone);
          this.getCandidateImage(candidate?.id);

          //set global
          this.gs.setCandidateDetails(candidate);
        }
      },
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

  goToCandidatepage() {
    this.gs.setCandidateDetails(this.candidates);
    if (this.candidateImageUrl !== null) {
      this.gs.setCandidateImage(this.candidateImageUrl);
    }
    this.router.navigate(['mob-candidate']);
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

  checkCandidateDetailsExistAlready(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.isUploading = true;
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
            if (!response) {
              resolve(true);
            } else {
              resolve(false);
            }
          },
          error: (error) => {
            this.isUploading = false;
            this.dataLoaded = true;
          },
        });
        this.dataLoaded = true;
      } else {
        this.isUploading = false;
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
      }
    });
  }
}
