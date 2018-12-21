import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';
import {environment} from '../../environments/environment';

@Injectable()
export class HttpService {

  private baseUrl: string = environment.base_url;

  constructor(private http: HttpClient) {

  }

  get(endpoint: string): Observable<any> {
    console.log(this.baseUrl);
    const headers = this.getHeaders();
    return this.http.get(this.baseUrl + endpoint, {headers});
  }

  post(endpoint: string, body: any) {
    const headers = this.getHeaders();
    return this.http.post(this.baseUrl + endpoint, body, {headers});
  }

  delete(endpoint: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete(this.baseUrl + endpoint, {headers});
  }

  update(endpoint: string, body: any) {
    const headers = this.getHeaders();
    return this.http.put(this.baseUrl + endpoint, body, {headers});
  }


  getHeaders() {
    let headers;
    let token = '';
    if (localStorage.getItem('jwtToken')) {
      token = localStorage.getItem('jwtToken');
    }

    if (token) {
      headers = new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('authorization', token);
    } else {
      headers = new HttpHeaders()
        .set('Content-Type', 'application/json');
    }

    return headers;
  }

}
