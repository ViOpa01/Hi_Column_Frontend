import { Component, OnInit, Input } from '@angular/core';
import { PayVueApiService } from 'app/providers/payvue-api.service';
import { BsModalService} from 'ngx-bootstrap/modal';
import { formatDate } from '@angular/common';
import { EXCEL_EXPORT } from "app/providers/excel-export-script";
import * as filesaver from 'file-saver';
import { WebworkerService } from 'app/providers/webworker.service';
import { SocketService } from 'app/providers/socket.service';
import eventsService from 'app/providers/events.service';

@Component({
  selector: 'app-reconciliation',
  templateUrl: './reconciliation.component.html',
  styleUrls: ['./reconciliation.component.scss']
})
export class ReconciliationComponent implements OnInit {
  @Input() shadows = false;
  @Input('mid') mid: string = "";
  @Input('from') from: string = "";
  @Input('bank') bank: string = "";
  @Input('to') to: string = "";
  @Input('show') show = true;
  rotate = false;
  isData: boolean;
  reconciliationRecords: any[] = [];
  private sorted = false;
  
  itemCount: number;
  limit = 50;
  page = 1;
  serial: number;
  search: string = '';
  
  date: string;
  sort = 'transdate';
  dir = 'desc';
  maxSize = 10;

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

  merchantU: boolean;

  private EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  private EXCEL_EXTENSION = 'xlsx';
  
  // currentPage: number = 1;

  constructor( private payvueservice: PayVueApiService, private webWorkerService: WebworkerService) {
   }

  ngOnInit() {
     this.date = formatDate(new Date(), 'yyyy-MM-dd', 'en');

    if(this.from == '') this.from = this.date
    if(this.to == '') this.to = this.date
    this.merchantU = false;
    this.getReconciliation();
    
    const userStr = localStorage.getItem('user');

    const u = JSON.parse(userStr);
    if (u && u.role.toLowerCase() == 'merchant') {

      this.merchantU = true;
    }

    eventsService.getEvent('ReconciliationPage').subscribe(page => {
      this.page = page;
      this.getReconciliation();
    })
  }
 
  setPage(pageNo: number): void {
    this.page = pageNo;
  }

  getReconciliation() {
    this.reconciliationRecords = [];
    this.isData = undefined;
    const apiURL = `reconciliation/?startdate=${this.from}&enddate=${this.to}&page=${this.page}&limit=${this.limit}&search=${this.search}&merchant=${this.mid}`;
    this.payvueservice.apiCall(apiURL).then(data => { 
      if (data.status === 200) {
        if (data.data.length > 0) {
          this.itemCount = data.itemCount;
          this.serial = 1 + (this.page - 1) * this.limit;
          this.reconciliationRecords = data.data;
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

  pageChanged(event: any): void {
    this.page = event.page;
    this.getReconciliation();
  }

  setLimit(event: any) {
    this.limit = event.target.value;
  }

  setSort(event: any) {
    this.sort = event.target.value;
  }

  setStatus(event: any) {
    this.status = event.target.value;
  }

  setDir(event: any) {
    this.dir = event.target.value;
  }

  sortBy(by: string | any): void {

    this.reconciliationRecords.sort((a: any, b: any) => {
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

  public exportExcel() {
    
    let exportData = [];
    this.reconciliationRecords.map(item => {
      exportData.push({...item});
      return item;
    })
   
    exportData = exportData.map(item => {
      item.transaction_date = formatDate(item.transaction_date, 'yyyy-MM-dd HH:mm:ss', 'en');
      return item;
    });
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

