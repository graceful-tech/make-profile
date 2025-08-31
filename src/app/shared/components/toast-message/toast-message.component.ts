import { Component, OnInit } from '@angular/core';
import { ToastMessage } from 'src/app/models/message/toast.model';
import { ToastService } from 'src/app/services/toast.service';
 
@Component({
  selector: 'app-toast-message',
  standalone: false,
  templateUrl: './toast-message.component.html',
  styleUrl: './toast-message.component.css'
})
export class ToastMessageComponent implements OnInit{

  toast: ToastMessage | null = null;

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.toastService.toast$.subscribe(msg => {
      this.toast = msg;
    });
  }

}
