import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { TasksComponent } from './tasks/tasks.component';
import { LoginComponent } from './login/login.component';

import { HttpService } from './services/http.service';
import { AuthGuard } from './auth.guard';

const appRoutes: Routes = [
    {
        path: 'tasks',
        component: TasksComponent,
        data: { title: 'Tasks List' },
        canActivate: [AuthGuard]
    },
    {
        path: 'login',
        component: LoginComponent,
        data: { title: 'Login' }
    },
    { path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    }
];

@NgModule({
    declarations: [
        AppComponent,
        TasksComponent,
        LoginComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterModule.forRoot(
            appRoutes,
            { enableTracing: false } // <-- debugging purposes only
        )
    ],
    providers: [AuthGuard, HttpService],
    bootstrap: [AppComponent]
})
export class AppModule { }
