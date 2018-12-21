import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../services/http.service';
import { User, Task, ModalTask} from '../interfaces';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  tasks: Task[] = [];
  user: User = {
    userName: localStorage.getItem('userName') || null
  };

  modalData: ModalTask = {
    taskData: null,
    isOpen: false
  };

  constructor(private http: HttpService, private router: Router) { }

  ngOnInit() {
    this.getTasks();
  }

  getTasks() {
    this.http.get('api/tasks').subscribe(data => {
      this.tasks = data;
    });
  }

  logout() {
    localStorage.removeItem('jwtToken');
    this.router.navigate(['login']);
  }

  closeModal() {
    this.modalData.isOpen = false;
    this.modalData.taskData = null;
  }

  openTaskModal(task: Task = {}) {
    this.modalData.taskData = task;
    this.modalData.isOpen = true;
  }

  removeTask(taskId: string) {
    if (confirm('Are you sure to delete this task?')) {
      this.http.delete(`api/tasks/${taskId}`).subscribe(data => {
        this.getTasks();
      });
    }
  }

}
