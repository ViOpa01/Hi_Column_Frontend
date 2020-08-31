
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MDBBootstrapModule, ModalModule } from 'ng-uikit-pro-standard';
import { SharedModule } from 'app/shared/shared.module';
import { CalendarModule } from 'angular-calendar';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TerminalStatComponent } from './terminal-stat.component';
import { PaginationModule2 } from 'app/views/pagination/pagination.module';
import { NgCircleProgressModule } from 'ng-circle-progress';
import {RoundProgressModule} from 'angular-svg-round-progressbar';
import { AgmCoreModule } from '@agm/core';
import { AgmJsMarkerClustererModule  } from '@agm/js-marker-clusterer';

@NgModule({
    imports: [RouterModule,
        CommonModule, 
        FormsModule,
        ReactiveFormsModule, 
        MDBBootstrapModule, 
        SharedModule,
        PaginationModule2,
        RoundProgressModule,
        NgCircleProgressModule.forRoot(),
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyDT2Lxjxyp77gEusssIpd6FkrTe9bljLc0',
            libraries: ['places']
          }),
        AgmJsMarkerClustererModule,
        CalendarModule.forRoot(),
        PaginationModule.forRoot(),
        ModalModule.forRoot(),],
    exports: [TerminalStatComponent],
    declarations: [TerminalStatComponent],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class TerminalStatModule { }
