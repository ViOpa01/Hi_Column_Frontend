import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../shared/guards/authGuard';
import { RoleGuard } from '../../shared/guards/roleGuard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MDBBootstrapModule, ModalModule } from 'ng-uikit-pro-standard';
import { SharedModule } from '../../shared/shared.module';
import { CalendarModule } from 'angular-calendar';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { CommonModule } from '@angular/common';
import { TerminalInventoryModule } from '../terminal-inventory/terminal-inventory.module';
import { InventoryComponent } from './inventory.component';

const routes: Routes = [{
    path: '', children:
      [
        {
            path: '', component: InventoryComponent, canActivate: [AuthGuard, RoleGuard], data: {
              allowedRoles: ['super', 'admin', '']
            }
          }
      ]
  },]

@NgModule({
    imports: [RouterModule.forChild(routes), 
        CommonModule, 
        FormsModule,
        ReactiveFormsModule, 
        MDBBootstrapModule,
        TerminalInventoryModule,
        SharedModule,
        CalendarModule.forRoot(),
        PaginationModule.forRoot(),
        ModalModule.forRoot(),],
    exports: [],
    declarations: [InventoryComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class InventoryModule { }