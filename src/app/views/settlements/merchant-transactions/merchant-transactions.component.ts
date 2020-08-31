import { Component, OnInit, Input } from '@angular/core';
import { PayVueApiService } from 'app/providers/payvue-api.service'
import { formatDate } from '@angular/common';
import { ToastService } from 'ng-uikit-pro-standard';
import { EXCEL_EXPORT } from "app/providers/excel-export-script";
import * as filesaver from 'file-saver';
import { WebworkerService } from 'app/providers/webworker.service';
import { SocketService } from 'app/providers/socket.service';
import eventsService from 'app/providers/events.service';

@Component({
  selector: 'app-merchant-transactions',
  templateUrl: './merchant-transactions.component.html',
  styleUrls: ['./merchant-transactions.component.scss']
})
export class MerchantTransactionsComponent implements OnInit {
  @Input() shadows = false;
  rotate = false;
  isData: boolean;
  isDataR: boolean = false;
  merchantTrans: any[] = [];
  details: any[] = [];
  private sorted = false;
  name: string;
  id: any;

  search: string = '';
  status: string = '';

  years: any[] = [];
  year = formatDate(new Date(), 'yyyy', 'en');

  months: any[] = [];
  month = formatDate(new Date(), 'MM', 'en');
  
  itemCount: number;
  itemCountR: number;
  limit = 50;
  limitR = 50;
  page = 1;
  pageR = 1;
  serial: number;
  serialR: number;
  
  date: string;
  date2: string = "";
  sort = 'transdate';
  dir = 'desc';
  from: string = "";
  to: string = "";
  maxSize = 10;

  pid: any;
  
  processor: string;
   
  merchname: string;
  merchaccno: number;
  merchant: string;
  terminal: string;
  pan: string;
  stan: number;
  amount: number;
  settlement: number;
  charge: number;

  type: string = "daily";
  week: boolean = false;
  day: boolean = true;

  private EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  private EXCEL_EXTENSION = 'xlsx';
  
  // currentPage: number = 1;

  constructor( private payvueservice: PayVueApiService, private toast: ToastService, private webWorkerService: WebworkerService) {
   }

  ngOnInit() {
    
    // this.date = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.from = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.getMerchantTrans();
    this.setYears();

    eventsService.getEvent('MerchantTransPage').subscribe(page => {
      this.page = page;
      this.getMerchantTrans();;
    })
  }

  setYears() {
   
    let thisYear = new Date().getFullYear()

    for(let i = 0; i < 5; i++){
      this.years.push((thisYear - i).toString());
    }
    this.setMonths();
  }

  setMonths() {
   
    for(let i = 0; i < 12; i++){
      if((i+1) < 10) {
        this.months.push('0'+(i + 1).toString());
      }
      else {
        this.months.push((i + 1).toString());
      }
    }
  }

  setType(type) {
    if (type == 'day') {
      this.day = true;
      this.week = false;
      this.type = 'daily';
    }
    else if (type == 'week') {
      this.day = false;
      this.week = true;
      this.type = 'weekly';
    }

    this.getMerchantTrans();
    this.setPage(1);
  }
 
  setPage(page: number): void {
    switch(page) {
      case 1: 
        this.page = 1;
        break;
      case 2: 
        this.pageR = 1;
        break;
      default:
      break;
    }
  }

  public exportExcel(array: string) {
    let exportData = [];

    switch (array) {
      case 'MerchantTrans':
      this.merchantTrans.map(item => {
        exportData.push({...item});
        return item;
      })

      exportData = exportData.map(item => {
        // item.transaction_ref = item.transaction_ref.join(' ');
        item.date = formatDate(item.date, 'yyyy-MM-dd', 'en');
        return item;
      });
        break;
      default:
        break;
    }
    
    const input = {
      config: {
        body: exportData
      },
      host: window.location.host,
      path: window.location.pathname,
      protocol: window.location.protocol
    };

    this.webWorkerService.run(EXCEL_EXPORT, input).then(
      (result) => {
        this.save(result, 'export', this.EXCEL_TYPE, this.EXCEL_EXTENSION);
      }
    ).catch(console.error);
  }

  private save(file, filename, filetype, fileextension) {
    const blob = new Blob([this.s2ab(file)], {
      type: filetype
    });
    const today = new Date();
    const date = today.getFullYear() + '' + (today.getMonth() + 1) + '' + today.getDate() + '_';
    const time = today.getHours() + '-' + today.getMinutes() + '-' + today.getSeconds();
    const name = `${filename}${date}${time}.${fileextension}`;

    filesaver.saveAs(blob, name);
  }

  private s2ab(text: string): ArrayBuffer {
    const buf = new ArrayBuffer(text.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i != text.length; ++i) {
      view[i] = text.charCodeAt(i) & 0xFF;
    }
    return buf;
  }

  getMerchantTrans() {
    this.merchantTrans = [];
    this.isData = undefined;
    let apiURL = ''
    if(this.type == 'weekly' ) {
      apiURL = `merchants/transaction-summary?date=${this.year}-${this.month}-01&type=${this.type}&page=${this.page}`;
    }
    else {
      apiURL = `merchants/transaction-summary?date=${this.from}&type=${this.type}&page=${this.page}`;
    }
    this.payvueservice.apiCall(apiURL).then(data => {
        if (data.data.length > 0) {
          this.itemCount = data.itemCount;
          if(this.type == 'weekly' ) {
            this.serial = 1 + (this.page - 1) * 7;
          }
          else {
            this.serial = 1
          }
          this.merchantTrans = data.data;
          this.isData = true;
        } else {
          this.itemCount = 1;
          this.isData = false;
        }
    }).catch(error => {
      console.error(error);
         
          this.itemCount = 1;
          this.isData = false;
    });
  }

  // getDetails(id) {
  //   this.details = [];
  //   this.isDataR = undefined;
  //   const apiURL = `settlements/same-day/${id}?page=${this.pageR}&limit=${this.limitR}&status=${this.status}&search=${this.search}`;
  //   this.payvueservice.apiCall(apiURL).then(data => {
  //     if (data.data.length > 0) {
  //       this.itemCountR = data.itemCount;
  //       this.serialR = 1 + (this.pageR - 1) * this.limitR;
  //       this.details = data.data;
  //       this.isDataR = true;
  //     } else {
  //         this.itemCountR = 1;
  //         this.isDataR = false;
  //     }
  // }).catch(error => {
  //   console.error(error);
       
  //         this.itemCountR = 1;
  //         this.isDataR = false;
  // });
    
  // }

  pageChanged(event: any): void {
    this.page = event.page;
    this.getMerchantTrans();
  }


  setLimit(event: any) {
    this.limit = event.target.value;
  }

  setLimit2(event: any) {
    this.limitR = event.target.value;
  }

  setSort(event: any) {
    this.sort = event.target.value;
  }

  setProcessor(event: any) {
    this.processor = event.target.value;
  }

  setDir(event: any) {
    this.dir = event.target.value;
  }

  sortBy(by: string | any, array): void {
    let sortingArray = []
    switch (array) {
      case 'MerchantTrans':
        sortingArray = this.merchantTrans;
        break;
      default:
        break;
    }
    sortingArray.sort((a: any, b: any) => {
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

}
