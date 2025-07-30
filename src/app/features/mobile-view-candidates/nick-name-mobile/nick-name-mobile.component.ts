import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-nick-name-mobile',
  standalone: false,
  templateUrl: './nick-name-mobile.component.html',
  styleUrl: './nick-name-mobile.component.css'
})
export class NickNameMobileComponent {
  nickName: string = '';
    showError: boolean = false;
    templateName: any;
  
    constructor(
       private dialog: DialogService,
          private route: ActivatedRoute,
          private cdr: ChangeDetectorRef,
          private router: Router,
          public ref: DynamicDialogRef,
          private config: DynamicDialogConfig,
          private gs:GlobalService
      ) 
      {
      this.templateName = this.config.data?.templateName;
      }
       
      
  submit() {
    if (this.nickName) {
      this.showError = false;
         if(this.templateName!== null && this.templateName!==undefined){

          localStorage.setItem('nickName',this.nickName);
           this.naviagteToVerifyPage(this.templateName)
         }
         else{
            localStorage.setItem('nickName',this.nickName);
            const templateName = localStorage.getItem('templateName');
            this.naviagteToVerifyPage(templateName);
         }
    } else {
      this.showError = true;
     }
  }

  naviagteToVerifyPage(templateName: any) {
     this.ref.close();
    this.gs.setResumeName(templateName);
    this.router.navigate(['mob-candidate/edit-candidate']);
  }

  

}
