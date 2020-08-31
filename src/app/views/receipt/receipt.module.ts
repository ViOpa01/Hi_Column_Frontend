import { NgModule } from '@angular/core';
import { BrowserModule  } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { PurchaseComponent } from '../receipt/purchase/purchase.component';
import { PostpaidComponent } from '../receipt/postpaid/postpaid.component';
import { TokenComponent } from '../receipt/token/token.component';
import { SmallComponent } from '../receipt/small/small.component';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [
        CommonModule,
    ],
    exports: [PurchaseComponent,PostpaidComponent,TokenComponent,SmallComponent],
    declarations: [PurchaseComponent,PostpaidComponent,TokenComponent,SmallComponent]
})
export class receiptModule { }
