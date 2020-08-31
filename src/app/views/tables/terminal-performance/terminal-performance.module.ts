
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MDBBootstrapModule, ModalModule } from 'ng-uikit-pro-standard';
import { SharedModule } from 'app/shared/shared.module';
import { CalendarModule } from 'angular-calendar';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TerminalPerformanceComponent } from './terminal-performance.component';
import { PaginationModule2 } from 'app/views/pagination/pagination.module';

@NgModule({
    imports: [RouterModule,
        CommonModule, 
        FormsModule,
        ReactiveFormsModule, 
        MDBBootstrapModule, 
        SharedModule,
        PaginationModule2,
        CalendarModule.forRoot(),
        PaginationModule.forRoot(),
        ModalModule.forRoot(),],
    exports: [TerminalPerformanceComponent],
    declarations: [TerminalPerformanceComponent],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class TerminalPerformanceModule { }
