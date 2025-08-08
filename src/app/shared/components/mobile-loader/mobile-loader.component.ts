import { Component } from '@angular/core';

@Component({
  selector: 'app-mobile-loader',
  standalone: false,
  templateUrl: './mobile-loader.component.html',
  styleUrl: './mobile-loader.component.css'
})
export class MobileLoaderComponent {

  isUploading: boolean = false;


  startLoader(){
    this.isUploading = true;
  }

  stopLoader(){
    this.isUploading = false;
  }

}
