import { Component, OnInit, Input } from '@angular/core';
import { PayVueApiService } from 'app/providers/payvue-api.service';
import { BsModalService} from 'ngx-bootstrap/modal';
import { formatDate } from '@angular/common';
import { EXCEL_EXPORT } from "app/providers/excel-export-script";
import * as filesaver from 'file-saver';
import { WebworkerService } from 'app/providers/webworker.service';
import { SocketService } from 'app/providers/socket.service';
import eventsService from 'app/providers/events.service';
import { environment } from 'environments/environment';
import { ToastService } from 'ng-uikit-pro-standard';


@Component({
  selector: 'app-reconciliation-vas',
  templateUrl: './reconciliation-vas.component.html',
  styleUrls: ['./reconciliation-vas.component.scss']
})
export class ReconciliationVasComponent implements OnInit {
  @Input() shadows = false;
  @Input('mid') mid: string = "";
  @Input('from') from: string = "";
  @Input('bank') bank: string = "";
  @Input('to') to: string = "";
  @Input('show') show = true;
  rotate = false;
  isData: boolean;
  isData2: boolean;
  dlUrl: string =  ''
  values: any
  reconciliationRecords: any[] = [];
  reconciliationRecords2: any[] = [];
  dummyData: any[] = [];
  private sorted = false;
  
  itemCount: number;
  limit = 50;
  page = 1;
  serial: number;
  search: string = '';
  processor: string = '';
  
  date: string;
  sort = 'transdate';
  dir = 'desc';
  maxSize = 10;
  status2: string = ''
  status3: string = ''

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
  switchesData: any[] = [];


  private EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  private EXCEL_EXTENSION = 'xlsx';
  isDownload: boolean;
  
  // currentPage: number = 1;

  constructor( private payvueservice: PayVueApiService, private webWorkerService: WebworkerService, private toast: ToastService) {
   }

  ngOnInit() {
    this.date = formatDate(new Date(), 'yyyy-MM-dd', 'en');

    if(this.from == '') this.from = this.date
    if(this.to == '') this.to = this.date
    this.merchantU = false;
    this.getReconciliation();
    this.getSwitch()
    this.getValues();

    
    const userStr = localStorage.getItem('user');

    const u = JSON.parse(userStr);
    if (u && u.role.toLowerCase() == 'merchant') {

      this.merchantU = true;
    }

    eventsService.getEvent('ReconciliationVasPage').subscribe(page => {
      this.page = page;
      this.getReconciliation();
      this.getValues();
    })
  }
 
  setPage(pageNo: number): void {
    this.page = pageNo;
  }

  filterStatus(){
    let dummy = JSON.parse(JSON.stringify(this.dummyData));

   if(this.status2 == ''){

     this.reconciliationRecords = JSON.parse(JSON.stringify(dummy));

   } else if (this.status2 == 'true') {

    this.reconciliationRecords = JSON.parse(JSON.stringify(dummy.filter(item => item.settled == true)))

    if(!this.reconciliationRecords.length){
      this.isData = false
    } else{
      this.isData = true
    }

   } else if (this.status2 == 'false') {

    this.reconciliationRecords = JSON.parse(JSON.stringify(dummy.filter(item => item.settled == false)))

    if(!this.reconciliationRecords.length){
      this.isData = false
    } else{
      this.isData = true
    }

  }

  }


  download() {
    this.isDownload = true;
    this.payvueservice.apiCall(this.dlUrl).then(data => {
      if (data.data.length > 0) {
        this.reconciliationRecords2 = data.data
        this.exportExcel('recon1')
    this.isDownload = false;

      }else {
        this.toast.error('Failed to Download')
    this.isDownload = false;

      }
    }).catch(error => {
      console.error(error);
      this.toast.error('Failed to Download')
    this.isDownload = false;

    });
  }

  isEmpty(myObject) {
    for (const key in myObject) {
      if (myObject.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
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

  getValues() {
    this.values = [];
    this.isData2 = undefined;
    const apiURL = `reconciliation/summary/vas/transaction/stat?startdate=${this.from}&enddate=${this.to}&processor=${this.processor.toLowerCase()}`;
    this.payvueservice.apiCall(apiURL).then(data => { 
      if (data.status === 200) {
        if (!this.isEmpty(data.data)) {

            this.values = data.data;

          this.isData2 = true;
        } else {
          this.isData2 = false;
        }
      } else {
          this.isData2 = false;
      }
    }).catch(error => {
      console.error(error);
         
          this.isData2 = false;
    });
  }


  getReconciliation() {
    this.reconciliationRecords = [];
    this.isData = undefined;
    // const apiURL = `reconciliation/summary/vas/transaction?startdate=${this.from}&enddate=${this.to}&page=${this.page}&limit=${this.limit}&search=${this.search}&merchant=${this.mid}`;
    const apiURL = `reconciliation/summary/vas/transaction?startdate=${this.from}&enddate=${this.to}&page=${this.page}&limit=${this.limit}&processor=${this.processor.toLowerCase()}&settled=${this.status3}`;
    this.dlUrl = `reconciliation/summary/vas/transaction?startdate=${this.from}&enddate=${this.to}&download=true`;
    // const apiURL = `reconciliation/summary/vas/transaction?startdate=${this.from}&enddate=${this.to}`;
    this.payvueservice.apiCall(apiURL).then(data => { 
      if (data.status === 200) {
        if (data.data.length > 0) {
          this.itemCount = data.itemCount;
          this.serial = 1 + (this.page - 1) * this.limit;
          this.dummyData = JSON.parse(JSON.stringify(data.data));
          if(this.status2 !== ''){
            this.filterStatus()
          } else {
            this.reconciliationRecords = data.data;
          }
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

  public exportExcel(type?) {
    
    let exportData = [];


     if(type == 'recon1'){

      this.reconciliationRecords2.map(item => {
        exportData.push({...item});
        return item;
      })

    } else {
    
    
    this.reconciliationRecords.map(item => {
      exportData.push({...item});
      return item;
    })

  }
   
    exportData = exportData.map(item => {
      item.dateTime = formatDate(item.dateTime, 'yyyy-MM-dd HH:mm:ss', 'en');
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

