import { Component, OnInit } from '@angular/core';
import { PayVueApiService } from 'app/providers/payvue-api.service';

@Component({
  selector: 'app-settlement-reconciliation',
  templateUrl: './settlement-reconciliation.component.html',
  styleUrls: ['./settlement-reconciliation.component.scss']
})
export class SettlementReconciliationComponent implements OnInit {
  merchant: boolean;

  constructor(private payvueservice: PayVueApiService) {
    let user = payvueservice.getUser();
    this.merchant = user.merchantcode

    if (user && user.role.toLowerCase() == 'merchant') {

      this.merchant = true;
    } else {

      this.merchant = false;
    }
   }

  ngOnInit() {
  }

}
