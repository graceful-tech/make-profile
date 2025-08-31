import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { GlobalService } from 'src/app/services/global.service';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'app-use-existing-template',
  standalone: false,
  templateUrl: './use-existing-template.component.html',
  styleUrl: './use-existing-template.component.css',
})
export class UseExistingTemplateComponent {
  availableCredits: any;
  totalCreditsAvailable: any;
  candidateImageUrl: any;
  totalRecords: any;
  currentPage: number = 1;
  maxLimitPerPageForResume: number = 5;
  dataLoaded: boolean = false;
  editingRow: number | null = null;
  editedNickName: string = '';
  balanceCredits: any;
  candidates: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private ps: PaymentService,
    private gs: GlobalService
  ) {
    this.gs.candidateDetails$.subscribe((response) => {
      if (response !== null) {
        this.candidates = response;
      }
    });

    this.gs.candidateImage$.subscribe((response) => {
      if (response !== null) {
        this.candidateImageUrl = response;
      }
    });
  }

  ngOnInit() {
    this.getAvailableCredits();
    this.getAvailableCreditsCount();
  }

  getAvailableCredits() {
    this.dataLoaded = false;
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
          this.dataLoaded = true;
          this.availableCredits = response?.results as any;
        }
        this.totalRecords = response?.totalRecords;
      },
      error: (Error) => {
        this.dataLoaded = true;
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
        }, 2000);
      });

      // this.ps.payWithRazorPay(amount, templateName);
      this.ps.payWithRazorNewPay(amount, templateName, nickName);
    } else {
      alert('Please enter a valid amount ₹10 or more.');
    }
  }

  navigateToVerify(templateName: any) {
    if (this.balanceCredits > 0) {
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
    } else {
      this.gs.showMobileMessage('Error','You dont have credits');
    }
  }

  goBack() {
    this.router.navigate(['mob-candidate']);
  }

  onPageChangeTemplate(event: any) {
    this.currentPage = event.page + 1;
    this.maxLimitPerPageForResume = event.rows;
    this.getAvailableCredits();
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
            this.gs.showMessage('success', 'Update nickname successfully');
          }
        },
        error: (error) => {
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

  getAvailableCreditsCount() {
    const userId = sessionStorage.getItem('userId');

    const route = 'credits/get-available-credits';

    this.api.get(route).subscribe({
      next: (response) => {
        this.balanceCredits = response as any;
      },
    });
  }
}
