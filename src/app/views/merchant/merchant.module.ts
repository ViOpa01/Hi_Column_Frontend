import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MerchantsComponent } from './merchants/merchants.component';
import { AuthGuard } from 'app/shared/guards/authGuard';
import { RoleGuard } from 'app/shared/guards/roleGuard';
import { DetailsComponent } from './details/details.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MDBBootstrapModule, ModalModule } from 'ng-uikit-pro-standard';
import { SharedModule } from 'app/shared/shared.module';
import { CalendarModule } from 'angular-calendar';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TransactionHistoryTableModule } from '../tables/transaction-history-table/transaction-history-table.module';
import { TerminalStatModule } from '../tables/terminal-stat/terminal-stat-module';
import { TerminalPerformanceModule } from '../tables/terminal-performance/terminal-performance.module';
import { PaginationModule2 } from '../pagination/pagination.module';

const routes: Routes = [{
  path: '', children:
    [
      {
        path: '', component: MerchantsComponent, canActivate: [AuthGuard, RoleGuard], data: {
          allowedRoles: ['super', 'admin', '']
        }
      },
      {
        path: ':merchant_id', component: DetailsComponent, canActivate: [AuthGuard, RoleGuard], data: {
          allowedRoles: ['super', 'admin', '']
        }
      }
      
    ]
}]

@NgModule({
    imports: [RouterModule.forChild(routes), 
        CommonModule, 
        FormsModule,
        ReactiveFormsModule, 
        MDBBootstrapModule, 
        TransactionHistoryTableModule,
        TerminalPerformanceModule,
        TerminalStatModule,
        SharedModule,
        PaginationModule2,
        CalendarModule.forRoot(),
        PaginationModule.forRoot(),
        ModalModule.forRoot(),],
    exports: [],
    declarations: [MerchantsComponent,DetailsComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class MerchantModule { }