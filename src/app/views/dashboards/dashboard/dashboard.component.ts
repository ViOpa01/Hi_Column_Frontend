import { Component, OnInit, Input } from '@angular/core';
import { PayVueApiService } from '../../../providers/payvue-api.service';
import {formatDate} from '@angular/common';
import { SocketService } from 'app/providers/socket.service';

@Component({
  selector: 'mdb-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @Input() shadows = false;
  date: string;
  data: {};
  from: string = "";
  to: string = "";
  isData: boolean;
  totalValue: number;

  merchantU: boolean;
  merchant: string = "";

  constructor(private payvueservice: PayVueApiService, private socket: SocketService) {
    this.socket.on('trans-stat-message').subscribe(data =>{
      if (!data) return
      if(
        ((this.to == this.from) && (this.to == this.date || !this.to)) || 
        ((!this.to || !this.from) && (this.to == this.date || this.from == this.date))
      ) {
        this.data = data;
        this.totalValue = data.total_value
        this.isData = true;
      }
     })

     let user = payvueservice.getUser();
     this.merchant = user.merchantcode
 
     if (user && user.role.toLowerCase()  == 'merchant') {
 
       this.merchantU = true;
     } else {

       this.merchantU = false;
     }
  }

  ngOnInit() {
    this.getTransactionStatus();
    this.date = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.from = this.date;
    this.to = this.date;
  }

 
  getTransactionStatus() {
    this.data = {};
    this.isData = undefined;      
    const apiURL = `transactions/stats/?startdate=${this.from}&enddate=${this.to}`;
      this.payvueservice.apiCall(apiURL)
        .then(data => {
          if (data.status === 200) {
            if (!this.isEmpty(data.data)) {
              this.data = data.data;
              this.totalValue = data.total_value
              this.isData = true;
            } else {
              this.isData = false;
            }
          } else {
            this.isData = false;
            this.totalValue = -1;
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

