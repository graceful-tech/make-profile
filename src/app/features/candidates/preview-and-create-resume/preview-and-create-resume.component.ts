import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  ElementRef,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {
  DomSanitizer,
  SafeHtml,
  SafeResourceUrl,
} from '@angular/platform-browser';

import { DatePipe } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
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
import { LoaderService } from 'src/app/services/loader.service';
import { ToastService } from 'src/app/services/toast.service';
import { Project } from 'src/app/models/candidates/project';
import { LoaderControllerService } from 'src/app/services/loader-controller.service';
import templatesData from 'src/assets/resume-types/templatesData.json';
import { ConfirmationPopupComponent } from 'src/app/shared/components/confirmation-popup/confirmation-popup.component';
import { SchoolEducation } from 'src/app/models/candidates/schoolEducation';



// import * as pdfjsLib from 'pdfjs-dist';

type ToggleKey =
  | 'reduceSummary'
  | 'increaseSummary'
  | 'reduceObjective'
  | 'increaseObjective';

@Component({
  selector: 'app-preview-and-create-resume',
  standalone: false,
  templateUrl: './preview-and-create-resume.component.html',
  styleUrl: './preview-and-create-resume.component.css',
})
export class PreviewAndCreateResumeComponent {
  @ViewChild('pdfContainer', { static: false })
  pdfContainer!: ElementRef<HTMLDivElement>;

  editedHtml = '';
  reduceSummary: boolean = false;
  increaseSummary: boolean = false;
  reduceObjective: boolean = false;
  increaseObjective: boolean = false;
  templatesTypes = templatesData.templates;
  showConfirmationPopup: boolean = false;

  newonew = 'hai';

