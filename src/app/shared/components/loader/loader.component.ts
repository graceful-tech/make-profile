import { Component } from '@angular/core';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-loader',
  standalone: false,
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css'
})
export class LoaderComponent {
  isUploading: boolean = false;

  constructor(public  loaderService: LoaderService) {}


  startLoader(){
    this.isUploading = true;
  }

  stopLoader(){
    this.isUploading = false;
  }
}
