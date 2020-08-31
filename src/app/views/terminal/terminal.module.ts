import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'app/shared/guards/authGuard';
import { RoleGuard } from 'app/shared/guards/roleGuard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MDBBootstrapModule, ModalModule } from 'ng-uikit-pro-standard';
import { SharedModule } from 'app/shared/shared.module';
import { CalendarModule } from 'angular-calendar';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TerminalsComponent } from './terminals/terminals.component';
import { CommonModule } from '@angular/common';
import { TerminalStatModule } from '../tables/terminal-stat/terminal-stat-module';

const routes: Routes = [{
    path: '', children:
      [
        { path: '', component: TerminalsComponent, canActivate: [AuthGuard, RoleGuard], data: {
          allowedRoles: ['super','admin', '']
        } }
       
      ]
  },]

@NgModule({
    imports: [RouterModule.forChild(routes), 
        CommonModule, 
        FormsModule,
        ReactiveFormsModule, 
        MDBBootstrapModule,
        TerminalStatModule,
        SharedModule,
        CalendarModule.forRoot(),
        PaginationModule.forRoot(),
        ModalModule.forRoot(),],
    exports: [],
    declarations: [TerminalsComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class TerminalModule { }