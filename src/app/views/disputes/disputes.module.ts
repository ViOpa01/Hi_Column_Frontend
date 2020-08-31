import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DisputeComponent } from './dispute/dispute.component';
import { AuthGuard } from 'app/shared/guards/authGuard';
import { RoleGuard } from 'app/shared/guards/roleGuard';
import { MerchantDisputeComponent } from './merchant/merchantdispute.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MDBBootstrapModule, ModalModule } from 'ng-uikit-pro-standard';
import { SharedModule } from 'app/shared/shared.module';
import { CalendarModule } from 'angular-calendar';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import {PaginationModule2} from 'app/views/pagination/pagination.module'
import { MessageComponent } from '../message/message.component';
import { receiptModule } from '../receipt/receipt.module';

const routes: Routes = [ {
    path: '', children:
    [
      { path: '', component: DisputeComponent, canActivate: [AuthGuard, RoleGuard], data: {
        allowedRoles: ['super','admin', '']
      },
      },
      {
        path: 'merchant', component: MerchantDisputeComponent,  canActivate: [AuthGuard, RoleGuard], data: {
         allowedRoles: ['merchant']
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
        receiptModule,
        PaginationModule2,
        CalendarModule.forRoot(),
        PaginationModule.forRoot(),
        ModalModule.forRoot(),],
    exports: [],
    declarations: [DisputeComponent, MerchantDisputeComponent, MessageComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class DisputesModule { }