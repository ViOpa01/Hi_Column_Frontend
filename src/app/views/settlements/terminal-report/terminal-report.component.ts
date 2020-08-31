import { Component, OnInit, Input } from '@angular/core';
import { PayVueApiService } from '../../../providers/payvue-api.service';
import {formatDate} from '@angular/common';
import { EXCEL_EXPORT } from "app/providers/excel-export-script";
import * as filesaver from 'file-saver';
import * as xlsx from 'xlsx';
import { WebworkerService } from 'app/providers/webworker.service';
import eventsService from 'app/providers/events.service';

@Component({
  selector: 'app-terminal-report',
  templateUrl: './terminal-report.component.html',
  styleUrls: ['./terminal-report.component.scss']
})
export class TerminalReportComponent implements OnInit {

  @Input() shadows = false;
  rotate = false;
  maxSize = 10;

  date: string;
  page = 1;

  serial = 0;
  limit = 50;
  itemCount: number;
  from: string = '';
  to: string = '';
  tableData: any[] = [];
  isData: boolean;
  visible = false;
  merchant: string;
  terminal: string;
  private sorted = false;

  private EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  private EXCEL_EXTENSION = 'xlsx';
  constructor(private payvueservice: PayVueApiService, private webWorkerService: WebworkerService) { }

  ngOnInit() {
    this.getTerminalPerformance();
    this.date = formatDate(new Date(), 'yyyy-MM-dd', 'en');

    eventsService.getEvent('TerminalReportPage').subscribe(page => {
      this.page = page;
      this.getTerminalPerformance();
    })
  }

  getTerminalPerformance() {
    this.tableData = [];
    this.isData = undefined;
    let query = '';
    if (this.merchant) query += '&merchant=' + this.merchant;
    if (this.terminal) query += '&terminal=' + this.terminal;
    const apiURL = `settlements/pos-performance/?page=${this.page}&startdate=${this.from}&enddate=${this.to}&limit=${this.limit}${query}`;
      this.payvueservice.apiCall(apiURL).then(data => {
        if (data.status === 200) {
          if (data.data.length > 0) {
            this.itemCount = data.itemCount;
            this.serial = 1 + (this.page - 1) * this.limit;

            this.tableData = data.data;
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
        this.itemCount = 1;
        this.isData = false;
      });

  }

  pageChanged(event: any): void {
    this.page = event.page;
    this.getTerminalPerformance();
  }

  showLoader(event: any) {
    if (event.target.nativeElement.children[0].children[0].classList.contains('check')) {
      this.visible = true;
      window.setTimeout(() => {
        this.visible = false;
      }, 2000);
    }

  }
  setLimit(event: any) {
    this.limit = event.target.value;
  }

  sortBy(by: string | any): void {

    this.tableData.sort((a: any, b: any) => {
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

  public exportExcel(data: string) {
    let exportData = [];
    if (data == 'terminal') {
      exportData = this.tableData
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

  setPage(page: number): void {

    switch(page) {
      case 1: 
        this.page = 1;
          break;
      default:
      break;
    }
  }
}
