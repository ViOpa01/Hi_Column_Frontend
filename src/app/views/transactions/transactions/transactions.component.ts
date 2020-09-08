import { Component, OnInit, Input } from '@angular/core';
import { PayVueApiService } from '../../../providers/payvue-api.service';
import { formatDate } from '@angular/common';
import { SocketService } from 'app/providers/socket.service';
import eventsService from 'app/providers/events.service';
import { EXCEL_EXPORT } from "app/providers/excel-export-script";
import * as filesaver from 'file-saver';
import { WebworkerService } from 'app/providers/webworker.service';
import  BankModel  from 'app/Models/bank-image.model';
import  CardModel  from 'app/Models/card.model';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit  {

  @Input() shadows = false
  @Input('mid') mid: string = "";
  @Input('show') show = true;
  @Input('date2') date2: string = "";
  // failureShow = true;
  rotate = false;
  maxSize = 10;
  date: string;
  status: string = "";

  from: string = "";
  to: string = "";
  source: string = "";

  page = 1;
  limit = 50;
  serial = 0;
  serial1 = 0;
  lastitem = 0;
  search: string = "";

  tableData: any[] = [];
  failureData: any;
  isData: boolean;
  isFailureData: boolean;
  optionsSelect: Array<any>;

  merchant: string = "";
  terminal: string = "";
  receiptRowData;
  receiptView: boolean = false;

  merchantU: boolean;
  isSuper: boolean;
  super: boolean;

  bankModel = BankModel
  brandModel = CardModel

  private sorted = false;


  private EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  private EXCEL_EXTENSION = 'xlsx';

  constructor(private payvueservice: PayVueApiService, private socket: SocketService, private webWorkerService: WebworkerService) {
    this.merchantU = false;
    const userStr = localStorage.getItem('user');

    const u = JSON.parse(userStr);
    if (u && u.role.toLowerCase() == 'merchant') {

      this.merchantU = true;

      if(u && u.isSuperMerchant){
        this.isSuper = true;
      }
    }
    else if (u && u.isSuperAdmin){
      this.super = true;
    }
    // this.socket.on('trans-history-message').subscribe(data => {
    //   if (!data) return;
    //   if (this.page == 1 && !this.search && !this.mid && !this.source && !this.status &&
    //     (
    //       ((this.to == this.from) && (this.to == this.date || !this.to)) ||
    //       ((!this.to || !this.from) && (this.to == this.date || this.from == this.date))
    //     )
    //     && !this.receiptView
    //   ){
    //     this.tableData = data.data;
    //     this.isData = true;
    //     this.serial1 = 1 + (this.page - 1) * this.limit;
    //     // this.failureShow = true;
    //   }
    // })
  }

  ngOnInit() {

    this.optionsSelect = [
      { value: '20', label: '20' },
      { value: '50', label: '50' },
      { value: '100', label: '100' },
      { value: '200', label: '200' },
    ];
    this.date = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.from = this.date;
    this.to = this.date;

    this.getTransactionHistory();
    // this.getFailureReason();

    eventsService.getEvent('TransHistoryPage').subscribe(page => {
      this.page = page;
      this.getTransactionHistory();
      
      // if(this.show) {
      //   this.getFailureReason();
      // }
      
    })
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

  public exportExcel() {
    let exportData = [];
    this.tableData.map(item => {
      exportData.push({ ...item });
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

  checkKey(event){

    if(event && event.key == 'Enter'){
      this.getTransactionHistory();
    }
  }

  getTransactionHistory() {

    let page = this.page < 1 ? 1 : this.page

    this.tableData = [];
    this.isData = undefined;

    if (this.date2) {
      this.from = this.date2
      this.to = this.date2
    }

    let apiURL = ''

    if(this.isSuper){
      const user = this.payvueservice.getUser();
      let merchant = user.merchantcode
      
      apiURL = `:5010/webpay/v1/journals/gettransactions?startdate=${this.from}&enddate=${this.to}&download=false&issettlement=false&merchantcode=${merchant}&page=${page}&order=desc&orderBy=transactionID`;

    } else if(this.super){
      apiURL = `:5010/webpay/v1/journals/gettransactions?startdate=${this.from}&enddate=${this.to}&download=false&issettlement=false&merchantcode=&page=${page}&order=desc&orderBy=transactionID`;

    }

    this.payvueservice.apiCall(apiURL, 'get', {}, false, false, true).then(data => {
      if (data.status === 200) {
        if (data.data.length > 0) {
          this.serial1 = 1 + (page - 1) * this.limit;
          this.tableData = JSON.parse(JSON.stringify(data.data));

          this.isData = true;
          console.log(this.isData)
          this.page = page;
        } else {
          this.isData = false;
        }
      } else {
        this.isData = false;
      }
      
    }).catch(error => {
      console.error(error);
      this.isData = false;
    });
  }


  pageChanged(event: any): void {
    this.page = event.page;
    this.getTransactionHistory();
  }

  setLimit(event: any) {
    this.limit = event.target.value;
  }

  setPage() {
    this.page = 1;
  }
}
