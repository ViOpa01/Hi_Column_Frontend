import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'app/shared/guards/authGuard';
import { RoleGuard } from 'app/shared/guards/roleGuard';
import { TransactionsComponent } from './transactions/transactions.component';
import { SummaryComponent } from './summary/summary.component';
import { SameDayComponent } from './same-day/same-day.component';
import { ReconciliationComponent } from './reconciliation/reconciliation.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MDBBootstrapModule, ModalModule } from 'ng-uikit-pro-standard';
import { SharedModule } from 'app/shared/shared.module';
import { CalendarModule } from 'angular-calendar';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SettlementComponent } from './settlement/settlement.component';
import { TerminalReportComponent } from './terminal-report/terminal-report.component';
import { ReconciliationSummaryComponent } from './reconciliation-summary/reconciliation-summary.component';
import { SettlementReconciliationComponent } from './settlement-reconciliation/settlement-reconciliation.component';
import { ReconciliationMerchantComponent } from './reconciliation-merchant/reconciliation-merchant.component';
import { MerchantSettlementComponent } from './merchant-settlement/merchant-settlement.component';
import { UploadfileComponent } from './uploadfile/uploadfile.component';
import { UploadsComponent } from './uploads/uploads.component';
import { PaginationModule2 } from '../pagination/pagination.module';
import { MerchantTransactionsComponent } from './merchant-transactions/merchant-transactions.component';
import { TransactionHistoryTableModule } from '../tables/transaction-history-table/transaction-history-table.module';
import { ReconciliationSummaryDuoComponent } from './reconciliation-summary-duo/reconciliation-summary-duo.component';
import { ReconciliationSummaryVasComponent } from './reconciliation-summary-vas/reconciliation-summary-vas.component';
import { ReconciliationVasComponent } from './reconciliation-vas/reconciliation-vas.component';
import { SettlementReconciliationVasComponent } from './settlement-reconciliation-vas/settlement-reconciliation-vas.component';

const routes: Routes = [{
    path: '', children:
      [
        // { path: 'uploads', component:  UploadsComponent, canActivate: [AuthGuard, RoleGuard], data: {
        //   allowedRoles: ['admin', 'super','']
        // }},
        { path: 'uploads', component:  UploadfileComponent, canActivate: [AuthGuard, RoleGuard], data: {
          allowedRoles: ['admin', 'super','']
        }},
        { path: 'same-day', component: SameDayComponent,  canActivate: [AuthGuard,  RoleGuard], data: {
          allowedRoles: ['admin', 'super', '']
        }},
        { path: 'settlement-expectations', component: MerchantTransactionsComponent,  canActivate: [AuthGuard,  RoleGuard], data: {
          allowedRoles: ['merchant']
        }},
        { path: 'settlement-reconciliation', component: SettlementReconciliationComponent,  canActivate: [AuthGuard,  RoleGuard], data: {
          allowedRoles: ['admin', 'super', '', 'merchant']
        }},
        // Only to be used for Itex
        // { path: 'settlement-reconciliation-vas', component: SettlementReconciliationVasComponent,  canActivate: [AuthGuard,  RoleGuard], data: {
        //   allowedRoles: ['admin', 'super', '']
        // }},
        { path: '', component: SettlementComponent,  canActivate: [AuthGuard,  RoleGuard], data: {
          allowedRoles: ['admin', 'super','', 'merchant']
        }}
      ]
  },]

@NgModule({
    imports: [RouterModule.forChild(routes),
        CommonModule, 
        FormsModule,
        ReactiveFormsModule, 
        MDBBootstrapModule,
        SharedModule,
        TransactionHistoryTableModule,
        PaginationModule2,
        CalendarModule.forRoot(),
        PaginationModule.forRoot(),
        ModalModule.forRoot(),],
    exports: [],
    declarations: [TransactionsComponent, SummaryComponent, SameDayComponent, ReconciliationComponent, SettlementComponent, TerminalReportComponent, ReconciliationSummaryComponent, SettlementReconciliationComponent, UploadfileComponent, ReconciliationMerchantComponent, MerchantSettlementComponent, UploadsComponent, MerchantTransactionsComponent, ReconciliationSummaryDuoComponent, ReconciliationSummaryVasComponent, ReconciliationVasComponent, SettlementReconciliationVasComponent],
    schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
})
export class SettlementsModule { }