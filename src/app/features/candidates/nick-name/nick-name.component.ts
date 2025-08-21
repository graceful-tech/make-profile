import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { VerifyCandidatesComponent } from '../verify-candidates/verify-candidates.component';
import { Candidate } from 'src/app/models/candidates/candidate.model';
import { ApiService } from 'src/app/services/api.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-nick-name',
  standalone: false,
  templateUrl: './nick-name.component.html',
  styleUrl: './nick-name.component.css'
})
export class NickNameComponent {

  nickName: string = '';
  showError: boolean = false;
  payments: any;
  resumeName: any;
  candidates: any;
  candidateId: any;
  candidateImageUrl: any;
  nickNames:any;

  constructor(
     private dialog: DialogService,
        private route: ActivatedRoute,
        private cdr: ChangeDetectorRef,
        private router: Router,
        public ref: DynamicDialogRef,
        private config: DynamicDialogConfig,
        private api:ApiService,
        private gs:GlobalService

    ) 
    {
    this.candidates = this.config.data?.candidates;
    this.payments = this.config.data?.payments;
    this.candidateImageUrl = this.config.data?.candidateImage;
    this.resumeName = this.config.data?.resumeName;
  
    }

  ngOnInit() {
    localStorage.removeItem('nickName');
     this.getNickNames();
    }

  submit() {
    if (this.nickName && this.nickName.trim() !== '') {
       this.showError = false;
     
      if(!this.nickNames.includes(this.nickName.trim())){
         localStorage.setItem('nickName',this.nickName)
        this.createResume();
      }
      else{
        this.gs.showMessage('error','Nick name already exist');
      }

    } else {
      this.showError = true;
     }
  }

   createResume() {
      this.ref.close();
      const candidateId = localStorage.getItem('candidateId');

      const ref = this.dialog.open(VerifyCandidatesComponent, {
        data: {
        candidates: this.candidates,
        payments:true,
        candidateImage :this.candidateImageUrl,
        resumeName:this.resumeName,
        nickName:this.nickName
         },
        closable: true,
        width: '70%',
        height: '90%',
        header: 'Check Your Details',
      });
  
      ref.onClose.subscribe((response) => {
        if (response) {
          this.candidates = response;
          this.candidateId = response.id;
          const candidate = response as Candidate;
         }
      });
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
