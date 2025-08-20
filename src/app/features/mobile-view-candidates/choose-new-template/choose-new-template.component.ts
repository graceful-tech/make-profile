import { ChangeDetectorRef, Component } from '@angular/core';
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

@Component({
  selector: 'app-choose-new-template',
  standalone: false,
  templateUrl: './choose-new-template.component.html',
  styleUrl: './choose-new-template.component.css',
})
export class ChooseNewTemplateComponent {
  candidates: any;
  candidateImageUrl: any;

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

  ngOnInIt() {}

  chooseTemplate() {
    this.close();

    this.gs.setCandidateDetails(this.candidates);
    this.router.navigate(['mob-candidate/choose-Template']);
  }

  useExistingResume() {
    this.close();
    this.router.navigate(['mob-candidate/Use-existing']);
  }

  close() {
    this.ref.close();
  }
}
