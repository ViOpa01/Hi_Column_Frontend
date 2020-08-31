
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TransactionHistoryTableComponent } from './transaction-history-table.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MDBBootstrapModule, ModalModule } from 'ng-uikit-pro-standard';
import { SharedModule } from 'app/shared/shared.module';
import { CalendarModule } from 'angular-calendar';
import { PaginationModule2 } from 'app/views/pagination/pagination.module';
import { receiptModule } from 'app/views/receipt/receipt.module';
// import { PaginationModule } from 'ngx-bootstrap/pagination';

@NgModule({
    imports: [RouterModule,
        CommonModule, 
        FormsModule,
        ReactiveFormsModule, 
        MDBBootstrapModule, 
        SharedModule,
        receiptModule,
        CalendarModule.forRoot(),
        PaginationModule2,
        ModalModule.forRoot(),],
    exports: [TransactionHistoryTableComponent],
    declarations: [TransactionHistoryTableComponent],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class TransactionHistoryTableModule { }
