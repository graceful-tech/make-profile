import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

@Injectable({
  providedIn: 'root'
})
export class DeviceServiceService {

  
  constructor(private deviceDetectorService: DeviceDetectorService,private router: Router) {}

   getCurrentDevice(): DeviceType {
    const isMobile = this.deviceDetectorService.isMobile();
    const isTablet = this.deviceDetectorService.isTablet();

    if (isMobile) {
      return 'mobile';
    } 
    
    // else if (isTablet) {
    //   return 'tablet';
    // } 
    
    else {
      return 'desktop';
    }
  }

  goTo(feature: string, page: string): void {
    const device = this.getCurrentDevice();

    let fullPath = `/${feature}/${page}`;
    if (device === 'mobile') {
      fullPath = `/${feature}/mob-${page}`;
    } else if (device === 'tablet') {
      fullPath = `/${feature}/tab-${page}`;
    }

    this.router.navigate([fullPath]);
  }

  directlyTo(feature: string): void {
    const device = this.getCurrentDevice();

    let fullPath = `${feature}`;
    if (device === 'mobile') {
      fullPath = `mob-${feature}`;
    } 
    
    // else if (device === 'tablet') {
    //   fullPath = `tab-${feature}`;
    // }

    this.router.navigate([fullPath]);
  }
}
