import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/services/api.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-landing-page-mobile',
  standalone: false,
  templateUrl: './landing-page-mobile.component.html',
  styleUrl: './landing-page-mobile.component.css'
})
export class LandingPageMobileComponent {



  constructor(private fb: FormBuilder, private api: ApiService, private gs: GlobalService, private router: Router,
    private dialog: DialogService, private route: ActivatedRoute,) { }

  ngOnInit() { }

  candidate() {
    this.router.navigate(['/candidates'],
      { relativeTo: this.route });
  }

  toLogin(){
     this.router.navigate(['/mob-login']);
  }

}
