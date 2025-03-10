import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { BehaviorSubject } from 'rxjs';
// import { MessageComponent } from '../shared/message/message.component';
import { ApiService } from './api.service';
import { MessageComponent } from '../shared/message/message.component';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  private duplicateJobApplied = new BehaviorSubject({});
  public duplicateJobApplied$ = this.duplicateJobApplied.asObservable();

  private status = new BehaviorSubject(null);
  public status$ = this.status.asObservable();

  private user = new BehaviorSubject(null);
  public user$ = this.user.asObservable();

  private customer = new BehaviorSubject(null);
  public customer$ = this.customer.asObservable();

  private breadcrumb = new BehaviorSubject(null);
  public breadcrumb$ = this.breadcrumb.asObservable();

  private panel = new BehaviorSubject('HOME');
  public panel$ = this.panel.asObservable();

  private candidateId = new BehaviorSubject(null);
  public candidateId$ = this.candidateId.asObservable();

  private paymentStatus = new BehaviorSubject(null);
  public paymentStatus$ = this.paymentStatus.asObservable();

  private sidebar = new BehaviorSubject(false);
  public sidebar$ = this.sidebar.asObservable();

  private resumeDetails = new BehaviorSubject(null);
  public resumeDetails$ = this.resumeDetails.asObservable();

  private taskbar = new BehaviorSubject(false);
  public taskbar$ = this.taskbar.asObservable();

  todayEvents: Array<any> = [];
  statusList: Array<any> = [];
  amountStatusList: Array<any> = [];
  candidateCustomFields: Array<any> = [];
  applicationCustomFields: Array<any> = [];
  requirementCustomFields: Array<any> = [];
  reportConfiguration: Array<any> = [];
  amountReportConfiguration: Array<any> = [];
  performanceConfiguration: Array<any> = [];
  dashboardConfiguration: Array<any> = [];
  statusCategory: any;
  idleTimoutsUserId:any
  taskBar$: any;

  constructor(
    private dialog: DialogService,
    private router: Router,
    private api: ApiService,
    private datePipe: DatePipe,
    private messageService: MessageService
  ) {}

  public setDuplicateJobAppliedId(data: any) {
    this.duplicateJobApplied.next(data);
  }

  public setStatus(data: any) {
    this.status.next(data);
  }

  public setUser(data: any) {
    this.user.next(data);
  }

  public setCustomer(data: any) {
    this.customer.next(data);
  }

  public setBreadcrumb(data: any) {
    this.breadcrumb.next(data);
  }

  public setPanel(data: any) {
    localStorage.setItem('panel', data);
    this.panel.next(data);
  }

  public setCandidateId(data: any) {
    this.candidateId.next(data);
  }

  public setPaymentStatus(data: any) {
    this.paymentStatus.next(data);
  }

  public setSidebar(data: boolean) {
    this.sidebar.next(data);
  }

  public setResumeDetails(data: any) {
    this.resumeDetails.next(data);
  }

  public setTaskbar(data: boolean) {
    this.taskbar.next(data);
  }

  showMessage(status: string, message: string) {
    this.dialog.open(MessageComponent, {
      data: {
        message: message,
      },
      closable: false,
      header: status,
    });
  }

  parseTimeToString(time: any) {
    const date = new Date(time);
    let hour = date.getHours();
    let minute = date.getMinutes();
    return hour + ':' + minute;
  }

  parseStringToTime(time: any) {
    const timeArray = time.split(':');
    const date = new Date();
    date.setHours(timeArray[0]);
    date.setMinutes(timeArray[1]);
    return date;
  }

  navigateToHome() {
    this.setPanel('HOME');
    this.router.navigateByUrl('/dashboard');
  }

  loadData() {
    this.getNotifications();
    this.getTodayEvents();
  }
  
  // getNotifications() {
  //   this.retrieveNotifications();
  //   setInterval(() => {
  //     const currentHour = new Date().getHours();
  //     if (currentHour >= 9 && currentHour < 19) {
  //     this.retrieveNotifications();
  //     }
  //   }, 300000)
  // }

  getNotifications() {
    this.retrieveNotifications();
    setInterval(() => {
      const currentHour = new Date().getHours();
      if (currentHour >= 9 && currentHour < 19) {
        this.retrieveNotifications();
      }
    }, 30000);
  }

  getTodayEvents() {
    const route = 'dashboard/today-events';
    this.api.get(route).subscribe({
      next: (response: any) => {
        this.todayEvents = response;
      },
    });
  }

  retrieveNotifications() {
    const route = 'notifications';
    this.api.get(route).subscribe({
      next: (response) => {
        const notifications = response as Array<any>;
        notifications.forEach((notification) => {
          //this.playAudio();

          this.messageService.add({
            key: 'notification',
            severity: 'custom',
            life: 180000,
            data: notification,
          });
        });
      },
    });
  }

  showToast(severity: string, detail: string) {
    let summary;
    if (severity == 'success') {
      summary = 'Success';
    } else if (severity == 'info') {
      summary = 'Info';
    } else {
      summary = 'Error';
    }
    this.messageService.add({
      key: 'message',
      severity: severity,
      summary: summary,
      detail: detail,
    });
  }

  playAudio() {
    let audio = new Audio();
    audio.src = '/assets/audio/notification.mp3';
    audio.load();
    audio.play();
  }

  
}
