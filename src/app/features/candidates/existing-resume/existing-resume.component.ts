import { ChangeDetectorRef, Component } from '@angular/core';
import { ChooseTemplateComponent } from '../Templates/choose-template/choose-template.component';
import { ApiService } from 'src/app/services/api.service';
import { FormBuilder } from '@angular/forms';
import { GlobalService } from 'src/app/services/global.service';
import { DatePipe } from '@angular/common';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { PaymentService } from 'src/app/services/payment.service';
import { VerifyCandidatesComponent } from '../verify-candidates/verify-candidates.component';

@Component({
  selector: 'app-existing-resume',
  standalone: false,
  templateUrl: './existing-resume.component.html',
  styleUrl: './existing-resume.component.css',
})
export class ExistingResumeComponent {
  candidates: any;
  candidateImageUrl: any;
  availableCredits: any;
  totalCreditsAvailable: any;
  totalRecords!: number;
  currentPage: number = 1;
  maxLimitPerPageForResume: number = 5;

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
    private ngxLoader: NgxUiLoaderService,
    private ps: PaymentService,
    private config: DynamicDialogConfig
  ) {
    this.candidates = this.config.data?.candidates;
    this.candidateImageUrl = this.config.data?.candidateImage;
  }

  ngOnInit() {
    this.getAvailableCredits();
    console.log('keerthi');
  }

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
        if (response) {
          this.availableCredits = response?.results as any;
          this.totalCreditsAvailable = this.availableCredits.reduce(
            (sum: any, credit: { creditAvailable: any }) =>
              sum + (credit.creditAvailable || 0),
            0
          );
        }
        this.totalRecords = response?.totalRecords;
      },
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

  navigateToVerify(templateName: any, creditAvailable: any, nickName: any) {
    this.ref.close();

    if (creditAvailable > 0) {
      const ref = this.dialog.open(VerifyCandidatesComponent, {
        data: {
          candidates: this.candidates,
          payments: true,
          candidateImage: this.candidateImageUrl,
          resumeName: templateName,
          nickName: nickName,
        },
        closable: true,
        width: '70%',
        height: '90%',
        header: 'Check Your Details',
      });
    } else {
      this.gs.customWebMessage(
        'Oops..!',
        'You don’t have enough credits to check eligibility.',
        templateName,
        nickName
      );
    }
  }

  onPageChangeTemplate(event: any) {
    this.currentPage = event.page + 1;
    this.maxLimitPerPageForResume = event.rows;
    this.getAvailableCredits();
  }
}
