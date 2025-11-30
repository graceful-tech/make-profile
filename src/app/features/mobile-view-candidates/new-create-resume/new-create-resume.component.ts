import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
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
import { NgxUiLoaderService } from 'ngx-ui-loader';
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
import { Project } from 'src/app/models/candidates/project';
import {
  DomSanitizer,
  SafeHtml,
  SafeResourceUrl,
} from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { PaymentOptionComponent } from 'src/app/features/candidates/payments/payment-option/payment-option.component';
import { LoaderControllerService } from 'src/app/services/loader-controller.service';
import templatesData from 'src/assets/resume-types/templatesData.json';
import { MobileConfirmationPopupComponent } from 'src/app/shared/components/mobile-confirmation-popup/mobile-confirmation-popup.component';
import { SchoolEducation } from 'src/app/models/candidates/schoolEducation';
import { DiplomaEducation } from 'src/app/models/candidates/diploma-education';


@Component({
  selector: 'app-new-create-resume',
  standalone: false,
  templateUrl: './new-create-resume.component.html',
  styleUrl: './new-create-resume.component.css',
})
export class NewCreateResumeComponent {
  @ViewChild('pdfContainer', { static: false })
  pdfContainer!: ElementRef<HTMLDivElement>;

  currentTab: 'edit' | 'preview' = 'preview';

  resumeData = {
    name: 'Keerthi Vasan',
    role: 'Full Stack Developer',
    summary:
      'Passionate developer with hands-on experience in Angular, Spring Boot, and MySQL.',
  };
  newonew = 'hai';

  resumeSkills: any;
  resumeHTML: any;
  resumeHtml: any;
  resumePages: SafeHtml | null = null;

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
  imageName: any;
  returnImage: any;
  candidatesUpdateData: any;
  skill: Array<any> = [];
  templateName: any;
  isUploading: boolean = false;
  certificateEmptyFields: boolean = false;
  achievementsEmptyFields: boolean = false;
  isLoading: boolean = false;
  isVerifying: boolean = false;
  balanceCredits: any;
  showPopup: boolean = false;
  summaryObjectiveContent: any;
  showErrorPopup: any;
  errorMessage: any;
  errorStatus: any;
  previewSrc: SafeResourceUrl | null = null;
  htmlcontent: any;
  arrayBuffer: any;
  isPreview: boolean = false;
  addAdditoinalDetail: boolean = false;

