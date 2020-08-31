import { Component, OnInit } from '@angular/core';
import { PayVueApiService } from 'app/providers/payvue-api.service';

@Component({
  selector: 'app-settlement',
  templateUrl: './settlement.component.html',
  styleUrls: ['./settlement.component.scss']
})
export class SettlementComponent implements OnInit {
  merchant: boolean
  constructor(private payvueservice: PayVueApiService) {
    let user = payvueservice.getUser();
    // this.merchant = user..role.merchantcode

    if (user && user.roletoLowerCase() == 'merchant') {

      this.merchant = true;
    } else {

      this.merchant = false;
    }
   }

  ngOnInit() {
  }

}
