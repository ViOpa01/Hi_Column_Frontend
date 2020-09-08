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
import { ToastService } from 'ng-uikit-pro-standard';

@Component({
  selector: 'app-upload-settlement',
  templateUrl: './upload-settlement.component.html',
  styleUrls: ['./upload-settlement.component.scss']
})
export class UploadSettlementComponent implements OnInit {

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
  uploadPercent: number;

  switchNames: any [] = [];
  validSwitches: any[] = []
  switchesData: any[] = [];

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

  isChecked: boolean;
  sheetCount: number;
  sheetsArray: any[] = []
  isUploading = false;

  private sorted = false;
  file: File;

  private EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  private EXCEL_EXTENSION = 'xlsx';

  constructor(private payvueservice: PayVueApiService, private socket: SocketService, private webWorkerService: WebworkerService, private toast: ToastService) {
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

    this.getSettledHistory();
    // this.getFailureReason();

    eventsService.getEvent('UploadHistoryPage').subscribe(page => {
      this.page = page;
      this.getSettledHistory();
      
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

  getSwitchDetails(name) {
    return this.switchesData.find(item => item.name === name)
  }

  getSwitch() {
    const apiURL = `config/switch/settlement`;
    this.payvueservice.apiCall(apiURL).then(data => {
      this.switchesData = data.data
    }).catch(error =>
      {
        console.log(error)
      })
  }



  checkFile(event:any) {
    this.uploadPercent = NaN;
    var mime = event.target.files[0].type
    if (mime !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && mime !== 'application/vnd.ms-excel') {
      this.toast.error("incorrect file type, must be valid excel")
      this.isChecked = false;
      return;
    }
    localStorage.setItem('xfile', 'true');
    this.file = event.target.files[0];
    this.isChecked = true;
    this.sheetsArray = [];
    this.sheetCount = undefined;
  }

  reset() {
    this.sheetCount = undefined
  }

  sheets() {
    this.sheetsArray = [];
    this.switchNames = this.switchNames.slice(0,this.sheetCount);
      for (let i = 1;i <= this.sheetCount; i++) {
        this.sheetsArray.push(i);
      } 
     
  }

  doUpload() {
    localStorage.setItem('xfile', 'true');
    this.isUploading = true
    let names = this.switchNames.join(',');
    const formData = new FormData();
    formData.append('file',this.file);
    formData.append('processors',names)
    const apiURL = `settlements/upload-file`;
    
    //   console.log(8888888)
    // this.payvueservice.apiCall(apiURL, 'post', formData, true, true).then(data => {
    //   console.log(data, 'hi data');
    //   this.toast.success(data.data.message);
    // formData.append('file',this.file);
    // formData.append('type','settlement');
    // formData.append('processor',names);
    // formData.append('Authorization', localStorage.getItem('itt'))
    // const apiURL = `upload`;

    this.payvueservice.apiCall(apiURL, 'post', formData, true, true).then(data => {
      console.log(data);
      // this.toast.success(data);
      // this.toast.success(data.data.message);

      let isProcessing = true;
      
      eventsService.getEvent('upload-processing').emit(isProcessing);
      
      localStorage.removeItem('xfile');
    }).catch(error => {
      this.isUploading = false;
      this.toast.error(`failed to upload  ${this.file.name}`);
      console.error(`failed to upload ${this.file.name}`, error)
    })
  }

  selectSwitch() {
    this.switchNames = this.switchNames.filter(item => item != 'undefined');
    this.validSwitches = this.switchNames.filter(item => item != 'ignore');
   }

  checkKey(event){

    if(event && event.key == 'Enter'){
      this.getSettledHistory();
    }
  }

  getSettledHistory() {

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
    this.getSettledHistory();
  }

  setLimit(event: any) {
    this.limit = event.target.value;
  }

  setPage() {
    this.page = 1;
  }
}

