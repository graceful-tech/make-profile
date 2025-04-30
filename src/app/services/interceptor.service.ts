import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IS_APPLY_JOB_REQUEST, IS_GLOBAL_REQUEST } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // ||request.url.includes('/user/create')

    if (request.url.includes('/login') || request.url.includes('/google-login')) {
      console.log('Skipping interceptor for login request');
      return next.handle(request);
    }
    const token = sessionStorage.getItem('token');


    if (token) {
      const clonedRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(clonedRequest);
    }

    return next.handle(request);
  }
}
