import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/services/api.service';
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
  nickNames:any;
  
    constructor(
       private dialog: DialogService,
          private route: ActivatedRoute,
          private cdr: ChangeDetectorRef,
          private router: Router,
          public ref: DynamicDialogRef,
          private config: DynamicDialogConfig,
          private gs:GlobalService,
          private api:ApiService
      ) 
      {
      this.templateName = this.config.data?.templateName;
      }
       
      ngOnInit() {
     this.getNickNames();
    }
      
  submit() {
    if (this.nickName && this.nickName.trim() !== '') {
       this.showError = false;
         if(this.templateName!== null && this.templateName!==undefined){

          if(!this.nickNames.includes(this.nickName.trim())){
            localStorage.setItem('nickName',this.nickName);
            this.naviagteToVerifyPage(this.templateName,this.nickName)
            }
            else{
              this.gs.showMobileMessage('error','Nick name already exist');
            }
         }
         else{

          if(!this.nickNames.includes(this.nickName.trim())){
             localStorage.setItem('nickName',this.nickName);
            const templateName = localStorage.getItem('templateName');
            this.naviagteToVerifyPage(templateName,this.nickName);
            }
            else{
              this.gs.showMobileMessage('error','Nick name already exist');
            }
         }
    } else {
      this.showError = true;
     }
  }

  naviagteToVerifyPage(templateName: any,nickName:any) {
     this.ref.close();
    this.gs.setResumeName(templateName);
    this.gs.setNickName(nickName);
    this.router.navigate(['mob-candidate/edit-candidate']);
  }

   getNickNames(){
      const route ='credits/get-nicknames'

       this.api.get(route).subscribe({
      next: (response) => {
         if(response){
        this.nickNames = response;
         }
      },
    });
    }
}