  resumeSkills: any;
  resumeHtml!: string;
  resumePages: SafeHtml[] = [];

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
  isUploading: boolean = false;
  templateName: any;
  generating: boolean = false;
  certificateEmptyFields: boolean = false;
  achievementsEmptyFields: boolean = false;
  nickName: any;
  balanceCredits: any;
  showPopup: boolean = false;
  summaryObjectiveContent: any;
  showErrorPopup: boolean = false;
  errorMessage: any;
  errorStatus: any;
  reducedContent!: string;
  isGettingContent: boolean = false;
  isPreview: boolean = false;
  previewSrc: SafeResourceUrl | null = null;
  htmlcontent: any;
  arrayBuffer: any;
  skills: Array<any> = [];
  softSkills: Array<any> = [];
  coreCompentencies: Array<any> = [];
  addAdditoinalDetail: boolean = false;
  totalPdfPages: any;
  schoolEducationlength: any;
  schoolEducation: Array<ValueSet> = [];


  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private elRef: ElementRef,
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
    private toast: ToastService,
    private el: ElementRef,
    private newLoader: LoaderControllerService
  ) {
    this.candidates = this.config.data?.candidates;
    this.templateName = this.config.data?.templateName;

    this.gs.candidateDetails$.subscribe((response) => {
      this.candidates = response;
    });

    this.gs.candidateImage$.subscribe((response) => {
      this.candidateImageUrl = response;
    });

    this.gs.resumeName$.subscribe((response) => {
      this.templateName = response;
    });
  }

  async ngOnInit() {
    this.createCandidateForm();
    this.generateYearList();
    this.getGenderList();
    this.getLanguages();
    this.getMaritalStatus();
    this.getFieldOfStudy();
    this.getNationalityList();
    // this.getAvailableCredits();
    this.getSchoolEducationFields();


    if (this.candidates !== null && this.candidates !== undefined) {
      this.candidateId = this.candidates.id;
      const candidateClone = JSON.parse(JSON.stringify(this.candidates));
      this.patchCandidateForm(candidateClone);
      this.previewPdf();
    } else {
      await this.getCandidates();
      this.previewPdf();
    }

    this.getSkillsFromApi();
  }

  ngAfterViewInit() { }
  onResumeEdit(event: Event) {
    const element = event.target as HTMLElement;
    this.editedHtml = element.innerHTML;
  }

  getEditedHtml(): string {
    const resumePage = this.elRef.nativeElement.querySelector('#resumePage');
    return resumePage ? resumePage.innerHTML : '';
  }

  paginateResume() {
    const resumePage = this.elRef.nativeElement.querySelector('.resume-page');
    const pageHeight = 1123; // approx A4 pixel height (297mm @96dpi)
    const contentHeight = resumePage.scrollHeight;

    if (contentHeight > pageHeight) {
      const pages = Math.ceil(contentHeight / pageHeight);
      const container =
        this.elRef.nativeElement.querySelector('.resume-container');

      for (let i = 1; i < pages; i++) {
        const newPage = document.createElement('div');
        newPage.className = 'resume-page';
        newPage.setAttribute('contenteditable', 'true');
        newPage.innerHTML = '&nbsp;';
        container.appendChild(newPage);
      }
    }
  }

  async updateSection(section: string) {
    console.log('Updating section:', section);

    if (section === 'summary') {
      if (this.reduceSummary) {
        this.decreaseSummary('summary');
      } else if (this.increaseSummary) {
        this.increaseSummaryContent('summary');
      }
    }

    if (section === 'objective') {
      if (this.reduceObjective) {
        this.decreaseSummary('careerObjective');
      } else if (this.increaseObjective) {
        this.increaseSummaryContent('careerObjective');
      }
    }
  }

  applyEdit(section: string, action: string) {
    console.log(`Applying ${action} on ${section}`);
  }

  addSkill(newSkill: string, key: any) {
    const skills = this.candidateForm.get(key)?.value || [];

    if (newSkill && !skills.includes(newSkill)) {
      const updatedSkills = [...skills, newSkill];
      this.candidateForm.get(key)?.setValue(updatedSkills);
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
        gender: [''],
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
        coreCompentenciesMandatory: [''],
        softSkillsMandatory: [''],
        certificatesMandatory: [''],
        achievementsMandatory: [''],
        summary: [''],
        careerObjective: [''],
        fatherName: [''],
        hobbies: [''],
        schoolEducation: this.fb.array([]),
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

  getResumeContents(content: any) {
    this.ngxLoaderStart();

    const route = `content/openai?content=${content}`;

    this.api.get(route).subscribe({
      next: (response) => {
        if (response) {
          const responseContent = response as any;
          if (content === 'Summary') {
            this.candidateForm
              .get('summary')
              ?.setValue(responseContent?.resumeContent);

            this.ngxLoaderStop();
          } else {
            this.candidateForm
              .get('careerObjective')
              ?.setValue(responseContent?.resumeContent);

            this.ngxLoaderStop();
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

  ngxLoaderStop() {
    setTimeout(() => {
      this.isUploading = false;
    }, 2000);
  }

  ngxLoaderStart() {
    this.isUploading = true;
  }

  createResume(candiateDto: any) {
    this.generating = true;

    const templateName = localStorage.getItem('templateName');

    const route = `resume/create?additionalDetails=${this.addAdditoinalDetail}`;

    const payload = { ...candiateDto, templateName: templateName };

    this.api.retrieve(route, payload).subscribe({
      next: (response: any) => {
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
          a.download = (response.candidateName || 'resume') + '.pdf';
          document.body.appendChild(a);
          a.click();

          // Clean up
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);

          this.toast.showToast(
            'success',
            'Your resume has been downloaded successfully'
          );
          localStorage.removeItem('resumeName');
          this.generating = false;

          this.router.navigate(['candidate']);
        }
        this.generating = false;
      },
      error: (error) => {
        this.generating = false;
        this.showErrorPopup = true;
        this.errorMessage = error.error?.message;
        this.errorStatus = error.error?.status;
      },
    });
  }

  trimSummaryContent() {
    let content = this.returnCandidate.summary?.trim();
    let summaryContentCount = content.split('.');

    if (content && summaryContentCount.length >= 2) {
      let sentences = content
        .split('.')
        .map((s: any) => s.trim())
        .filter((s: any) => s !== '');

      sentences.pop();

      content = sentences.join('. ');

      if (content.length > 0) {
        content += '.';
      }

      this.candidateForm.get('summary')?.setValue(content);

      this.returnCandidate.summary = content;
    }

    let objectiveContent = this.returnCandidate.carrierObjective?.trim();
    let objectiveContentCount = content.split('.');

    if (objectiveContent && objectiveContentCount.length >= 2) {
      let objectiveSentences = content
        .split('.')
        .map((s: any) => s.trim())
        .filter((s: any) => s !== '');

      objectiveSentences.pop();

      content = objectiveSentences.join('. ');

      if (content.length > 0) {
        content += '.';
      }

      this.candidateForm.get('carrierObjective')?.setValue(content);

      this.returnCandidate.carrierObjective = content;
    }

    this.createResume(this.returnCandidate);
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
    this.generating = true;
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
            localStorage.setItem('candidateId', this.candidateId);
            this.returnCandidate = response;

            this.generating = false;
            this.createResume(response);
          } else {
            this.generating = false;
          }
          // this.close(this.returnCandidate);
          // this.gs.showMessage('Success', 'Create Successfully');
        },
        error: (error) => {
          this.generating = false;
          this.dataLoaded = true;

          this.gs.showMessage('Error', 'Error in Creating Resume');

          console.log(error);
        },
      });
      this.dataLoaded = true;
    } else {
      this.generating = false;
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

  getProjectContentCount(experienceIndex: number): boolean {
    const projects = this.experienceControls
      .at(experienceIndex)
      .get('projects') as FormArray;
    const projectName = projects.controls[0] as any;
    return projectName.controls.projectName?.value !== '' ? true : false;
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
      candidate.fresher = true;
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
      coreCompentenciesMandatory: candidate?.certificatesMandatory,
      softSkillsMandatory: candidate?.softSkillsMandatory,
      certificatesMandatory: candidate?.certificatesMandatory,
      achievementsMandatory: candidate?.achievementsMandatory,
      summary: candidate?.summary,
      careerObjective: candidate?.careerObjective,
      hobbies: candidate?.hobbies ? candidate?.hobbies : [],
      fatherName: candidate?.fatherName,
    });
  }

  createCertificateFormGroup(certificate: Certificates): FormGroup {
    return this.fb.group({
      id: certificate.id,
      courseName: certificate.courseName,
      courseStartDate: this.isValidDate(certificate.courseStartDate),
      courseEndDate: this.isValidDate(certificate.courseEndDate),
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
          experienceYearStartDate: this.isValidDate(
            experience.experienceYearStartDate
          ),
          experienceYearEndDate: this.isValidDate(
            experience.experienceYearEndDate
          ),
          currentlyWorking: experience.currentlyWorking,
          responsibilities: responsibilities,
          isDeleted: false,
        });

        if (experience?.projects.some((p: Project) => p?.projectName?.trim())) {
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
      qualificationStartYear: this.isValidDate(
        qualification.qualificationStartYear
      ),
      qualificationEndYear: this.isValidDate(
        qualification.qualificationEndYear
      ),
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
      achievementsDate: this.isValidDate(achievement.achievementsDate),
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
    });
  }

  next() {
    this.ref.close();
    const ref = this.dialog.open(PaymentOptionComponent, {
      data: {
        candidates: this.candidates,
        candidateId: this.candidates?.id,
        resumeName: this.resumeName,
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

  async getCandidates(): Promise<void> {
    this.startProcess();

    return new Promise((resolve, reject) => {
      const route = 'candidate';
      this.api.get(route).subscribe({
        next: (response) => {
          const candidate = response as Candidate;
          if (candidate !== null) {
            this.candidates = candidate;
            this.candidateId = candidate?.id;

            const candidateClone = JSON.parse(JSON.stringify(candidate));

            this.patchCandidateForm(candidateClone);
            this.stopProcess();
            if (
              this.candidates?.summary === null ||
              this.candidates?.careerObjective == null
            ) {
              this.getSummaryAndObjectiveContent();
            } else {
              this.stopProcess();
            }

            resolve();
          }
        },
        error: (error) => {
          reject();
        },
      });
    });
  }

  getCandidateImage(id: any) {
    const route = 'candidate/get-image';

    const formData = new FormData();
    formData.append('candidateId', id);

    this.api.upload(route, formData).subscribe({
      next: (response) => {
        this.candidateImageUrl = URL.createObjectURL(response);
        this.dataLoaded = true;
      },
    });
  }

  async payRupees() {
    const confirmedAmount = prompt('Enter final amount in ₹', '10');

    const amountNum = Number(confirmedAmount);

    if (!isNaN(amountNum) && Number.isInteger(amountNum) && amountNum >= 10) {
      const amount = amountNum * 100;
      const paymentType = 'Resume';

      this.ps.initRazorPays(() => {
        setTimeout(() => {
          this.createCandidate();
        }, 2000);
      });
      this.ps.payWithRazorPay(amount);
    } else {
      alert('Please enter a valid amount ₹10 or more.');
    }
  }

  async createFinalResume() {
    await this.getAvailableCredits();

    if (
      this.balanceCredits === null ||
      this.balanceCredits === undefined ||
      this.balanceCredits <= 0
    ) {
      this.showPopup = true;
    } else {

      const templateName = localStorage.getItem('templateName');

      const pageType: any = this.templatesTypes.find(template => template.templateName === templateName)?.pages
      console.log('page size' + pageType);
      console.log(templateName);

      if (pageType > 1) {
        this.createCandidate();
      }
      else {
        if (this.totalPdfPages > 1) {
          this.showConfirmationPopup = !this.showConfirmationPopup;
        }
        else {
          this.createCandidate();
        }
      }

    }

  }

  createResumeAfterPAy(event: any) {
    this.showPopup = false;
    this.createCandidate();
  }

  getAvailableCredits(): Promise<void> {
    return new Promise((resolve, reject) => {
      const userId = sessionStorage.getItem('userId');
      const route = `credits/get-available-credits?userId=${userId}`;

      this.api.get(route).subscribe({
        next: (response) => {
          this.balanceCredits = response as any;
          resolve();
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }

  backToHome() {
    this.router.navigate(['candidate']);
  }

  closePopup(event: any) {
    this.showPopup = false;
  }

  getResumeContent(content: any) {
    this.startProcess();
    const route = `content/openai?content=${content}`;
    this.api.get(route).subscribe({
      next: (response) => {
        if (response) {
          const responseContent = response as any;
          this.candidateForm
            .get('summary')
            ?.setValue(responseContent?.resumeContent);
          this.stopProcess();
          this.getResumeContentObjective('Career Objective');
        }
      },
      error: (error) => {
        this.stopProcess();
        this.dataLoaded = true;
        this.gs.showMobileMessage('Error', 'Please try after some time');
      },
    });
  }

  getResumeContentObjective(content: any) {
    this.startProcess();
    const route = `content/openai?content=${content}`;
    this.api.get(route).subscribe({
      next: (response) => {
        if (response) {
          const responseContent = response as any;
          this.candidateForm
            .get('careerObjective')
            ?.setValue(responseContent?.resumeContent);
          this.stopProcess();
        }
      },
      error: (error) => {
        this.stopProcess();
        this.dataLoaded = true;
        this.gs.showMobileMessage('Error', 'Please try after some time');
      },
    });
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

  getSummaryAndObjectiveContent() {
    this.startProcess();
    const route = 'content/get-content';

    this.api.get(route).subscribe({
      next: (response) => {
        this.stopProcess();
        if (response) {
          this.summaryObjectiveContent = response;

          this.candidateForm
            .get('summary')
            ?.setValue(this.summaryObjectiveContent?.summary);

          this.candidateForm
            .get('careerObjective')
            ?.setValue(this.summaryObjectiveContent?.careerObjective);
        }

        this.stopProcess();
      },
      error: (error) => {
        this.stopProcess();
        this.dataLoaded = true;
      },
    });
  }

  closePopupTap(event: any) {
    this.showErrorPopup = false;
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

  increaseSummaryContent(key: any) {
    this.startLoaderForGettingContent();
    let content = this.candidateForm.get(key)?.value;

    if (content == null || content == '') {
      content = 'Create' + key + 'content by your own';
    }

    const route = `content/get-ai-content?key=${key}&operation=${'increase'}`;

    const payload = {
      summary: content,
    };

    this.api.retrieve(route, payload).subscribe({
      next: (response) => {
        if (response) {
          const responseContent = response as any;

          this.candidateForm.get(key)?.setValue(responseContent.summary);

          this.stopProcess();

          this.updateDetails();
        }
      },
      error: (error) => {
        this.stopProcess();
      },
    });
  }

  decreaseSummary(key: any) {
    this.startLoaderForGettingContent();
    let content = this.candidateForm.get(key)?.value;

    if (content == null || content == '') {
      content = 'Create' + key + 'content by your own';
    }

    const route = `content/get-ai-content?key=${key}&operation=${'decrease'}`;

    const payload = {
      summary: content,
    };

    this.api.retrieve(route, payload).subscribe({
      next: (response) => {
        if (response) {
          this.stopProcess();
          const responseContent = response as any;

          this.candidateForm.get(key)?.setValue(responseContent.summary);

          this.updateDetails();
        }
      },
      error: (error) => {
        this.stopProcess();
      },
    });
  }

  increaseProject(experienceIndex: number, projectIndex: number) {
    this.startLoaderForGettingContent();

    const projectArray = this.getProjects(experienceIndex);

    let projectDescription = projectArray
      .at(projectIndex)
      .get('projectDescription')?.value;
    console.log(projectDescription);

    if (projectDescription == null || projectDescription == '') {
      projectDescription = 'Create content by your own';
    }

    const payload = {
      summary: projectDescription,
    };

    const route = `content/get-ai-project-content?operation=${'increase'}`;

    this.api.retrieve(route, payload).subscribe({
      next: (response) => {
        if (response) {
          this.stopProcess();

          const content = response as any;

          const projectDescription = projectArray
            .at(projectIndex)
            .get('projectDescription')
            ?.setValue(content.summary);

          this.stopProcess();

          this.updateDetails();
        }
      },
      error: (error) => {
        this.stopProcess();
      },
    });
  }

  decreaseProject(experienceIndex: number, projectIndex: number) {
    this.startLoaderForGettingContent();

    const projectArray = this.getProjects(experienceIndex);

    let projectDescription = projectArray
      .at(projectIndex)
      .get('projectDescription')?.value;

    if (projectDescription == null || projectDescription == '') {
      projectDescription = 'Create content by your own';
    }

    const payload = {
      summary: projectDescription,
    };

    const route = `content/get-ai-project-content?operation=${'decrease'}`;

    this.api.get(route).subscribe({
      next: (response) => {
        if (response) {
          const content = response as any;

          const projectDescription = projectArray
            .at(projectIndex)
            .get('projectDescription')
            ?.setValue(content.summary);

          this.stopProcess();

          this.updateDetails();
        }
      },
      error: (error) => {
        this.stopProcess();
      },
    });
  }

  increaseResponsibilities(experienceIndex: number) {
    this.startLoaderForGettingContent();

    const res = this.experienceControls
      .at(experienceIndex)
      .get('responsibilities')?.value;

    let responsibilities;
    if (res == null || res.length === 0) {
      responsibilities = 'create Responsibilites by your own';
    } else {
      responsibilities = Array.isArray(res)
        ? res
          .map((r: any) =>
            typeof r === 'string' ? r : r.task || r.value || ''
          )
          .join(', ')
        : res;
    }

    const payload = {
      summary: responsibilities,
    };

    const route = `content/get-ai-exp-content?operation=${'Increase'}`;

    this.api.retrieve(route, payload).subscribe({
      next: (response) => {
        if (response) {
          const content = response as any;

          const responsibilities = content.summary
            ? content.summary.split(',').map((skill: string) => skill.trim())
            : [];

          const control = this.experienceControls
            .at(experienceIndex)
            .get('responsibilities');

          if (control) {
            const current = control.value || [];
            const updated = [...current, ...responsibilities];
            control.setValue(updated);
          }

          this.stopProcess();

          this.updateDetails();
        }
      },
      error: (error) => {
        this.stopProcess();
      },
    });
  }

  decreaseResponsibilities(experienceIndex: number) {
    this.startLoaderForGettingContent();

    const res = this.experienceControls
      .at(experienceIndex)
      .get('responsibilities')?.value;

    let responsibilities;
    if (res == null || res.length === 0) {
      responsibilities = 'create Responsibilites by your own';
    } else {
      responsibilities = Array.isArray(res)
        ? res
          .map((r: any) =>
            typeof r === 'string' ? r : r.task || r.value || ''
          )
          .join(', ')
        : res;
    }

    const payload = {
      summary: responsibilities,
    };

    const route = `content/get-ai-exp-content?operation=${'Decrease'}`;

    this.api.retrieve(route, payload).subscribe({
      next: (response) => {
        if (response) {
          const content = response as any;

          const responsibilities = content.summary
            ? content.summary.split(',').map((skill: string) => skill.trim())
            : [];

          const control = this.experienceControls
            .at(experienceIndex)
            .get('responsibilities');

          if (control) {
            const current = control.value || [];
            const updated = [...current, ...responsibilities];
            control.setValue(responsibilities);
          }

          this.stopProcess();

          this.updateDetails();
        }
      },
      error: (error) => {
        this.stopProcess();
      },
    });
  }
  async previewPdf() {
    // this.isPreview = true;
    this.startProcess();

    const route = `candidate/get-bytearray?additionalDetails=${this.addAdditoinalDetail}`;

    if (this.templateName === null || this.templateName === undefined) {
      this.templateName = localStorage.getItem('templateName');
    }

    const payload = {
      ...this.candidates,
      templateName: this.templateName,
    };

    const formData = new FormData();
    formData.append('templateName', this.templateName);

    this.api.downloadFile(route, payload).subscribe({
      next: async (pdfBlob: Blob) => {
        try {
          //  Step 1: Lazy-load pdfjs-dist dynamically
          const pdfjsLib = await import('pdfjs-dist/build/pdf');
          const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');

          //  Step 2: Configure the worker
          (pdfjsLib as any).GlobalWorkerOptions.workerSrc = pdfjsWorker;

          // Step 3: Convert blob to array buffer
          this.arrayBuffer = await pdfBlob.arrayBuffer();

          //  Step 4: Load the PDF document
          const pdf = await (pdfjsLib as any).getDocument({
            data: this.arrayBuffer,
          }).promise;


          const container = this.pdfContainer.nativeElement;
          container.innerHTML = '';

          this.totalPdfPages = pdf.numPages

          const numPages = pdf.numPages;
          for (let i = 1; i <= numPages; i++) {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 1.2 });

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d')!;
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            const renderContext = { canvasContext: context, viewport };
            await page.render(renderContext).promise;


            canvas.style.display = 'block';
            canvas.style.margin = '10px auto';
            canvas.style.maxWidth = '100%';
            canvas.style.boxShadow = '0 0 8px rgba(0, 0, 0, 0.1)';

            const separator = document.createElement('div');
            separator.className = 'page-separator';
            separator.innerHTML = `<span style="font-size: 15px; font-weight:500;">Page ${i}</span>`;
            container.appendChild(separator);

            container.appendChild(canvas);

            this.htmlcontent = canvas;
          }

          // this.isPreview = false;
          this.stopProcess();
        } catch (err) {
          this.stopProcess();
        }
      },
      error: (err) => {
        console.error('API Error:', err);
        this.stopProcess();
      },
    });
  }

  updateDetails(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.generating = true;
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
              localStorage.setItem('candidateId', this.candidateId);
              this.candidates = response;

              this.generating = false;
            } else {
              this.generating = false;
            }

            this.previewPdf();
            // this.close(this.returnCandidate);
            // this.gs.showMessage('Success', 'Create Successfully');
          },
          error: (error) => {
            this.generating = false;
            this.dataLoaded = true;

            this.gs.showMessage('Error', 'Error in Creating Resume');

            console.log(error);
          },
        });
        this.dataLoaded = true;
        resolve();
      } else {
        reject();
        this.generating = false;
        this.showError = true;
        this.candidateForm.markAllAsTouched();
        this.toast.showToast('error', 'Enter All Mandatory Fields');
      }
    });
  }

  getSkillsFromApi() {
    const stored = JSON.parse(localStorage.getItem('skillsData') || '{}');

    if (stored.skills === null || stored.skills === undefined) {
      this.startProcess();
      const route = 'content/get-skills-from-ai';

      const payload = {
        ...this.candidates,
      };

      this.api.retrieve(route, payload).subscribe({
        next: (response) => {
          this.stopProcess();
          if (response) {
            localStorage.setItem('skillsData', JSON.stringify(response));

            this.skills = response?.skills;
            this.softSkills = response?.softSkills;
            this.coreCompentencies = response?.coreCompentencies;
          }

          this.stopProcess();
        },
        error: (error) => {
          this.stopProcess();
          this.dataLoaded = true;
        },
      });
    } else {
      this.skills = stored.skills;
      this.softSkills = stored.softSkills;
      this.coreCompentencies = stored.coreCompentencies;
    }
  }

  logValues() {
    console.log('reduceObjective:', this.reduceObjective);
  }

  onClick(key: ToggleKey) {
    const map = {
      reduceSummary: 'increaseSummary',
      increaseSummary: 'reduceSummary',
      reduceObjective: 'increaseObjective',
      increaseObjective: 'reduceObjective',
    } as const;

    this[key] = !this[key];
    const opposite = map[key];
    if (this[key]) this[opposite] = false;
  }

  changeTemplate() {
    this.router.navigate(['candidate/change-template']);
  }

  onCheckboxChange(event: any) {
    this.addAdditoinalDetail = event.checked;

    this.previewPdf();
  }

  startLoaderForGettingContent() {
    const messages = [
      'Optimizing Content for you...',
      'Please wait...',
      'Almost ready...',
      'Just a moment more...',
    ];

    this.newLoader.showLoader(messages, 3500);
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

  proceedToDownload(event: any) {
    this.showConfirmationPopup = false
    this.createCandidate();
  }

  editContent(event: any) {
    this.showConfirmationPopup = false
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

}
