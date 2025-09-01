import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { GlobalService } from 'src/app/services/global.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-credit-history',
  standalone: false,
  templateUrl: './credit-history.component.html',
  styleUrl: './credit-history.component.css',
})
export class CreditHistoryComponent {
  currentPage: number = 1;
  maxLimitPerPage: number = 10;
  totalRecords!: number;
  maxLimitPerPageForResume: number = 5;
  availableCredits: any;
  totalCreditsAvailable: number = 0;

  constructor(
    private router: Router,
    private api: ApiService,
    private loader: LoaderService,
    public gs: GlobalService
  ) {}

  ngOnInit() {
    this.getAvailableCreditss();
  }
  goBack() {
    this.router.navigate(['candidate']);
  }

  onPageChangeTemplate(event: any) {
    this.currentPage = event.page + 1;
    this.maxLimitPerPageForResume = event.rows;
    this.getAvailableCreditss();
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
}
