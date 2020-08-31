import { Component, OnInit, Input } from '@angular/core';
import { PayVueApiService } from 'app/providers/payvue-api.service';
import { WebworkerService } from 'app/providers/webworker.service';
import { formatDate } from '@angular/common';
import { EXCEL_EXPORT } from 'app/providers/excel-export-script';
import * as filesaver from 'file-saver';
import eventsService from 'app/providers/events.service';


@Component({
  selector: 'app-reconciliation-merchant',
  templateUrl: './reconciliation-merchant.component.html',
  styleUrls: ['./reconciliation-merchant.component.scss']
})
export class ReconciliationMerchantComponent implements OnInit {

  @Input() shadows = false;
  rotate = false;
  isData: boolean;
  reconciliationMerchantRecords: any[] = [];
  private sorted = false;
  
  itemCount: number;
  page = 1;
  serial: number;
  search: string = '';
  limit = 50;
  name: string = '';

  
  date: string = '';
  date2: string;
  sort = 'transdate';
  dir = 'desc';
  maxSize = 10;

  pid: any;
  
 status: string;
   
  merchname: string;
  merchaccno: number;
  merchant: string = '';
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
   }

  ngOnInit() {
    this.getReconciliationMerchant();
    this.date = formatDate(new Date(), 'yyyy-MM-dd', 'en');

    eventsService.getEvent('ReconciliationMerchantPage').subscribe(page => {
      this.page = page;
      this.getReconciliationMerchant();
    })
  }

  setLimit(event: any) {
    this.limit = event.target.value;
  }
 
  setPage(pageNo: number): void {
    this.page = pageNo;
  }

  dateSet(date) {
    this.date2 = date
  }

  getReconciliationMerchant() {
    this.reconciliationMerchantRecords = [];
    this.isData = undefined;
    const apiURL = `reconciliation/merchants?date=${this.date}&search=${this.search}&page=${this.page}&limit=${this.limit}`;
    this.payvueservice.apiCall(apiURL).then(data => {
      if(data.data.length) {
        this.itemCount = data.itemCount;
        this.serial = 1 + (this.page - 1) * this.limit;
        this.reconciliationMerchantRecords = data.data;
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


  pageChanged(event: any): void {
    this.page = event.page;
    this.getReconciliationMerchant();
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

    this.reconciliationMerchantRecords.sort((a: any, b: any) => {
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
    this.reconciliationMerchantRecords.map(item => {
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

  saveByteArray(reportName, byte) {
    var blob = new Blob([byte], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    var fileName = reportName;
    link.download = fileName;
    link.click();
};

}
