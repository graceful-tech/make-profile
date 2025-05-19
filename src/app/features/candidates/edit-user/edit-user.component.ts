import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { GlobalService } from 'src/app/services/global.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [CommonModule, FormsModule,ButtonModule],
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  user: any = {};
  showPassword: boolean = false;
  isLoading: boolean = false;

  constructor(
    public gs: GlobalService,
    private api: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.gs.user$.subscribe((response: any) => {
      const userName = response?.userName || sessionStorage.getItem('userName');
      if (userName) {
        this.getUserByUserName(userName);
      }
    });
  }

  getUserByUserName(userName: string): void {
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

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  saveUser(): void {
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
