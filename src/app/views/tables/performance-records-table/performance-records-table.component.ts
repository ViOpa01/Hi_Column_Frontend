import { Component, OnInit, Input } from '@angular/core';
import { PayVueApiService } from '../../../providers/payvue-api.service';
import {formatDate} from '@angular/common';
import { WebworkerService } from 'app/providers/webworker.service';
import { EXCEL_EXPORT } from "app/providers/excel-export-script";
import * as filesaver from 'file-saver';
import eventsService from 'app/providers/events.service';


@Component({
  selector: 'mdb-performance-records-table',
  templateUrl: './performance-records-table.component.html',
  styleUrls: ['./performance-records-table.component.scss']
})
export class PerformanceRecordsTableComponent implements OnInit {

  @Input() shadows = true;

  date: string;
  sort = 'value';
  from: string = "";
  to: string = "";
  dir = 'desc';
  limit = 50;
  page = 1;

  rotate = false;
  maxSize = 10;

  serial = 0;
  serial1 = 0;
  lastitem = 0;
  search: string = '';
  itemCount: number

  tableData2: any[] = [];
  isData: boolean;

  private sorted = false;

  private EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  private EXCEL_EXTENSION = 'xlsx';

  constructor(private payvueservice: PayVueApiService, private webWorkerService: WebworkerService) { this.isData = true;}
  ngOnInit() {
    this.date = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.from = this.date;
    this.to = this.date;
    this.getPerformanceRecords();

    
    eventsService.getEvent('performancePage').subscribe(page => {
      this.page = page;
      this.getPerformanceRecords();
    })
  }

  sortBy(by: string | any): void {

    this.tableData2.sort((a: any, b: any) => {
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


  getPerformanceRecords() {
    this.tableData2 = [];
    this.isData = undefined;
    const apiURL = `transactions/performance-records/?startdate=${this.from}&enddate=${this.to}&sort=${this.sort}&dir=${this.dir}&page=${this.page}&limit=${this.limit}`;
      this.payvueservice.apiCall(apiURL).then(data => {
        if (data.status === 200) {
          if (data.data.length > 0) {
            this.serial = 1 + (this.page - 1) * this.limit;

            this.serial1 = this.serial
            this.tableData2 = data.data;
            this.isData = true;
          } else {
            this.isData = false;
            this.itemCount = 1;
          }
        } else {
          this.isData = false;
          this.itemCount = 1;
        }
      }).catch(error => {
        console.error(error);
        this.isData = false;
        this.itemCount = 1;
      });
  
  }

  pageChanged(event: any): void {
    this.page = event.page;
    this.getPerformanceRecords();
  }

  setLimit(event: any) {
    this.limit = event.target.value;
  }

  setSort(event: any) {
    this.sort = event.target.value;
  }

  setPage() {
    this.page = 1;
  }

  public exportExcel() {
    let exportData = [];
    this.tableData2.map(item => {
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
}

