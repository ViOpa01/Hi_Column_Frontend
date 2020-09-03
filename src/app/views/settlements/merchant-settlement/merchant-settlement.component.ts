import { Component, OnInit, Input } from '@angular/core';
import { PayVueApiService } from 'app/providers/payvue-api.service';
import { WebworkerService } from 'app/providers/webworker.service';
import { formatDate } from '@angular/common';
import { EXCEL_EXPORT } from 'app/providers/excel-export-script';
import * as filesaver from 'file-saver';
import { DatePipe } from '@angular/common';
import eventsService from 'app/providers/events.service';

@Component({
  selector: 'app-merchant-settlement',
  templateUrl: './merchant-settlement.component.html',
  styleUrls: ['./merchant-settlement.component.scss']
})
export class MerchantSettlementComponent implements OnInit {

  @Input() shadows = false;
  rotate = false;
  isData: boolean;
  isDataR: boolean = false;

  settlementSummaryRecords: any[] = [];
  settlementRecords: any[] = [];
  private sorted = false;

  detailDay: string = "";
  detailMonth: string = "";
  detailYear: string = "";

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
  search: string;
  
  date: string;
  sort = 'transdate';
  dir = 'desc';
  from: string = '';
  to: string = '';
  maxSize = 10;

  merchantU: boolean;

  pid: any;
  
 status: string;
   
  merchname: string;
  merchaccno: number;
  merchant: string;
  terminal: string;
  pan: string;
  stan: number;
  amount: number;
  settlement: number;
  charge: number;
  isDownload: boolean;

  day: boolean = true;
  week: boolean = false;
  type: string = 'daily';
  

  private EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  private EXCEL_EXTENSION = 'xlsx';

  // currentPage: number = 1;

  constructor( private payvueservice: PayVueApiService, private webWorkerService: WebworkerService) {
    let user = payvueservice.getUser();
    this.merchant = user.merchantcode

    if (user && user.role.toLowerCase() == 'merchant') {

      this.merchantU = true;
    } else {

      this.merchantU = false;
    }
   }

  ngOnInit() {
    // this.date = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.from = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.getSettlementSummary();

    this.setYears();

    eventsService.getEvent('SettlementPage').subscribe(page => {
      this.pageR = page;
      this.getSettlements();
    })

    eventsService.getEvent('SettlementSummaryPage').subscribe(page => {
      this.page = page;
      this.getSettlementSummary();
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
 
  setPage(page: number): void {

    switch (page) {
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

    this.getSettlementSummary();
    this.setPage(1);
  }

  getSettlementSummary() {
    this.settlementSummaryRecords = [];
    this.isData = undefined;
    let apiURL = ''
    if(this.type == 'weekly' ) {
      apiURL = `settlements/merchant-summary?date=${this.year}-${this.month}-01&page=${this.page}&type=${this.type}`;
    }
    else {
      apiURL = `settlements/merchant-summary?date=${this.from}&page=${this.page}&type=${this.type}`;
    }
    this.payvueservice.apiCall(apiURL).then(data => { 
      if (data.status === 200) {
        if (data.data.length > 0) {
          this.itemCount = data.itemCount;
          if(this.type == 'weekly' ) {
            this.serial = 1 + (this.page - 1) * 7;
          }
          else {
            this.serial = 1
          }
          this.settlementSummaryRecords = data.data;
          this.isData = true;
        } else {
          this.itemCount = 1;
          this.isData = false;
        }
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

  setDate(year,month,day) {
    if(month < 10) {
      month = ('0'+ month.toString())
    }
    if(day < 10) {
      day = ('0'+ day.toString())
    }
    this.detailDay = day;
    this.detailMonth = month;
    this.detailYear = year;
  }

  getSettlements() {
    this.settlementRecords = [];
    this.isDataR = undefined;
    const apiURL = `settlements?date=${this.detailYear}-${this.detailMonth}-${this.detailDay}&page=${this.pageR}&limit=${this.limitR}`;
    this.payvueservice.apiCall(apiURL).then(data => {
      if (data.data.length > 0) {
        this.itemCountR = data.itemCount;
        this.serialR = 1 + (this.pageR - 1) * this.limitR;
        this.settlementRecords = data.data;
        this.isDataR = true;
      } else {
          this.itemCountR = 1;
          this.isDataR = false;
      }
  }).catch(error => {
    console.error(error);
       
          this.itemCountR = 1;
          this.isDataR = false;
  });
    
  }

  pageChanged(event: any): void {
    this.page = event.page;
    this.getSettlementSummary();
  }

  pageChanged2(event: any): void {
    this.pageR = event.page;
    this.getSettlements();
  }
  setSort(event: any) {
    this.sort = event.target.value;
  }

  setLimit2(event: any) {
    this.limitR = event.target.value;
  }

  setStatus(event: any) {
    this.status = event.target.value;
  }

  setDir(event: any) {
    this.dir = event.target.value;
  }

  sortBy(by: string | any, array): void {
    let sortingArray = []
    switch (array) {
      case 'settlement':
        sortingArray = this.settlementRecords;
        break;
      case 'settlementSummary':
        sortingArray = this.settlementSummaryRecords;
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

  public exportExcel(array: string) {
    let exportData = [];

    switch (array) {
      case 'settlementSummary':
      this.settlementSummaryRecords.map(item => {
        exportData.push({...item});
        return item;
      })

      exportData = exportData.map(item => {
        // item.transaction_ref = item.transaction_ref.join(' ');
        item.date = formatDate(item.date, 'yyyy-MM-dd', 'en');
        return item;
      });
        break;
      case 'settlement':
      this.settlementRecords.map(item => {
        // item.trans_date = formatDate(item.trans_date, 'yyyy-MM-dd', 'en');
        exportData.push({...item});
        return item;
      })
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

}