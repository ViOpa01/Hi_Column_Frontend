import { Component, OnInit, Input } from '@angular/core';
import { PayVueApiService } from 'app/providers/payvue-api.service';
import { WebworkerService } from 'app/providers/webworker.service';
import { formatDate } from '@angular/common';
import { EXCEL_EXPORT } from 'app/providers/excel-export-script';
import * as fs from 'file-saver';
import { environment } from 'environments/environment';
import * as filesaver from 'file-saver';

@Component({
  selector: 'app-reconciliation-summary-duo',
  templateUrl: './reconciliation-summary-duo.component.html',
  styleUrls: ['./reconciliation-summary-duo.component.scss']
})
export class ReconciliationSummaryDuoComponent implements OnInit  {

  @Input() shadows = false;
  rotate = false;
  isData: boolean;
  reconciliationSummaryRecords: any[] = [];
  private sorted = false;
  
  itemCount: number;
  page = 1;
  serial: number;
  search: string = '';
  dlUrl: string = '';
  
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

  private EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  private EXCEL_EXTENSION = 'xlsx';
  
  // currentPage: number = 1;

  constructor( private payvueservice: PayVueApiService, private webWorkerService: WebworkerService) {
    let user = payvueservice.getUser();
    this.merchant = user.role.merchantcode

    if (user && user.roles.some(role => role == 'merchant')) {

      this.merchantU = true;
    } else {

      this.merchantU = false;
    }
   }

  ngOnInit() {
    this.from = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.getReconciliationSummary();
  }
 
  
  setPage(pageNo: number): void {
    this.page = pageNo;
  }

  getReconciliationSummary() {
    this.reconciliationSummaryRecords = [];
    this.isData = undefined;
    const apiURL = `reconciliation/summary/bank?date=${this.from}`;
    this.dlUrl = apiURL + '&download=true';
    this.payvueservice.apiCall(apiURL).then(data => { 
      if (data.status === 200) {
        if (data.data.length > 0) {
          this.itemCount = data.itemCount;
          this.serial = 1 + (this.page - 1) * 50;
          this.reconciliationSummaryRecords = data.data;
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
    this.getReconciliationSummary();
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

    this.reconciliationSummaryRecords.sort((a: any, b: any) => {
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
    this.reconciliationSummaryRecords.map(item => {
      exportData.push({...item});
      return item;
    })
   
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
    const name = `${filename}${date}${time}-${this.from}.${fileextension}`;

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

  saveByteArray(reportName, byte) {
    var blob = new Blob([byte], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    var fileName = reportName;
    link.download = fileName;
    link.click();
};

}

