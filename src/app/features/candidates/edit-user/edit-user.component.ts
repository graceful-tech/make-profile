import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css'
})
export class EditUserComponent {
  userId: any;
    user: any;
    constructor(public gs: GlobalService, private api: ApiService,private router:Router) { }
    ngOnInit() {
      this.gs.user$.subscribe((response: any) => {
        this.userId = response?.id;
        this.getUserById();
      });
  
}

getUserById() {
  // const route = `users/${this.userId}`;
  
   const route = `user/get_user/${sessionStorage.getItem('userName') }`
  this.api.get(route).subscribe({
    

    next: response => {
      this.user = response;
      
    }
  });
}
}