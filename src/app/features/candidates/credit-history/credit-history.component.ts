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
  balanceCredits: any;
  dataLoaded: boolean = true;
  constructor(
    private router: Router,
    private api: ApiService,
    private loader: LoaderService,
    public gs: GlobalService
  ) { }

  ngOnInit() {
    this.getCreditHistory();
    this.getSumAvailableCredits();
  }
  goBack() {
    this.router.navigate(['candidate']);
  }

  onPageChange(event: any) {
    this.currentPage = event.page + 1;
    this.maxLimitPerPageForResume = event.rows;
    this.getCreditHistory();
  }

  getCreditHistory() {
    this.dataLoaded = false;
    const id = sessionStorage.getItem('userId');

    const route = 'credits/credit-history';
    const payload = {
      userId: id,
      page: this.currentPage,
      limit: this.maxLimitPerPageForResume,
    };
    this.api.create(route, payload).subscribe({
      next: (response) => {
        this.dataLoaded = true;
        if (response?.results.length > 0) {
          this.availableCredits = response?.results as any;
          this.totalCreditsAvailable = this.availableCredits.reduce(
            (sum: any, credit: { creditAvailable: any }) =>
              sum + (credit.creditAvailable || 0),
            0
          );
        }
        this.totalRecords = response?.totalRecords;
      },
      error: (error) => {
        this.dataLoaded = true;
      },
    });
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
