import { Component, OnInit, Input } from '@angular/core';
import { PayVueApiService } from 'app/providers/payvue-api.service';
import { formatDate } from '@angular/common';
import { SocketService } from 'app/providers/socket.service';
import eventsService from 'app/providers/events.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {
  @Input() shadows = false;
  rotate = false;
  isData: boolean;
  settlementRecords: any[] = [];
  private sorted = false;

  itemCount: number;
  limit = 50;
  page = 1;
  serial: number;

  date: string;
  sort = 'transdate';
  dir = 'desc';
  from: string = '';
  to: string = '';
  maxSize = 10;

  pid: any;

  processor: string = '';
  switchNames: any[] = [];
  search: string = '';

  // currentPage: number = 1;

  constructor(private payvueservice: PayVueApiService, private socket: SocketService) {
    this.socket.on('settlement-upload-message').subscribe(() => {
      this.getSettlements();
    })
  }

  ngOnInit() {

    this.getSettlements();
    this.date = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.getSwitchesNames();

    eventsService.getEvent('SettlementTransactions').subscribe(page => {
      this.page = page;
      this.getSettlements();
    })
  }

  setPage(pageNo: number): void {
    this.page = pageNo;
  }

  getSettlements() {
    this.settlementRecords = [];
    this.isData = undefined;
    const apiURL = `settlements/?startdate=${this.from}&enddate=${this.to}&page=${this.page}&processor=${this.processor}&limit=${this.limit}&sort=${this.sort}&dir=${this.dir}&search=${this.search}`;
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
    this.getSettlements();
  }

  setLimit(event: any) {
    this.page = 1;
    this.limit = event.target.value;
    // this.getSettlements();
    // this.setPage(1);
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

  refresh() {
    this.getSettlements();
  }

  getSwitchesNames() {
    const apiURL = `config/switch/settlement?type=name`;
    this.payvueservice.apiCall(apiURL).then(data => {
      this.switchNames = data.data

    }).catch(error => {
      console.log(error)
    })
  }
}

