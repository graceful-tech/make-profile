import * as confetti from 'canvas-confetti';
import { DatePipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { Candidate } from 'src/app/models/candidates/candidate.model';
import { ApiService } from 'src/app/services/api.service';
import { GlobalService } from 'src/app/services/global.service';

import { PaymentService } from 'src/app/services/payment.service';
import { PopupService } from 'src/app/services/popup.service';
import { ResumeCreatingComponent } from 'src/app/features/candidates/resume-creating/resume-creating.component';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-mobile-rewards-success',
  standalone: false,
  templateUrl: './mobile-rewards-success.component.html',
  styleUrl: './mobile-rewards-success.component.css'
})
export class MobileRewardsSuccessComponent implements OnInit {
  @Output() valueSent = new EventEmitter<any>();


  receivedMessage: any;

  balanceCredits: number = 0;
  candidateId: any;
  credits: any;
  candidates: Array<Candidate> = [];
  userId: any;
  isUploading: boolean = false;
  resumeName: any;
  templateName: any;
  planetImagePath: any;
  availableCredits: any;
  generating: boolean = false;
  nickName: any;
  showSuccessPopup: boolean = false;

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private gs: GlobalService,
    private datePipe: DatePipe,
    private dialog: DialogService,
    private route: ActivatedRoute,
    private router: Router,
    public ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private loader: LoaderService
  ) {
    this.userId = sessionStorage.getItem('userId');
  }

  ngOnInit() {
    this.launchConfetti();
  }

  launchConfetti() {
    const duration = 2000;
    const end = Date.now() + duration;

    const myConfetti = confetti.create(
      document.getElementById('confetti-canvas') as HTMLCanvasElement,
      {
        resize: true,
        useWorker: true,
      }
    );

    (function frame() {
      myConfetti({
        particleCount: 7,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        shapes: ['square'],
        scalar: 1.2,
      });
      myConfetti({
        particleCount: 15,
        angle: 120,
        spread: 70,
        origin: { x: 1 },
        shapes: ['square'],
        scalar: 1.2,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }

 

  async okButton() {
    const popup = document.querySelector('.refer-popup');
    const overlay = document.querySelector('.popup-overlay');

    if (popup) {
      popup.classList.add('shrink');

      if (overlay) {
        overlay.classList.add('fade-out'); 
      }
      
      this.gs.setReferral(true);

      await new Promise<void>((resolve) => setTimeout(resolve, 2000));
     }

     setTimeout(async () => {
      this.valueSent.emit('Hello from Child!');
      }, 1000);
    

    if (overlay) overlay.remove();
  }

 

 
}
