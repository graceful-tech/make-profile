import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ToastMessage } from '../models/message/toast.model'; 

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastSubject = new BehaviorSubject<ToastMessage | null>(null);
  toast$ = this.toastSubject.asObservable();

  showToast(type: ToastMessage['type'], text: string) {
    
    this.toastSubject.next({ type, text });

    setTimeout(() => this.toastSubject.next(null), 4000);
  }
}
