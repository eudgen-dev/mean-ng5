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
      this.error = error.error;
      return;
    } else if (error.status === 422) {
      if (error.error.errors.length) {
        error.error.errors.forEach((e: any) => {
          form.controls[e.field].setErrors({backendError: e.error});
        });
      }

      if (error.error.global) {
        this.error = error.error.global;
      }

    } else if (error.status === 401) {
      location.href = '/login';
    } else {
      this.error = 'Internal Server Error.';
    }
  }

}
