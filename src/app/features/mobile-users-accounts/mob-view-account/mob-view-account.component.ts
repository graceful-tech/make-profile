import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Toast } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';
import { GlobalService } from 'src/app/services/global.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-mob-view-account',
  standalone: false,
  templateUrl: './mob-view-account.component.html',
  styleUrl: './mob-view-account.component.css'
})
export class MobViewAccountComponent {
  userId: any;
  user: any = {};
  editUser: boolean = true;
  headingName: any = 'My Account';
  constructor(public gs: GlobalService, private api: ApiService, private router: Router, private toast: ToastService) { }
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

  editOut() {
    this.editUser = false;
    this.headingName = 'Edit Account';
  }
  signOut() {
    this.router.navigate(['/mob-candidate'])
  }
  showPassword: boolean = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }


  updateUser() {
    const userName = this.user?.userName || sessionStorage.getItem('userName');
    const route = `user/update_user/${userName}`;
    this.api.update(route, this.user).subscribe({
      next: () => {
        this.headingName = 'My Account';
        this.toast.showToast('success', 'User updated successfully');

      },
      error: (err) => {
        console.error('Error updating user:', err);
        alert('Failed to update user.');
      }
    });
  }


}
