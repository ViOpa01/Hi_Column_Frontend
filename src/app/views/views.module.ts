import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastModule } from 'ng-uikit-pro-standard';


import { CalendarModule } from 'angular-calendar';
import { SharedModule } from '../shared/shared.module';

import { FooterComponent } from '../main-layout/footer/footer.component';
import { LoginComponent } from './auth/login/login.component';
import { StatsCardComponent } from './dashboards/common/stats-card/stats-card.component';

import { DashboardComponent } from './dashboards/dashboard/dashboard.component';
import { PerformanceRecordsTableComponent } from './tables/performance-records-table/performance-records-table.component';
// import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TransactionTimeChartComponent } from './dashboards/charts/transaction-time-chart/transaction-time-chart.component';
import { TransactionHistoryTableModule } from './tables/transaction-history-table/transaction-history-table.module';
import { TerminalPerformanceModule } from './tables/terminal-performance/terminal-performance.module';
// import { PaginationComponent } from './pagination/pagination.component';
import { PaginationModule2 } from './pagination/pagination.module';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    PaginationModule2,
    TerminalPerformanceModule,
    SharedModule,
    ToastModule.forRoot(),
    CalendarModule.forRoot(),
    ModalModule.forRoot(),
  ],
  declarations: [
    FooterComponent,
    LoginComponent,
    StatsCardComponent,
    DashboardComponent,
    TransactionTimeChartComponent,
    PerformanceRecordsTableComponent,
    // PaginationComponent,
    ],
  exports: [
    FooterComponent,
    StatsCardComponent,
    
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class ViewsModule {

}
