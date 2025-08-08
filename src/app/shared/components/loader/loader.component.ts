import { Component } from '@angular/core';

@Component({
  selector: 'app-loader',
  standalone: false,
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css'
})
export class LoaderComponent {
  isUploading: boolean = false;


  startLoader(){
    this.isUploading = true;
  }

  stopLoader(){
    this.isUploading = false;
  }
}
