import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/services/api.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-landing-page',
  standalone: false,
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {
   

 
  constructor(private fb: FormBuilder, private api: ApiService, private gs: GlobalService, private router: Router,
    private dialog: DialogService, private route: ActivatedRoute,) { }

    ngOnInit() {
       
  
    }

    candidate(){
      this.router.navigate(['/candidates'], 
        { relativeTo: this.route });
    }

    goToLoginPage(){
      this.router.navigate(['/login']);
    }

    loginWithGoogle() {
      window.location.href = '${environment.restUrl}/oauth2/authorization/google';
  }
  

}
