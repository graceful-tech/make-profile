import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { IS_APPLY_JOB_REQUEST, IS_GLOBAL_REQUEST } from './api.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(private router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (request.url.includes('/login') || request.url.includes('/google-login') || request.url.includes('/user/create')
    ) {
      console.log('Skipping interceptor for login request');
      return next.handle(request);
    }
    const token = sessionStorage.getItem('token');


    if (token !== 'undefined') {
      const clonedRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(clonedRequest);
    } else {
      const currentUrl = this.router.url;

      console.log('Token missing. Redirecting based on route:', currentUrl);

      if (currentUrl.includes('/mob-candidate')) {
        this.router.navigate(['/mobile-login']);
      } else if (currentUrl.includes('/candidate')) {
        this.router.navigate(['/login']);
      } else {
        this.router.navigate(['/login']); // fallback
      }

      return EMPTY;
    }

    return next.handle(request);
  }
}
