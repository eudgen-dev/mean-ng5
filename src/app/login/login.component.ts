import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { HttpService } from '../services/http.service';
import { User } from '../interfaces';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public login: FormGroup;
  public message = '';

  constructor(
    private http: HttpService,
    private router: Router,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.login = this.fb.group({
      login: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  doLogin() {
    const sendData: any = this.login.value;
    this.http.post('api/signin', sendData).subscribe((resp: User) => {
      localStorage.setItem('jwtToken', resp.token);
      localStorage.setItem('userName', resp.userName);
      this.router.navigate(['tasks']);
    }, err => {
      this.message = err.error.msg;
    });

  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
  }

}
