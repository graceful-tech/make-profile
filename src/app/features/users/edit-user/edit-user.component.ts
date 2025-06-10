import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { GlobalService } from 'src/app/services/global.service';
 
@Component({
  selector: 'app-edit-user',
  standalone: false,
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent {
  user: any = {};
  showPassword: boolean = false;
  isLoading: boolean = false;

  constructor(
    public gs: GlobalService,
    private api: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.gs.user$.subscribe((response: any) => {
      const userName = response?.userName || sessionStorage.getItem('userName');
      if (userName) {
        this.getUserByUserName(userName);
      }
    });
  }

  getUserByUserName(userName: string) {
    const route = `user/get_user/${userName}`;
    this.isLoading = true;
    this.api.get(route).subscribe({
      next: (response) => {
        this.user = response;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching user:', err);
        this.isLoading = false;
      }
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  saveUser() {
    const userName = this.user?.userName || sessionStorage.getItem('userName');
    const route = `user/update_user/${userName}`;
    this.api.update(route, this.user).subscribe({
      next: () => {
        alert('User updated successfully.');
        // Optional: redirect after save
        // this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Error updating user:', err);
        alert('Failed to update user.');
      }
    });
  }
  viewOut(){
    this.router.navigate(['viewUser']);
  }
  
  
}
