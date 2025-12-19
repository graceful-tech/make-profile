import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { IS_APPLY_JOB_REQUEST, IS_GLOBAL_REQUEST } from './api.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class InterceptorService implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (
      request.url.includes('/login') ||
      request.url.includes('/google-login') ||
      request.url.includes('/user/create') ||
      request.url.includes('/forgot-password/users') ||
      request.url.includes('/candidate/by_mobile') ||
      request.url.includes('/forgot-password/verify-otp') ||
      request.url.includes('/forgot-password/update-password') ||
      request.url.includes('/value-sets/search-by-code') ||
      request.url.includes('/cities') ||
      request.url.includes('/cities/retrive-cities') ||
      request.url.includes('/candidate/create') ||
      request.url.includes('/candidate/upload-image') ||
      request.url.includes('/open-ai/get-details') ||
      request.url.includes('/resume-ai/upload-resume') ||
      request.url.includes('/user/create-by-resume') ||
      request.url.includes('/open-ai/get-details-login') || 
      request.url.includes('/resume-ai/upload-ai-resume') ||
      request.url.includes('/candidate/check_mobile')  ||
      request.url.includes('/candidate/get-bytearray')  ||
      request.url.includes('/job-category') || 
      request.url.includes('/content/get-suggested-skills') || 
      request.url.includes('/templates/get-all')
    ) {
      console.log('Skipping interceptor for login request');
      return next.handle(request);
    }
    const token = sessionStorage.getItem('token');
    if (token !== 'undefined' && token !== '' && token !== null) {
      const payloadBase64 = token.split('.')[1];
      const payloadJson = atob(payloadBase64);
      const payload = JSON.parse(payloadJson);

      const expiryTime = payload.exp * 1000; // Convert seconds to ms
      const currentTime = Date.now();

      if (currentTime < expiryTime) {
        const clonedRequest = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
        return next.handle(clonedRequest);
      } else {
        const currentUrl = this.router.url;

        console.log('Token missing. Redirecting based on route:', currentUrl);

        if (currentUrl.includes('/mob-candidate')) {
          this.router.navigate(['/mob-login']);
        } else if (currentUrl.includes('/candidate')) {
          this.router.navigate(['/login']);
        } else {
          this.router.navigate(['/login']); // fallback
        }

        return EMPTY;
      }
    } else {
      const currentUrl = this.router.url;
      if (currentUrl.includes('/mob-candidate')) {
        this.router.navigate(['/mob-login']);
      } else if (currentUrl.includes('/candidate')) {
        this.router.navigate(['/login']);
      } else {
        this.router.navigate(['/login']); // fallback
      }
    }

    return next.handle(request);
  }
}
