import { Component, OnInit, Input } from '@angular/core';
import { PayVueApiService } from 'app/providers/payvue-api.service';
import { ToastService } from 'ng-uikit-pro-standard';
import  BankNameModel  from 'app/Models/bank-name.model';


@Component({
  selector: 'app-merchant-account',
  templateUrl: './merchant-account.component.html',
  styleUrls: ['./merchant-account.component.scss']
})
export class MerchantAccountComponent implements OnInit {
  @Input() shadows = false;
  merchant: string;
  frequency: number;
  details: any;
  isData: boolean;
  terminals: any[] = [];
  isSaving: boolean;
  nameData = BankNameModel;  
  bank: string;

  merchantU: boolean;
  user: boolean;
  admin: boolean;
  super: boolean;
  constructor(private payvueservice: PayVueApiService, private toast: ToastService) {
    const userStr = localStorage.getItem('user');

    const u = JSON.parse(userStr);
    this.merchant = u.merchant_id;

    if (u && u.role.toLowerCase() == 'merchant') {

      this.merchantU = false;
    } else if (u && u.role.toLowerCase() == '') {

      this.user = true;
    } else if (u && u.role.toLowerCase() == 'admin') {

      this.admin = true;
    } else if (u && u.role.toLowerCase() == 'super') {

      this.super = true;
    }
   }

  ngOnInit() {
    this.getMerchant();
  }

  getMerchant() {
    this.details = [];    
    this.isData = undefined;
    const apiURL = `merchants/view/${this.merchant}`;
    this.payvueservice.apiCall(apiURL).then(data => {

      if(!this.isEmpty(data.data)) {
        this.details = data.data;
        this.terminals = this.details.terminals || []
        if(this.terminals[0])this.bank = this.nameData[this.terminals[0].substring(0,4)]
        this.frequency = this.details.settlement_count
        this.isData = true
      }
      else {
        this.isData = false;
      }       
    }).catch(error => {
      console.error(error);
      this.isData = false;
    });
  }

  isEmpty(myObject) {
    for (const key in myObject) {
      if (myObject.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  }
}

