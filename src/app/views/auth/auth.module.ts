import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from 'app/shared/guards/authGuard';
import { RoleGuard } from 'app/shared/guards/roleGuard';
import { ResetComponent } from './reset/reset.component';
import { ResetOutComponent } from './reset-out/reset-out.component';
import { NewPasswordComponent } from './new-password/new-password.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MDBBootstrapModule, ModalModule } from 'ng-uikit-pro-standard';
import { SharedModule } from 'app/shared/shared.module';
import { CalendarModule } from 'angular-calendar';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { UsersComponent } from './users/users.component';
import { ClickOutsideModule } from 'ng-click-outside';
import { PaginationModule2 } from '../../views/pagination/pagination.module';

const routes: Routes = [  {
    path: '', children:
      [
        { path: 'register', component: RegisterComponent, canActivate: [AuthGuard, RoleGuard], data: {
          allowedRoles: ['super']
        } },
        { path: 'reset', component: ResetComponent},
        { path: 'verify', component: ResetOutComponent},
        { path: 'new-password', component: NewPasswordComponent, canActivate: [AuthGuard]},
        { path: 'users', component: UsersComponent, canActivate: [AuthGuard, RoleGuard], data: {
          allowedRoles: ['super']
        } }
      ]
  },]

@NgModule({
    imports: [RouterModule.forChild(routes),
        CommonModule, 
        FormsModule,
        ReactiveFormsModule, 
        MDBBootstrapModule,
        SharedModule,
        ClickOutsideModule,
        PaginationModule2,
        CalendarModule.forRoot(),
        PaginationModule.forRoot(),
        ModalModule.forRoot(),],
    exports: [],
    declarations: [RegisterComponent, ResetComponent, ResetOutComponent, NewPasswordComponent, UsersComponent],
})
export class AuthModule { }