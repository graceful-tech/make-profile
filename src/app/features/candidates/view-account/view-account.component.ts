import { Component } from '@angular/core';
import { GlobalService } from '../../../services/global.service';
import { ApiService } from '../../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-account',
  standalone: false,
  templateUrl: './view-account.component.html',
  styleUrl: './view-account.component.css'
})
export class ViewAccountComponent {
  userId: any;
  user: any;
  constructor(public gs: GlobalService, private api: ApiService, private router: Router) { }
  ngOnInit() {
    this.gs.user$.subscribe((response: any) => {
      this.userId = response?.id;
      this.getUserById();
    });

  }

  getUserById() {
    // const route = `users/${this.userId}`;

    const route = `user/get_user/${sessionStorage.getItem('userName')}`
    this.api.get(route).subscribe({


      next: response => {
        this.user = response;

      }
    });

  }
  signOut() {
    this.router.navigate(['editUser']);
  }

}
