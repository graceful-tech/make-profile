import { HttpClient, HttpContext, HttpContextToken, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';



export const IS_GLOBAL_REQUEST = new HttpContextToken<boolean>(() => false);
export const IS_APPLY_JOB_REQUEST = new HttpContextToken<boolean>(() => false);

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  public get(route: String) {
    return this.http.get(this.createCompleteRoute(route), this.generateHeaders());
  }

  public retrieve(route: String, body: any): Observable<any> {
    return this.http.post(this.createCompleteRoute(route), body, this.generateHeaders());
  }

  public create(route: String, body: any): Observable<any> {
    return this.http.post(this.createCompleteRoute(route), body, this.generateHeaders());
  }

  public update(route: String, body: any): Observable<any> {
    return this.http.put(this.createCompleteRoute(route), body, this.generateHeaders());
  }

  public delete(route: String) {
    return this.http.delete(this.createCompleteRoute(route), this.generateHeaders());
  }

  public post(route: String, body: any): Observable<any> {
    return this.http.post(this.createCompleteRoute(route), body, this.generateHeaders());
  }


  public download(route: String): Observable<any> {
    return this.http.get(this.createCompleteRoute(route), { responseType: 'blob', reportProgress: true });
  }

  public downloadResume(route: String, body: any): Observable<any> {
    return this.http.post(this.createCompleteRoute(route), body, { responseType: 'blob', reportProgress: true });
  }

  public downloadFile(route: String, body: any): Observable<any> {
    return this.http.post(this.createCompleteRoute(route), body, { responseType: 'blob', reportProgress: true });
  }

  public export(route: String, body: any): Observable<any> {
    return this.http.post(this.createCompleteRoute(route), body, { responseType: 'blob', reportProgress: true });
  }

  public upload(route: String, body: any): Observable<any> {
    return this.http.post(this.createCompleteRoute(route), body);
  }

  public send(route: String, body: any): Observable<any> {
    return this.http.post(this.createCompleteRoute(route), body);
  }

  public getFromHurecom(route: String) {
    return this.http.get(this.createCompleteRoute(route), this.setGlobalRequestContext());
  }

  public retrieveFromHurecom(route: String, body: any) {
    return this.http.post(this.createCompleteRoute(route), body, this.setGlobalRequestContext());
  }

  public apply(route: String, body: any, username: string, tenant: string) {
    return this.http.post(this.createCompleteRoute(route), body, this.setApplyJobRequestContext(username, tenant));
  }

  private createCompleteRoute(route: String) {
    const restUrl = environment.restUrl;
    return `${restUrl}/${route}`;
  }

  private generateHeaders() {
    return {
      headers: new HttpHeaders({ 'content-type': 'application/json' })
    };
  }

  private setGlobalRequestContext() {
    return {
      context: new HttpContext().set(IS_GLOBAL_REQUEST, true)
    };
  }

  private setApplyJobRequestContext(username: string, tenant: string) {
    return {
      context: new HttpContext().set(IS_APPLY_JOB_REQUEST, true),
      headers: new HttpHeaders({ 'username': username, 'tenant': tenant })
    };
  }
}
