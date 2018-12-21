import { Component, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { HttpService } from '../../services/http.service';
import { ErrorsComponent } from '../../errors.component';
import {HttpErrorResponse} from '@angular/common/http';
import { Task } from '../../interfaces';

@Component({
  selector: 'app-modal-task',
  templateUrl: './modal.task.component.html',
  styleUrls: ['./modal.task.component.css']
})
export class ModalTaskComponent extends ErrorsComponent {

  public _isOpen = false;
  public _taskData: Task = {};

  @Output() onSuccess: EventEmitter<any> = new EventEmitter();
  @Output() onClose: EventEmitter<any> = new EventEmitter();

  @Input()
  set isOpen(isOpen: boolean) {
    this.error = "";
    this._isOpen = isOpen;
  }

  @Input()
  set taskData(taskData: Task) {
    this._taskData = taskData;
    if (this._taskData) {
      this.initForm();
    }
  }

  public task: FormGroup;

  constructor(
    private http: HttpService,
    private fb: FormBuilder
  ) {
    super();
  }

  ngOnInit(): void {
    this.initForm();
  }

  closeModal(): void {
    this.onClose.emit();
    this._isOpen = false;
  }

  initForm(): void {
    let formatedDate = '';
    if (this._taskData && this._taskData._id) {
      const date = new Date(this._taskData.dueOn);
      const month = date.getMonth() + 1 < 10 ? `0${(date.getMonth() + 1)}` : date.getMonth() + 1;
      const day = date.getDate() < 10 ? `0${(date.getDate())}` : date.getDate();
      formatedDate = `${date.getFullYear()}-${month}-${day}`;
    }

    this.task = this.fb.group({
      title: [this._taskData ? this._taskData.title : '', Validators.required],
      dueOn: [formatedDate, Validators.required]
    });
  }

  submit(): void {

    const body: Task = {
      title: this.task.value.title,
      dueOn: this.task.value.dueOn
    };

    if (!this._taskData || !this._taskData._id) {
      this.http.post(`api/tasks`, body).subscribe((resp: any) => {
        this.task.controls['title'].setValue('');
        this.task.controls['dueOn'].setValue('');
        this.onSuccess.emit();
        this.onClose.emit();
      }, (error: HttpErrorResponse) => {
        this.setErrors(error);
      });
    }else {
      this.http.update(`api/tasks/${this._taskData._id}`, body).subscribe((resp: any) => {
        this.task.controls['title'].setValue('');
        this.task.controls['dueOn'].setValue('');
        this.onSuccess.emit();
        this.onClose.emit();
      }, (error: HttpErrorResponse) => {
        this.setErrors(error);
      });
    }

  }
}
