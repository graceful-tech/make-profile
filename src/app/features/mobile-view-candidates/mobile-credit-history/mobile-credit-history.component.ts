import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { GlobalService } from 'src/app/services/global.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-mobile-credit-history',
  standalone: false,
  templateUrl: './mobile-credit-history.component.html',
  styleUrl: './mobile-credit-history.component.css',
})
export class MobileCreditHistoryComponent {
  currentPage: number = 1;
  maxLimitPerPage: number = 10;
  totalRecords!: number;
  maxLimitPerPageForResume: number = 5;
  availableCredits: any;
  totalCreditsAvailable: number = 0;
  balanceCredits: number = 0;
  dataLoaded:boolean=true;

  constructor(
    private router: Router,
    private api: ApiService,
    private loader: LoaderService,
    public gs: GlobalService
  ) {}

  ngOnInit() {
    this.getCreditHistory();
    this.getSumAvailableCredits();
  }

  onPageChangeTemplate(event: any) {
    this.currentPage = event.page + 1;
    this.maxLimitPerPageForResume = event.rows;
    this.getCreditHistory();
  }

  goBack() {
    this.router.navigate(['mob-candidate']);
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
          console.log(this.availableCredits);
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
