import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IS_APPLY_JOB_REQUEST, IS_GLOBAL_REQUEST } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {
  defaultTenant = '00000';

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (req.context.get(IS_GLOBAL_REQUEST)) {
      req = req.clone({
        setHeaders: {
          tenant: this.defaultTenant
        },
      });
    } else if (req.context.get(IS_APPLY_JOB_REQUEST)) {
      // do nothing
    }
    else {
      const username: any = localStorage.getItem('userName');
      let tenant: any = localStorage.getItem('tenant');
      req = req.clone({
        setHeaders: {
          username: username ? username : '',
          tenant: tenant
        },
      });
    }

    return next.handle(req);
  }
}
