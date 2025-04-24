import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, } from '@angular/core';
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
import { Experience } from 'src/app/models/candidates/experiences';
import { Qualification } from 'src/app/models/candidates/qualification';
import { Achievements } from 'src/app/models/candidates/achievements';
import { Requirement } from 'src/app/models/candidates/requirement.model';
import { LocalStorage } from '@ng-idle/core';
import { ChooseTemplateComponent } from '../Templates/choose-template/choose-template.component';


@Component({
  selector: 'app-candidates-details',
  standalone: false,
  templateUrl: './candidates-details.component.html',
  styleUrl: './candidates-details.component.css'
})
export class CandidatesDetailsComponent {

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
  resume: any;
  candidates: Array<Candidate> = [];
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
  collegeProjectDeletedArray: Array<any> = []
  appliedJobs: any;


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
  ) { }

  ngOnInit() {
    this.createCandidateForm();
    this.createRequirementForm();
    this.loadDummyData();
    this.generateYearList();
    this.getGenderList();
    this.getLanguages();
    this.getMaritalStatus();
    this.getFieldOfStudy();

    this.getCandidates();
    // this.getAppliedJobs();

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

  ngAfterViewInit() { }

  createCandidateForm() {
    this.candidateForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      mobileNumber: ['', Validators.compose([Validators.required, Validators.minLength(10)]),],
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
      softSkills: [''],
      coreCompentencies: [''],
      collegeProject: this.fb.array([this.createCollegeProject()]),
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
    sessionStorage.clear();
    this.router.navigate(['/landing']);
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
      if (field.displayFlag == 'Y' && field.mandatoryFlag == 'Y' && field.editFlag == 'Y') {
        this.candidateForm.controls[field.fieldName].addValidators(Validators.required);
        this.candidateForm.controls[field.fieldName].updateValueAndValidity();
      }
    });
  }

  isRequired(fieldName: string) {
    return this.candidateForm.controls[fieldName].hasValidator(Validators.required);
  }

  display(fieldName: string) {
    return this.fieldDetails.some((field) => field.fieldName == fieldName && field.displayFlag == 'Y');
  }

  generatingResume() {
    this.dataLoaded = false;

    const route = 'candidate/create';
    const payload = this.candidateForm.getRawValue();

    payload['candidateLogo'] = this.multipartFile;

    if (payload.lastWorkingDate) { payload['lastWorkingDate'] = this.datePipe.transform(payload.lastWorkingDate, 'yyyy-MM-dd'); }

    if (payload.isFresher != null && payload.isFresher) { payload['isFresher'] = true; }
    else { payload['isFresher'] = false; }

    if (Object.is(payload.experiences[0].companyName, '') && Object.is(payload.experiences[0].projects[0].projectName, '')
    ) {
      payload.experiences = [];
    } else {
      payload.qualification.forEach((ele: any) => {
        ele.experienceYearStartDate = this.datePipe.transform(ele.experienceYearStartDate, 'yyyy-MM-dd');
        ele.experienceYearEndDate = this.datePipe.transform(ele.experienceYearEndDate, 'yyyy-MM-dd');
      });
    }

    if (Object.is(payload.qualification[0].instutionName, '')) {
      payload.qualification = [];
    }
    else {
      payload.qualification.forEach((ele: any) => {
        ele.qualificationStartYear = this.datePipe.transform(ele.qualificationStartYear, 'yyyy-MM-dd');
        ele.qualificationEndYear = this.datePipe.transform(ele.qualificationEndYear, 'yyyy-MM-dd');
      });
    }

    if (Object.is(payload.achievements[0].achievementsName, '')) {
      payload.achievements = [];
    }

    if (Object.is(payload.certificates[0].courseName, '')) {
      payload.certificates = [];
    }
    else {
      payload.certificates.forEach((ele: any) => {
        ele.courseStartDate = this.datePipe.transform(ele.courseStartDate, 'yyyy-MM-dd');
        ele.courseEndDate = this.datePipe.transform(ele.courseEndDate, 'yyyy-MM-dd');
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
      id: [''],
      companyName: ['', Validators.required],
      role: ['', Validators.required],
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
      isDeleted: false
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
    return (this.experienceControls.at(experienceIndex).get('projects') as FormArray).length;
  }

  getExperienceCount(experienceIndex: number): number {
    return (this.candidateForm.get('experiences') as FormArray).length;
  }

  addProject(experienceIndex: number): void {
    this.getProjects(experienceIndex).push(this.createProject());
  }

  removeProject(experienceIndex: number, projectIndex: number): void {
    const confirmDelete = window.confirm('Are you sure you want to remove this Project?');
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

  onEdit(id: any) {

  }

  getScore(jobId: any, tenant: any) {

    const candidateIds = '23';

    const route = "score-check/get-score"

    const formData = new FormData();
    formData.append('jobId', jobId);
    formData.append('candidateId', candidateIds);
    formData.append('tenant', tenant);


    const payload = { jobId: jobId, candidateId: candidateIds, tenant: tenant };

    this.api.upload(route, formData).subscribe({
      next: (response) => {

        this.candidateScore = { id: 1, score: '55%', related: true, jobId: 'GT0002' };
      }
    });

  }

  applyJob(jobId: any, tenant: any) {

    const route = "applied-job/save"
    const candidateIds = '23';

    const payload = {
      candidateId: candidateIds,
      jobId: jobId,
      tenant: tenant
    };

    this.api.retrieve(route, payload).subscribe({
      next: (response) => {

        this.candidateScore = { id: 1, score: '55%', related: true, jobId: 'GT0002' };
      }
    });
  }

  addAttachment(event: any) {
    if (event.target.files[0]) {
      this.multipartFile = event.target.files[0];
      this.resume = { fileName: this.multipartFile?.name };
      this.parseResume();
    }
  }

  parseResume() {
    const route = 'resume-ai/upload';
    const formData = new FormData();
    formData.append('resume', this.multipartFile);
    this.api.upload(route, formData).subscribe({
      next: (response) => {
        if (response) {
          this.candidates = response;
          this.candidateId = response.id;
          const candidate = response as Candidate
          this.patchCandidateForm(candidate);

          this.candidateImageUrl = response.candidateLogo;

          console.log(this.candidateImageUrl)
        }
      },
    });
  }

  enterDetails() {
    const ref = this.dialog.open(CreateCandidatesComponent, {
      data: {
        candidates: this.candidates
      },
      closable: true,
      width: '70%',
      height: '90%',
      header: 'Create Your Resume',
    });

    ref.onClose.subscribe(response => {
      if (response) {

        localStorage.setItem('candidateId', response.id);
        this.candidates = response;
        this.candidateId = response.id;
        const candidate = response as Candidate
        this.patchCandidateForm(candidate);
        this.candidateImageUrl = response.candidateLogo;

      }
    });

    // this.router.navigate(['candidate/mob-create/view-templates'])
  }

  UpdateCandidate() {
    const ref = this.dialog.open(CreateCandidatesComponent, {
      data: {
        candidates: this.candidates,
        candidateImage: this.candidateImageUrl
      },
      closable: true,
      width: '70%',
      height: '90%',
      header: 'Update Your Resume',
    });

    ref.onClose.subscribe(response => {
      if (response) {
        this.candidates = response;
        this.candidateId = response.id;
        const candidate = response as Candidate
        this.patchCandidateForm(candidate);

        this.candidateImageUrl = response.candidateLogo;

        console.log(this.candidateImageUrl)
      }
    });
  }

  createResume() {
    const ref = this.dialog.open(ChooseTemplateComponent, {
      data: {
        candidates: this.candidates,
        candidateImage: this.candidateImageUrl

      },
      closable: true,
      width: '40%',
      height: '90%',
      styleClass: 'custom-dialog-header',
    });

    ref.onClose.subscribe(response => {
      if (response) {
        this.candidateImageUrl = response.candidateLogo;
        console.log(this.candidateImageUrl)
      }
    });
  }

  patchCandidateForm(candidate: Candidate) {


    if (candidate.certificates?.length > 0) {
      const certificateFormArray = this.candidateForm.get('certificates') as FormArray;
      certificateFormArray.clear();

      candidate.certificates?.forEach(certificate => {
        certificateFormArray.push(this.createCertificateFormGroup(certificate));
      });
    }
    this.patchExperiences(candidate.experiences);

    if (candidate.qualification?.length > 0) {
      const qualificationFormArray = this.candidateForm.get('qualification') as FormArray;
      qualificationFormArray.clear();

      candidate.qualification?.forEach(qualification => {
        qualificationFormArray.push(this.createQualificationFormGroup(qualification));
      });
    }

    if (candidate.achievements?.length > 0) {
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
      mobileNumber: candidate?.mobileNumber,
      email: candidate?.email,
      gender: candidate?.gender,
      nationality: candidate?.nationality,
      languagesKnown: candidate?.languagesKnown,
      isFresher: candidate?.isFresher,
      skills: candidate?.skills,
      linkedIn: candidate?.linkedIn,
      dob: candidateDob,
      address: candidate?.address,
      maritalStatus: candidate?.maritalStatus,
      softSkills: candidate?.softSkills,
      coreCompentencies: candidate?.coreCompentencies
    });
  }

  createCertificateFormGroup(certificate: Certificates): FormGroup {
    return this.fb.group({
      id: certificate.id,
      courseName: certificate.courseName,
      courseStartDate: certificate.courseStartDate ? new Date(certificate.courseStartDate) : null,
      courseEndDate: certificate.courseEndDate ? new Date(certificate.courseEndDate) : null,
      isDeleted: ['']
    });
  }

  patchExperiences(experiences: any[]) {

    if (experiences?.length > 0) {
      const experienceFormArray = this.candidateForm.get('experiences') as FormArray;
      experienceFormArray.clear();
      experiences?.forEach((experience) => {

        const experienceForm = this.createExperience();
        experienceForm.patchValue({
          id: experience.id,
          companyName: experience.companyName,
          role: experience.role,
          experienceYearStartDate: experience.experienceYearStartDate ? new Date(experience.experienceYearStartDate) : null,
          experienceYearEndDate: experience.experienceYearEndDate ? new Date(experience.experienceYearEndDate) : null,
          currentlyWorking: experience.currentlyWorking,
          responsibilities: experience.responsibilities,
          isDeleted: false
        });

        if (experience.projects?.length > 0) {
          const projectFormArray = experienceForm.get('projects') as FormArray;
          projectFormArray.clear();
          experience.projects?.forEach((project: any) => {

            const projectForm = this.createProject();
            projectForm.patchValue({
              id: project.id,
              projectName: project.projectName,
              projectSkills: project.projectSkills,
              projectRole: project.projectRole,
              projectDescription: project.projectDescription,
              isDeleted: false
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
      instutionName: qualification.instutionName,
      department: qualification.department,
      qualificationStartYear: qualification.qualificationStartYear ? new Date(qualification.qualificationStartYear) : null,
      qualificationEndYear: qualification.qualificationEndYear ? new Date(qualification.qualificationEndYear) : null,
      percentage: qualification.percentage,
      fieldOfStudy: qualification.fieldOfStudy,
      isDeleted: false,
    });
  }

  createAchievementsFormGroup(achievement: Achievements) {
    const formattedStartDate = this.datePipe.transform(achievement.achievementsDate, 'yyyy-MM-dd');
    return this.fb.group({
      id: achievement.id,
      achievementsName: achievement.achievementsName,
      achievementsDate: achievement.achievementsDate ? new Date(achievement.achievementsDate) : null,
      isDeleted: false,
    });
  }

  getRequirements() {

    if (this.requirementForm.controls['locations'].value !== "" && this.requirementForm.controls['skills'].value.length > 0) {

      const route = "hurecom/get-requirements";

      const payload = this.requirementForm.getRawValue();

      payload['page'] = this.currentPage,
        payload['limit'] = this.maxLimitPerPage

      this.api.retrieve(route, payload).subscribe({
        next: (response) => {
          this.requirements = response?.results as Requirement[];
          this.totalRecords = response?.totalRecords;
        }
      });
    }
    else {
      this.gs.showMessage('Note..!', 'Please enter the both skills and locations for Searching the job')
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
      collegeProjectSkills: [[]],
      collegeProjectDescription: [''],
      isDeleted: false
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
    const id = 23;
    const route = `applied-jobs/${id}`;

    this.api.get(route).subscribe({
      next: (response) => {
        this.appliedJobs = response;
      },
    });
  }

  getCandidates() {
    const route = 'candidate';
    this.api.get(route).subscribe({
      next: (response) => {
        const candidate = response as Candidate;
        if (candidate !== null) {
          this.candidateId = candidate?.id;
          this.patchCandidateForm(candidate);
        }
      },
    });
  }

}

