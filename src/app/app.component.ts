import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceServiceService } from './services/device.service.service';
import { GlobalService } from './services/global.service';
@Component({
  standalone: false, 
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'make-profile';
  

  constructor(private router: Router,private deviceServiceService:DeviceServiceService,private gs:GlobalService) {}

  ngOnInit() {
    this.gs.loadData();
  }

}
