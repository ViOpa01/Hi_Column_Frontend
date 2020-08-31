import { MDBBootstrapModulesPro } from 'ng-uikit-pro-standard';
import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertComponent } from './alerts/alert/alert.component';
@NgModule({
  imports: [
    CommonModule,
    MDBBootstrapModulesPro.forRoot(),
  ],
  declarations: [
    AlertComponent,
  ],
  exports: [
    MDBBootstrapModulesPro,
  ],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }
