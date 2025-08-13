import { Component } from '@angular/core';
import { LoaderService } from 'src/app/services/loader.service';
import { MobileLoaderService } from 'src/app/services/mobile.loader.service';

@Component({
  selector: 'app-mobile-loader',
  standalone: false,
  templateUrl: './mobile-loader.component.html',
  styleUrl: './mobile-loader.component.css'
})
export class MobileLoaderComponent {

  isUploading: boolean = false;

  constructor(public  loaderService: MobileLoaderService) {}


  startLoader(){
    this.isUploading = true;
  }

  stopLoader(){
    this.isUploading = false;
  }

}