  isGettingContent: boolean = false;
  skills: Array<any> = [];
  softSkills: Array<any> = [];
  coreCompentencies: Array<any> = [];
  totalPdfPages: any;
  templatesTypes = templatesData.templates;
  showConfirmationPopup: boolean = false;
  schoolEducation: Array<ValueSet> = [];
  diplomaEducation: Array<ValueSet> = [];



  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private gs: GlobalService,
    private datePipe: DatePipe,
    private dialog: DialogService,
    private router: Router,
    public ref: DynamicDialogRef,
    private loader: MobileLoaderService,
    private toast: ToastService,
    private elRef: ElementRef,
    private newLoader: LoaderControllerService
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
  }

  ngOnInit() {
    this.createCandidateForm();
    this.generateYearList();
    this.getGenderList();
    this.getLanguages();
    this.getMaritalStatus();
    this.getFieldOfStudy();
    this.getNationalityList();
    // this.getAvailableCredits();
    this.getSkillsFromApi();
    this.getSchoolEducationFields();
    this.getDiplomaEducationFields();

  }

  ngAfterViewInit() {
    if (this.templateName === null || this.templateName === undefined) {
      this.templateName = localStorage.getItem('templateName');
    }

    if (this.candidates !== null && this.candidates !== undefined) {
      this.candidateId = this.candidates?.id;

      this.gs.candidateImage$.subscribe((response) => {
        if (response !== null) {
          this.candidateImageUrl = response;
        }
      });

      const candidateClone = JSON.parse(JSON.stringify(this.candidates));
      this.patchCandidateForm(candidateClone);
      this.previewPdf();
    } else {
      this.getCandidates();
    }

    this.gs.candidateImage$.subscribe((response) => {
      if (response !== null) {
        this.candidateImageUrl = response;
      }
    });

    // this.previewPdf();
  }

  async previewPdf() {
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
          // ✅ Step 1: Lazy-load pdfjs-dist dynamically
          const pdfjsLib = await import('pdfjs-dist/build/pdf');
          const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');

          // ✅ Step 2: Configure the worker
          (pdfjsLib as any).GlobalWorkerOptions.workerSrc = pdfjsWorker;

          // ✅ Step 3: Convert blob to array buffer
          this.arrayBuffer = await pdfBlob.arrayBuffer();

          // ✅ Step 4: Load the PDF document
          const pdf = await (pdfjsLib as any).getDocument({
            data: this.arrayBuffer,
          }).promise;

          // ✅ Step 5: Clear the old preview container
          const container = this.pdfContainer.nativeElement;
          container.innerHTML = '';

          this.totalPdfPages = pdf.numPages;
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

            // Styling for neat preview
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

          this.stopProcess();
        } catch (err) {
          console.error('PDF Preview Error:', err);
          this.stopProcess();
        }
      },
      error: (err) => {
        console.error('API Error:', err);
        this.stopProcess();
      },
    });
  }

  switchTab(tab: 'edit' | 'preview') {
    this.currentTab = tab;

    if (tab === 'preview') {
      this.updateCandidate();
      setTimeout(() => this.fitPreviewToMobile(), 100);
    }
  }

  fitPreviewToMobile() { }

  @HostListener('window:resize')
  onResize() {
    this.fitToMobile();
  }

  private fitToMobile() {
    const wrapper = this.elRef.nativeElement.querySelector(
      '.resume-scale-wrapper'
    );
    const page = this.elRef.nativeElement.querySelector('.resume-page');
    if (!wrapper || !page) return;

    const viewportWidth = window.innerWidth;
    const isMobile = viewportWidth < 768;

    if (isMobile) {
      const pageWidth = 794;
      const scale = viewportWidth / pageWidth;
      wrapper.style.transform = `scale(${scale})`;
      wrapper.style.transformOrigin = 'top left';
      wrapper.style.margin = '0';
    } else {
      wrapper.style.transform = 'scale(1)';
    }
  }

  // onResumeEdit(event: Event) {
  //   const element = event.target as HTMLElement;
  //   this.editedHtml = element.innerHTML;
  // }

  getEditedHtml(): string {
    const resumePage = this.elRef.nativeElement.querySelector('#resumePage');
    return resumePage ? resumePage.innerHTML : '';
  }

  applyEdit(section: string, action: string) {
    console.log(`Applying ${action} on ${section}`);

    if (section === 'summary' && action === 'reduce') {
      this.resumeHtml = this.resumeHtml
        .toString()
        .replace(
          /Summary[\s\S]*?Objective/,
          'Summary: Shortened summary.<br>Objective'
        );
    }
  }

  saveAlteredHtml(doc: any) {
    let finalHtml = doc.body.innerHTML;

    finalHtml =
      '<!DOCTYPE html>\n ' +
      '<html lang="en">\n' +
      '  <head> \n' +
      ' <meta charset="UTF-8" />' +
      finalHtml;

    if (finalHtml.includes('</style>')) {
      finalHtml = finalHtml.replace(
        '</style>',
        '</style>\n </head>\n  <body>\n'
      );
    }

    finalHtml = finalHtml + '\n  </body> \n </html>';

    finalHtml = finalHtml

      .replace(/SafeValue must use \[property\]=binding: ?/gi, '')
      .replace(/see https:\/\/g\.co\/ng\/security#xss/gi, '')

      .replace(/\(\s*\)\s*/g, '')

      .replace(/SafeValueImpl.*?\)/gi, '')

      .trim();

    this.resumeHtml = finalHtml;

    // this.resumeHtml = this.sanitizer.bypassSecurityTrustHtml(
    //   this.resumeHtml.toString()
    // );
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

  updateCandidate() {
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

      if (Array.isArray(payload.skills)) {
        payload.skills = payload.skills
          .map((r: any) =>
            typeof r === 'string' ? r : r.task || r.value || ''
          )
          .join(', ');
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
            this.candidateId = response?.id;
            this.dataLoaded = true;
            this.candidates = response as Candidate;

            this.stopProcess();

            this.previewPdf();
          }
        },
        error: (error) => {
          this.stopProcess();
          this.dataLoaded = true;
          window.alert('Error in creating please try again');
          console.log(error);
        },
      });
      this.dataLoaded = true;
    } else {
      this.stopProcess();
      this.showError = true;
      this.toast.showToast('error', 'Enter All Mandatory Fields');
      this.candidateForm.markAllAsTouched();
    }
  }

  createCandidate() {
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

      if (Array.isArray(payload.skills)) {
        payload.skills = payload.skills
          .map((r: any) =>
            typeof r === 'string' ? r : r.task || r.value || ''
          )
          .join(', ');
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
            this.candidateId = response?.id;
            this.dataLoaded = true;
            this.candidates = response as Candidate;

            this.stopProcess();
            this.createResume(this.candidates);
          }
        },
        error: (error) => {
          this.stopProcess();
          this.dataLoaded = true;
          window.alert('Error in creating please try again');
          console.log(error);
        },
      });
      this.dataLoaded = true;
    } else {
      this.stopProcess();
      this.showError = true;
      this.toast.showToast('error', 'Enter All Mandatory Fields');

      const firstInvalidControl: HTMLElement =
        this.elRef.nativeElement.querySelector(
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
    if (confirmDelete && this.experienceControls.length >= 1) {
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

    if (confirmDelete && projectArray.length >= 1) {
      // const removedProject = projectArray.at(projectIndex).value;

      // if (removedProject.id) {
      //   const experienceGroup = this.experienceControls.at(experienceIndex);
      //   const projectsControl = experienceGroup.get('projects') as FormArray;
      //   projectsControl.at(projectIndex).patchValue(removedProject);
      // }
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


    if (candidate.certificates?.some((c) => c && c.courseName?.trim())) {
      const certificateFormArray = this.candidateForm.get(
        'certificates'
      ) as FormArray;
      certificateFormArray.clear();

      candidate.certificates?.forEach((certificate) => {
        certificateFormArray.push(this.createCertificateFormGroup(certificate));
      });
    }

    if (candidate.experiences?.some((e) => e && e?.companyName?.trim())) {
      this.patchExperiences(candidate.experiences);
    } else {
      candidate.fresher = true;

      if (
        candidate?.collegeProject.some(
          (c) => c && c?.collegeProjectName?.trim()
        )
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
      strengths: candidate?.strengths ? candidate?.strengths : [],
      goals: candidate?.goals ? candidate?.goals : [],
      extraCurricularActivities: candidate?.extraCurricularActivities ? candidate?.extraCurricularActivities : [],
    });
  }

  createCertificateFormGroup(certificate: Certificates): FormGroup {
    return this.fb.group({
      id: certificate.id,
      courseName: certificate.courseName,
      courseStartDate: this.isValidDate(certificate.courseStartDate),
      courseEndDate: this.isValidDate(certificate.courseEndDate),
    });
  }

  patchExperiences(experiences: any[]) {
    if (experiences?.length > 0) {
      const experienceFormArray = this.candidateForm.get(
        'experiences'
      ) as FormArray;
      experienceFormArray.clear();
      experiences?.forEach((experience) => {
        const experienceForm = this.createExperience();

        const responsibilities = experience.responsibilities
          ? experience.responsibilities
            .split(',')
            .map((skill: string) => skill.trim())
          : [];

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
      isDeleted: false,
    });
  }

  next() {
    this.ref.close();
    const ref = this.dialog.open(PaymentOptionComponent, {
      data: {
        candidates: this.candidates,
        candidateId: this.candidates?.id,
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
    if (
      this.candidateImageUrl !== null &&
      this.candidateImageUrl !== undefined
    ) {
      this.gs.setCandidateImage(this.candidateImageUrl);
    }
    this.router.navigate(['mob-candidate']);
  }

  getCandidates() {
    this.startProcess();

    const route = 'candidate';
    this.api.get(route).subscribe({
      next: (response) => {
        const candidate = response as Candidate;
        if (candidate !== null) {
          this.stopProcess();
          this.candidateId = candidate?.id;
          this.candidates = candidate;

          const candidateClone = JSON.parse(JSON.stringify(candidate));
          this.patchCandidateForm(candidateClone);
          this.getCandidateImage(candidate?.id);

          if (
            this.candidates?.summary === null ||
            this.candidates?.careerObjective == null
          ) {
            this.getSummaryAndObjectiveContent();
          } else {
            this.stopProcess();
          }

          this.previewPdf();
          this.getSkillsFromApi();
        }
      },
      error: (err) => {
        this.stopProcess();
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
          //set global image
          if (
            this.candidateImageUrl !== null &&
            this.candidateImageUrl !== undefined
          ) {
            this.gs.setCandidateImage(this.candidateImageUrl);
          }
        }
      },
      error: (err) => {
        console.error('Error fetching candidate image:', err);

        this.dataLoaded = false;
      },
    });
  }

  addSkill(newSkill: string, key: any) {
    const skills = this.candidateForm.get(key)?.value || [];

    if (newSkill && !skills.includes(newSkill)) {
      const updatedSkills = [...skills, newSkill];
      this.candidateForm.get(key)?.setValue(updatedSkills);
    }
  }

  createResume(candidates: any) {
    this.startProcess();
    const route = `resume/create?additionalDetails=${this.addAdditoinalDetail}`;

    const templateName = localStorage.getItem('templateName');
    if (this.templateName === null || this.templateName === undefined) {
      this.templateName = templateName;
    }

    const payload = { ...candidates, templateName: templateName };

    this.api.retrieve(route, payload).subscribe({
      next: (response) => {
        this.stopProcess();
        if (response.resumePdf) {
          const base64String = response.resumePdf.trim();
          const byteCharacters = atob(base64String);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }

          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'application/pdf' });

          const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

          console.log(isIOS);

          if (isIOS) {
            const fileURL = URL.createObjectURL(blob);
            const newWindow = window.open(fileURL, '_blank');
            if (!newWindow) {
              this.gs.showMobileMessage(
                'Note!',
                "If your using iPhone Go to Setting -> Apps -> Safari -> Turn off 'Block Popups' "
              );
            }
          } else {
            // Other devices: download
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = response.candidateName + '.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            this.toast.showToast('success', 'Resume Downloaded Successfully');
          }
          this.stopProcess();
          this.router.navigate(['/mob-candidate']);
        }
        this.stopProcess();
      },
      error: (error) => {
        this.stopProcess();
        this.showErrorPopup = true;
        this.errorMessage = error.error?.message;
        this.errorStatus = error.error?.status;
      },
    });
  }

  getProjectContentCount(experienceIndex: number): boolean {
    const projects = this.experienceControls
      .at(experienceIndex)
      .get('projects') as FormArray;
    const projectName = projects.controls[0] as any;
    return projectName.controls.projectName?.value !== '' ? true : false;
  }

  goToOpenAi() {
    this.startLoaderForGettingContent();

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

          this.stopProcess();
          const candidateClone = JSON.parse(JSON.stringify(this.candidates));
          this.patchCandidateForm(candidateClone);
        }
        this.stopProcess();
      },
      error: (error) => {
        this.stopProcess();
        this.gs.showMobileMessage('error', error.error?.message);
      },
    });
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

      if (pageType > 1) {
        this.createCandidate();
      }
      else {

        if (this.totalPdfPages > 1) {
          // const ref = this.dialog.open(MobileConfirmationPopupComponent, {
          //   data: {
          //   },
          //   closable: false,
          //   height: '30%',
          //   width:'90%',
          //   styleClass: 'payment-dialog-header-mobile',

          // });

          // ref.onClose.subscribe((response) => {
          //   if (response === 'download') {
          //     this.createCandidate();
          //   }
          //   else {
          //     this.currentTab = 'edit'

          //   }

          // });

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

  closePopup(event: any) {
    this.showPopup = false;
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

  newCreateResume() { }

  increaseSummary(key: any) {
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
          const responseContent = response as any;

          this.candidateForm.get(key)?.setValue(responseContent.summary);
          this.stopProcess();
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

    const route = `content/get-ai-exp-content?operation=${'increase'}`;

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

    const route = `content/get-ai-exp-content?operation=${'increase'}`;

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
        }
      },
      error: (error) => {
        this.stopProcess();
      },
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

  changeTemplate() {
    this.router.navigate(['mob-candidate/change-template']);
  }

  onCheckboxChange(event: any) {
    this.addAdditoinalDetail = event.checked;
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
    this.currentTab = 'edit';
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

  }

  removeSchoolEducation(index: number) {
    const confirmDelete = window.confirm(
      'Are you sure you want to remove this school education?'
    );
    if (confirmDelete && this.schoolControls.length >= 1) {
      this.schoolControls.removeAt(index);

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
  }

  removeDiplomaEducation(index: number) {
    const confirmDelete = window.confirm(
      'Are you sure you want to remove this Diploma/ITI education?'
    );
    if (confirmDelete && this.diplomaControls.length >= 1) {
      this.diplomaControls.removeAt(index);
    }
  }


}
