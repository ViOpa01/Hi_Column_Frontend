import { Component, OnInit, Input } from '@angular/core';
import { PayVueApiService } from 'app/providers/payvue-api.service';
import { WebworkerService } from 'app/providers/webworker.service';
import { formatDate } from '@angular/common';
import { EXCEL_EXPORT } from 'app/providers/excel-export-script';
import { environment } from 'environments/environment';
import eventsService from 'app/providers/events.service';
import * as filesaver from 'file-saver';


@Component({
  selector: 'app-reconciliation-summary',
  templateUrl: './reconciliation-summary.component.html',
  styleUrls: ['./reconciliation-summary.component.scss']
})
export class ReconciliationSummaryComponent implements OnInit {

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
  years: any[] = [];
  year = formatDate(new Date(), 'yyyy', 'en');

  months: any[] = [];
  month = formatDate(new Date(), 'MM', 'en');

  day: boolean = true;
  week: boolean = false;

  date: string;
  date2: string;
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
  type: string = 'daily';

  private EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  private EXCEL_EXTENSION = 'xlsx';

  // currentPage: number = 1;

  constructor(private payvueservice: PayVueApiService, private webWorkerService: WebworkerService) {
    let user = payvueservice.getUser();
    this.merchant = user.role.merchantcode

    if (user && user.roletoLowerCase() == 'merchant') {

      this.merchantU = true;
    } else {

      this.merchantU = false;
    }
  }

  ngOnInit() {
    
    // this.date = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.from = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.getReconciliationSummary();
    this.setYears();

    eventsService.getEvent('ReconciliationSummaryPage').subscribe(page => {
      this.page = page;
      this.getReconciliationSummary();;
    })
  }


  setPage(pageNo: number): void {
    this.page = pageNo;
  }

  dateSet(date) {
    this.date2 = date
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

    this.getReconciliationSummary();
    this.setPage(1);
  }

  download() {
    this.isDownload = true;
    this.payvueservice.apiCall(this.dlUrl).then(data => {
      this.openNewTab(data.data.link);
      this.isDownload = false;
    }).catch(error => {
      console.error(error);
      this.isDownload = false;
    });
  }

  openNewTab(url) {
    const win = window.open(url, "_blank");
    if (win) win.focus(); else {
      location.href = url;
    }
  }

  getReconciliationSummary() {
    this.reconciliationSummaryRecords = [];
    this.isData = undefined;
    let apiURL = ''
    if(this.type == 'weekly' ) {
      apiURL = `reconciliation/summary?date=${this.year}-${this.month}-01&page=${this.page}&search=${this.search}&type=${this.type}`;
    }
    else {
      apiURL = `reconciliation/summary?date=${this.from}&page=${this.page}&search=${this.search}&type=${this.type}`;
    }
    this.dlUrl = apiURL + '&download=true';
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

  setYears() {

    let thisYear = new Date().getFullYear()

    for (let i = 0; i < 5; i++) {
      this.years.push((thisYear - i).toString());
    }
    this.setMonths();
  }

  setMonths() {

    for (let i = 0; i < 12; i++) {
      if ((i + 1) < 10) {
        this.months.push('0' + (i + 1).toString());
      }
      else {
        this.months.push((i + 1).toString());
      }
    }
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
      exportData.push({ ...item });
      return item;
    })

    exportData = exportData.map(item => {
      item.date = formatDate(item.date, 'yyyy-MM-dd', 'en');
      return item;
    });
    const input = {
      config: {
        body: exportData,
        // columns: ['DATE', 'DAY', 'ITEX Transactions', 'TOTAL Settlement', 'OVER/UNDER Settlement']
      },
      host: window.location.host,
      path: window.location.pathname,
      protocol: window.location.protocol
    };

    this.webWorkerService.run(EXCEL_EXPORT, input).then(
      (result) => {
        // this.saveByteArray('export', result)
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
    var blob = new Blob([byte], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    var fileName = reportName;
    link.download = fileName;
    link.click();
  };

}

