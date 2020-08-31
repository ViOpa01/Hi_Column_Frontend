import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MDBBootstrapModule, ModalModule } from 'ng-uikit-pro-standard';
import { SharedModule } from 'app/shared/shared.module';
import { CalendarModule } from 'angular-calendar';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SettingsComponent } from './settings.component';
import { AuthGuard } from 'app/shared/guards/authGuard';
import { RoleGuard } from 'app/shared/guards/roleGuard';


const routes: Routes = [ {path: '', component: SettingsComponent, canActivate:[AuthGuard, RoleGuard], data: {
    allowedRoles: ['super','admin']
  } },]

@NgModule({
    imports: [RouterModule.forChild(routes), 
        CommonModule, 
        FormsModule,
        ReactiveFormsModule, 
        MDBBootstrapModule,
        SharedModule,
        CalendarModule.forRoot(),
        PaginationModule.forRoot(),
        ModalModule.forRoot(),],
    exports: [],
    declarations: [SettingsComponent],
    schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
})
export class SettingsModule { }