declare var google: any;
import { Injectable } from '@angular/core';
import { GlobalService } from './global.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: any;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  isAuthenticated(): boolean {
    const userName = localStorage.getItem('userName');
    return userName ? true : false;
  }

  signOut() {
    if (confirm('Are you sure you want to sign out?')) {
      google.accounts.id.disableAutoSelect();
      localStorage.clear();
      sessionStorage.clear();
      this.router.navigate(['/landing']);
    }
  }

}
