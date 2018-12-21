import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-admin-errors',
  template: ''
})
export class ErrorsComponent {

  public error = '';

  constructor() { }

  setErrors(error: HttpErrorResponse, form: any = {}): void {

    if (error.status === 500 || error.status === 400 || error.status === 404) {
      this.error = error.error.msg;
      return;
    } else if (error.status === 401) {
      location.href = '/login';
    } else {
      this.error = 'Internal Server Error.';
    }
  }

}
