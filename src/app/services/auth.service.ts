import { Injectable } from '@angular/core';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: any;

  constructor() { }

  ngOnInit() {
  }

  isAuthenticated(): boolean {
    const userName = localStorage.getItem('userName');
    return userName ? true : false;
  }

}
