import { Component, OnInit, Input } from '@angular/core';
import { PayVueApiService } from 'app/providers/payvue-api.service';
import { formatDate } from '@angular/common';
import eventsService from 'app/providers/events.service';

@Component({
  selector: 'app-merchants',
  templateUrl: './merchants.component.html',
  styleUrls: ['./merchants.component.scss']
})

export class MerchantsComponent implements OnInit {
  @Input() shadows = false; 
  show: boolean = false;
  new: boolean = false;
  rotate = false;
  isData: boolean;
  merchantRecords: any[] = [];
  merchantDetails: any;
  private sorted = false;
  search: string = '';
  name: string;
  total: number;
  merchant: string;
  
  itemCount: number;
  limit = 50;
  page = 1;
  serial: number;
  
  date: string;
  sort = 'transdate';
  dir = 'desc';
  from: string;
  to: string;
  maxSize = 10;

  pid: any;
  
  
  // currentPage: number = 1;

  constructor(private payvueservice: PayVueApiService) {
   }

  ngOnInit() {
    this.getMerchants();
    this.getMerchantCount();

    this.date = formatDate(new Date(), 'yyyy-MM-dd', 'en');

    eventsService.getEvent('Merchants').subscribe(page => {
      this.page = page;
      this.getMerchants();
    })
  }
 
  setPage(pageNo: number): void {
    this.page = pageNo;
  }

  getMerchantCount() {
    this.itemCount = NaN;
    const apiURL = `merchants/count?search=${this.search}`;
    this.payvueservice.apiCall(apiURL).then(data => {
     this.itemCount = data.data.itemCount;
    })
  }
  getMerchants() {
    this.merchantRecords = [];
    this.total = undefined;
    this.isData = undefined;
    const apiURL = `merchants?page=${this.page}&limit=${this.limit}&search=${this.search}`;
    this.payvueservice.apiCall(apiURL).then(data => {
      if (data.status === 200) {
        if (data.data.length > 0) {
          // this.itemCount = data.itemCount;
          this.total = data.itemCount;
          this.serial = 1 + (this.page - 1) * this.limit;
          this.merchantRecords = data.data;
          this.isData = true;
        } else {
          this.isData = false;
          // this.itemCount = 0;
        }
      } else {
        this.isData = false;
        // this.itemCount = 0;
      }
    }).catch(error => {
      console.error(error);
      this.isData = false;
      // this.itemCount = 0;
    });
  }

  pageChanged(event: any): void {
    this.page = event.page;
    this.getMerchants();
  }

  setLimit(event: any) {
    this.limit = event.target.value;
  }

  setSort(event: any) {
    this.sort = event.target.value;
  }

  setDir(event: any) {
    this.dir = event.target.value;
  }

  sortBy(by: string | any): void {

    this.merchantRecords.sort((a: any, b: any) => {
      if (a[by] < b[by]) {
        return this.sorted ? 1 : -1;
      }
      if (a[by] > b[by]) {
        return this.sorted ? -1 : 1;
      }

      return 0;
    });

    this.sorted = !this.sorted;
  }

  details(row?: any) {
    if(row) {
      this.merchant = row.merchant_id;
      this.merchantDetails = row;
    }
   
    this.show = !this.show;
  }

}
