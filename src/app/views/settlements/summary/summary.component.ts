import { Component, OnInit, Input } from '@angular/core';
import { PayVueApiService } from 'app/providers/payvue-api.service';
import { forEach } from '@angular/router/src/utils/collection';
import { formatDate } from '@angular/common';
import { EXCEL_EXPORT } from "app/providers/excel-export-script";
import * as filesaver from 'file-saver';
import * as xlsx from 'xlsx';
import { WebworkerService } from 'app/providers/webworker.service';
import eventsService from 'app/providers/events.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {
  @Input() shadows = false;
  date: string;
  rotate = false;
  maxSize = 10;
  settlementRecords: any[] = [];
  isData: boolean;
  private sorted = false;


  from: string = '';
  to: string = '';
  page: number = 1;
  limit: number = 50;
  sort: string;
  dir: string;
  itemCount: number;
  serial: number;

  merchantID: string;
  terminalID: string;

  private EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  private EXCEL_EXTENSION = 'xlsx';

  constructor( private payvueservice: PayVueApiService,private webWorkerService: WebworkerService ) { }

  ngOnInit() {
    this.getSettlements();
    this.date = formatDate(new Date(), 'yyyy-MM-dd', 'en');

    eventsService.getEvent('SummarySettlementPage').subscribe(page => {
      this.page = page;
      this.getSettlements();
    })
  }

  getSettlements() {
    this.settlementRecords = [];
    this.isData = undefined;
    let query = '';
    if (this.merchantID) query += '&merchant=' + this.merchantID;
    if (this.terminalID) query += '&terminal=' + this.terminalID;
    const apiURL = `settlements/pos-performance/merchant?startdate=${this.from}&enddate=${this.to}&page=${this.page}&limit=${this.limit}${query}`;
    this.payvueservice.apiCall(apiURL).then(data => {
      if (data.status === 200) {
        if (data.data.length > 0) {
          this.itemCount = data.itemCount;
          this.serial = 1 + (this.page - 1) * this.limit;
          this.settlementRecords = data.data;
          this.isData = true;
        } else {
          this.isData = false;
          this.itemCount = 1;
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
    this.getSettlements();
  }

  sortBy(by: string | any): void {

    this.settlementRecords.sort((a: any, b: any) => {
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

  alert() {
    alert("hi");
  }

  setLimit(event: any) {
    this.limit = event.target.value;
  }

  public exportExcel() {
    let exportData = [];
    this.settlementRecords.map(item => {
      exportData.push({...item});
      return item;
    })
   
    exportData = exportData.map(item => {
      item.terminal_ids = item.terminal_ids.join(' ');
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

  setPage(pageNo: number): void {
    this.page = pageNo;
  }

}