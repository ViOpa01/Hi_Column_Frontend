import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'app/shared/guards/authGuard';
import { RoleGuard } from 'app/shared/guards/roleGuard';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MDBBootstrapModule, ModalModule } from 'ng-uikit-pro-standard';
import { SharedModule } from 'app/shared/shared.module';
import { CalendarModule } from 'angular-calendar';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import {PaginationModule2} from 'app/views/pagination/pagination.module'
import { receiptModule } from '../receipt/receipt.module';
import { TransactionsComponent } from './transactions/transactions.component';
import { SummaryComponent } from './summary/summary.component';

const routes: Routes = [ {
    path: '', children:
    [
      { path: 'history', component: TransactionsComponent, canActivate: [AuthGuard, RoleGuard], data: {
        allowedRoles: ['super','admin', '', 'merchant']
      },
      },
      {
        path: 'summary', component: SummaryComponent,  canActivate: [AuthGuard, RoleGuard], data: {
         allowedRoles: ['super','admin', '', 'merchant']
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
    declarations: [TransactionsComponent, SummaryComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class TransactionsModule { }