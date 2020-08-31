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
  selector: 'app-same-day',
  templateUrl: './same-day.component.html',
  styleUrls: ['./same-day.component.scss']
})
export class SameDayComponent implements OnInit {
  @Input() shadows = false;
  rotate = false;
  isData: boolean;
  isDataR: boolean = false;
  sameDayRecords: any[] = [];
  details: any[] = [];
  private sorted = false;
  name: string;
  id: any;

  admin: boolean;
  super: boolean;

  search: string = '';
  status: string = '';
  
  itemCount: number;
  itemCountR: number;
  limit = 50;
  limitR = 50;
  page = 1;
  pageR = 1;
  serial: number;
  serialR: number;
  
  date: string;
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

  private EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  private EXCEL_EXTENSION = 'xlsx';
  
  // currentPage: number = 1;

  constructor( private payvueservice: PayVueApiService, private toast: ToastService, private webWorkerService: WebworkerService) {
    let user = payvueservice.getUser();
    // this.merchant = user..role.merchantcode

    if(user && user.role.toLowerCase() == 'admin') {
      
      this.admin = true;
    }
    if(user && user.role.toLowerCase() == 'super') {
      
      this.super = true;
    }
    
   }

  ngOnInit() {
    this.date = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.from = this.date
    this.getSameDay();

    eventsService.getEvent('SameDay').subscribe(page => {
      this.page = page;
      this.getSameDay();
    })

    eventsService.getEvent('Details').subscribe(page => {
      this.pageR = page;
      this.getDetails(this.id);
    })
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
      case 'sameDay':
      this.sameDayRecords.map(item => {
        exportData.push({...item});
        return item;
      })

      exportData = exportData.map(item => {
        // item.transaction_ref = item.transaction_ref.join(' ');
        item.transaction_date = formatDate(item.transaction_date, 'yyyy-MM-dd', 'en');
        return item;
      });
        break;
      case 'details':
      this.details.map(item => {
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

  getSameDay() {
    this.sameDayRecords = [];
    this.isData = undefined;
    const apiURL = `settlements/same-day?date=${this.from}&page=${this.page}&limit=${this.limit}`;
    this.payvueservice.apiCall(apiURL).then(data => {
        if (data.data.length > 0) {
          this.itemCount = data.itemCount;
          this.serial = 1 + (this.page - 1) * this.limit;
          this.sameDayRecords = data.data;
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

  getDetails(id) {
    this.details = [];
    this.isDataR = undefined;
    const apiURL = `settlements/same-day/${id}?page=${this.pageR}&limit=${this.limitR}&status=${this.status}&search=${this.search}`;
    this.payvueservice.apiCall(apiURL).then(data => {
      if (data.data.length > 0) {
        this.itemCountR = data.itemCount;
        this.serialR = 1 + (this.pageR - 1) * this.limitR;
        this.details = data.data;
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

  addSameDay(event, id) {
    const btn = event.target;
    btn.disabled = true;
    const apiURL = `settlements/same-day`;
    this.payvueservice.apiCall(apiURL, 'post', {id}).then(data => {
        this.toast.success(data.data.message)
        const item = this.sameDayRecords.find(item => item._id == id);
        if(item) item.paid = true;
        btn.remove();
    }).catch(error => {
      console.error(error);
           
      btn.disabled = false;
    });
  }

  pageChanged(event: any): void {
    this.page = event.page;
    this.getSameDay();
  }

  pageChanged2(event: any): void {
    this.pageR = event.page;
    this.getDetails(this.id);
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
      case 'sameDay':
        sortingArray = this.sameDayRecords;
        break;
      case 'details':
        sortingArray = this.details;
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

