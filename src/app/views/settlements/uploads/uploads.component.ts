import { Component, OnInit, ElementRef, ViewChild, Input, HostListener, TemplateRef } from '@angular/core';
import { PayVueApiService } from '../../../providers/payvue-api.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastService } from 'ng-uikit-pro-standard';
import { formatDate } from '@angular/common';

import * as xlsx from 'xlsx';
import * as filesaver from 'file-saver'
import { NgForm } from '@angular/forms';
import { FormCanDeactivate } from 'app/shared/FormCanDeactivate';
import { EXCEL_IMPORT } from "app/providers/excel-read-script";
import { EXCEL_EXPORT } from "app/providers/excel-export-script";
import { EXCEL_JSON } from 'app/providers/excel-json2-script';
import { WebworkerService } from "app/providers/webworker.service";
import { EXCEL_HEADERS } from 'app/providers/excel-json2-script';
import { SocketService } from 'app/providers/socket.service';

@Component({
  selector: 'app-uploads',
  templateUrl: './uploads.component.html',
  styleUrls: ['./uploads.component.scss']
})

export class UploadsComponent extends FormCanDeactivate implements OnInit {
 
  @Input() shadows = false;
  switchName: string = "";
  processor: string = "";
  switchesData: any[] = [];
  switchDetail: any;
  title: string;

  modalRef: BsModalRef;

  currentSheet: string;

  threshold = 2000;
  isThreshold = false;
  counter = 0;
  headers: any;

  rotate = false;
  maxSize = 10;
  progress = 0;
  progressMax = 0;
  stringProgress = "";

  page = 1;
  page2 = 1;

  limit = 50;
  limit2 = 50;
  limit3: number;

  serial = 0;
  serial1 = 0;
  serial2 = 0;

  search: string;

  itemCount: number;
  itemCount2: number;
  date: string;
  sort = 'transdate';
  dir = 'desc';
  from: string;
  to: string;
  data: any;
  pid: any;
  merchname: string;
  merchaccno: number;
  merchant: string;
  terminal: string;
  pan: string;
  stan: number;
  amount: number;
  settlement: number;
  charge: number;
  totalRowCount: number = 0;

  tableData4: any[] = [];
  uploadHistory: any[] = [];
  contentArray: any[] = [];
  returnedArray: any[] = [];

  valid: any[] = [];
  invalid: any[] = [];
  visible = false;
  stringified: string;
  interval;
  works: any;

  validation: any;

  private sorted = false;
  isData: boolean;
  isHistory: boolean;
  reading: boolean;
  uploading: boolean;
  checking: boolean;
  checked: boolean;
  correct: boolean;

  @ViewChild('form')
  form: NgForm;

  fileModel: any;

  file: File;
  showResult = false; isConfirmed = false; confirmCB = false; isFile = false; isVerified = false;
  arrayBuffer: any; totalRowCnt = 0; excelArray: any;

  filename: string;

  merchantU: boolean;
  user: boolean;
  admin: boolean;
  super: boolean;

  private EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  private EXCEL_EXTENSION = 'xlsx';

  @ViewChild('settlements') settlementFile: ElementRef;
  constructor(private payvueservice: PayVueApiService, private webWorkerService: WebworkerService, private toast: ToastService, private socket: SocketService) {
    super();

    this.socket.on('settlement-upload-message').subscribe(data =>{
      if (!data) return
      this.getHistory();
    })
    const userStr = localStorage.getItem('user');

    const u = JSON.parse(userStr);

    if (u && u.role.toLowerCase() == 'merchant') {

      this.merchantU = false;
    } else if (u && u.role.toLowerCase() == '') {

      this.user = true;
    } else if (u && u.role.toLowerCase() == 'admin') {

      this.admin = true;
    } else if (u && u.role.toLowerCase() == 'super') {

      this.super = true;
    }
  }

  ngOnInit() {
    this.getHistory();
    this.getSwitch();
    this.date = formatDate(new Date(), 'yyyy-MM-dd', 'en');
  }

  showLoader(event: any) {
    if (event.target.nativeElement.children[0].children[0].classList.contains('check')) {
      this.visible = true;
      window.setTimeout(() => {
        this.visible = false;
      }, 2000);
    }
  }

  setTitle(title: string, sheetName: string) {
    this.sheetNames.map(x => {
      if (x.sheetName === sheetName) {
        this.currentSheet = sheetName
        this.title = title;
        if (title == 'Valid') {
          this.contentArray = x.valid
        }
        else if (title == 'Invalid') {
          this.contentArray = x.invalid;
        }
      }
    })
  }

  getSwitchDetails(name) {
    return this.switchesData.find(item => item.name === name)
  }

  sheetNames: {
    sheetName: string;
    uploadingStatus: boolean;
    validatingStatus: boolean;
    rowCount: number;
    valid: any[]
    invalid: any[]
  }[]; /*loop this in html with showing the name of sheet and an upload button */
  uploadedWorkBook: xlsx.WorkBook;
  readingFile: boolean;
  uploadingFile: boolean;
  validatingFile: boolean;

  reset() {
    this.sheetNames = [];
    this.fileModel = '';
  }

  public readExcel(evt: any) {
    this.switchDetail = this.getSwitchDetails(this.switchName);
    // return
    this.sheetNames = [];
    this.checked = false;
    this.totalRowCount = 0;
    const target: DataTransfer = <DataTransfer>evt.target;
    if (target.files.length > 1) throw new Error("Cannot use multiple files");
    if (target.files.length == 0) {
      return
    }
    this.filename = target.files[0].name
    var mime = target.files[0].type
    if (mime !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && mime !== 'application/vnd.ms-excel') {
      this.toast.error("incorrect file type, must be valid excel")
      return;
    }
    const size = target.files[0].size
    if (size > 5242880) {
      this.toast.warning('Please reduce file content', 'File is bigger than 5MB')
    }
    else {
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        /* read workbook */
        const bstr: string = e.target.result;
        const input = {
          config: {
            body: bstr
          },
          host: window.location.host,
          path: window.location.pathname,
          protocol: window.location.protocol
        };
        const dis = this;
        this.sheetNames = [];
        this.readingFile = true;
        this.webWorkerService.run(EXCEL_IMPORT, input).then(
          (result: any) => {
            dis.readingFile = false;
            result.SheetNames.forEach(sheetName => {
              const ws: xlsx.WorkSheet = result.Sheets[sheetName];
              var range = xlsx.utils.decode_range(ws['!ref']);
              var rx = (range.e.r + 1) - this.switchDetail.headerRowNumber; 
              dis.totalRowCount += rx;      
              dis.sheetNames.push({ sheetName: sheetName, uploadingStatus: undefined, validatingStatus: undefined, valid: undefined, invalid: undefined, rowCount: rx < 0 ? 0 : rx });
            });


            this.uploadedWorkBook = result;
            //this.check(this.sheetNames[0].sheetName)
            // xlsx.utils.decode_range('20');
          }
        ).catch(console.error);
      };
      this.isThreshold = false;
      reader.readAsBinaryString(target.files[0]);
      localStorage.setItem('xfile', 'true');
    }
  }

  getHeaders(sheetName: string) {
    const ws: xlsx.WorkSheet = this.uploadedWorkBook.Sheets[sheetName];

    const input = {
      config: {
        body: ws,
        range: this.switchDetail,
      },
      host: window.location.host,
      path: window.location.pathname,
      protocol: window.location.protocol
    };

    this.webWorkerService.run(EXCEL_HEADERS, input).then((result: any) => {
      this.headers = result;

    }).catch(console.error);
  }

  validate(sheetName: string) {
    this.validatingFile = true;

    const ws: xlsx.WorkSheet = this.uploadedWorkBook.Sheets[sheetName];
    if (this.totalRowCount <= 10000) {
      this.sheetNames.map(x => {
        if (x.sheetName === sheetName) {
          x.validatingStatus = true;
        }
      })
      const input = {
        config: {
          body: ws,
          range: this.switchDetail,
        },
        host: window.location.host,
        path: window.location.pathname,
        protocol: window.location.protocol
      };
      this.getHeaders(sheetName);

      this.sheetNames.map(x => {
        if (x.sheetName === sheetName) {
          this.webWorkerService.run(EXCEL_JSON, input).then((result: any) => {
            this.data = result;

            let good = [];
            let bad = [];
            let validation: boolean;

            for (let j = 0; j < this.data.length; j++) {
              if (
                ((this.data[j][this.switchDetail.commonColumns.merchant_id])) &&
                ((this.data[j][this.switchDetail.commonColumns.terminal_id])) &&
                ((this.data[j][this.switchDetail.commonColumns.pan])) &&
                ((typeof (this.data[j][this.switchDetail.commonColumns.transaction_amount]) === 'number')) &&
                ((this.data[j][this.switchDetail.commonColumns.rrn])) &&
                ((typeof (this.data[j][this.switchDetail.commonColumns.settlement_amount]) === 'number')))
                {
                  if ((typeof (this.data[j][this.switchDetail.commonColumns.transaction_date]) === 'string')) {
                    this.data[j][this.switchDetail.commonColumns.transaction_date] = this.stringToSerialDateConverter(this.data[j][this.switchDetail.commonColumns.transaction_date])

                    if(Number.isNaN(this.data[j][this.switchDetail.commonColumns.transaction_date])) {
                      validation = false;
                    }
                    else {
                      validation = true;
                    }

                  }
                  else if ((typeof (this.data[j][this.switchDetail.commonColumns.transaction_date]) === 'number')) {
  
                    validation = true;
                  }
                  else {
                    validation = false;
                  }
              }
              else {
                validation = false
              }
              if (validation === false) {
                bad.push(result[j])

              } else if (validation === true) {
                good.push(result[j])
              }

            }

            x.valid = good;
            x.invalid = bad;

            this.sheetNames.map(x => {
              if (x.sheetName === sheetName) {
                x.validatingStatus = false;

                if(x.valid.length > 0 && x.invalid.length == 0) {
                  this.uploadSheet(x.sheetName);
                }
              }
            })
            this.validatingFile = false;
          }).catch(console.error);
        }
      })
    } else {
      this.toast.warning('Please break file into parts', 'Number of rows exceeds 10,000')
    }


  }

  uploadSheet(sheetName: string) {
    this.uploadingFile = true;
    this.sheetNames.map(x => {
      if (x.sheetName === sheetName) {
        x.uploadingStatus = true;
        this.valid = x.valid;
      }
    });

    if (this.isThreshold) {
      this.interval = setInterval(() => {
        this.counter++;
      }, 1000)
    }
    this.pid = Math.random().toString(36).substring(7);
    this.doUpload(0, this.threshold, this.threshold, sheetName);

  }

  public exportExcel(data: string) {
    let exportData 
    this.sheetNames.map(x => {
      if (x.sheetName === this.currentSheet) {
        exportData = data == 'Valid' ? x.valid : x.invalid;
      }
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

  private covertToNoKeyArray(result: any[]) {
    let values;
    let v = [];
    for (let k = 0; k < result.length; k++) {
      let value = result[k];
      values = Object.keys(value).map(function (e) {
        return value[e]
      })
      v.push(values);
    }
    return (v)
  }

  excelDateConverter = (serial) => {
    const utcDays = Math.floor(serial - 25569);
    const utcValue = utcDays * 86400;
    const dateInfo = new Date(utcValue * 1000);

    const fractionalDay = serial - Math.floor(serial) + 0.0000001;
    let totalSeconds = Math.floor(86400 * fractionalDay);
    const seconds = totalSeconds % 60;

    totalSeconds -= seconds;

    const hours = Math.floor(totalSeconds / (60 * 60));
    const minutes = Math.floor(totalSeconds / 60) % 60;

    const sep = '-';
    const hSp = ':';

    return dateInfo.getFullYear()
      + sep + `${dateInfo.getMonth()}`.padStart(2)
      + sep + `${dateInfo.getDate()}`.padStart(2)
      + ' ' + `${hours}`.padStart(2)
      + hSp + `${minutes}`.padStart(2)
      + hSp + `${seconds}`.padStart(2)
  }

  stringToSerialDateConverter = (date) => {

    const utcValue =  new Date(date)
    .getTime() / 1000;
    const utcDays = utcValue / 86400;
    const serial = utcDays + 25569 + 1 / 24;

    return serial;
  }


  setThreshold() {
    if (this.threshold > 0 || this.threshold === 2000) {
      this.isThreshold = true;
    } else if (this.threshold === undefined || this.threshold === 0 || this.threshold === null) {
      this.threshold = 2000;
      this.isThreshold = true;
    }
  }

  doUpload(begin: number, end: number, quantity: number, sheetName?: string) {
    localStorage.setItem('xfile', 'true');
    let isLast = false;
    this.sheetNames.map(x => {
      if (x.sheetName === sheetName) {
        x.uploadingStatus = true;
        let excelArray = x.valid.slice(begin, end)
        let isLast = false;
        var items = this.covertToNoKeyArray(excelArray);

        if(quantity >= x.valid.length) {
          isLast = true
        }

        console.log(`uploading rows between index: ${begin} and ${end}`, items);

        if(quantity >= x.valid.length) {
          isLast = true;
        }
        
        const apiURL = `settlements/uploads`;
        this.payvueservice.apiCall(apiURL, 'post', { pid: this.pid, filename: this.filename, processor: this.switchName, data: items, itemCount: this.valid.length, isLast })
        .then(data => {
          console.log(data, `uploaded rows between index: ${begin} and ${end}`);
          if (quantity < this.data.length) {

            begin = end;
            // this.progress =(items.length/this.progressMax)*100;
            end = begin + this.threshold
            quantity = quantity + this.threshold;
            this.doUpload(begin, end, quantity, sheetName);
          } else {
            this.toast.success(data.data.message);
            console.log('Time Taken', this.counter);
            x.uploadingStatus = false;
            this.uploadingFile = false;
            clearInterval(this.interval);
            this.counter = 0;
            localStorage.removeItem('xfile');
          }
        }).catch(error => {
          x.uploadingStatus = undefined;
          this.uploadingFile = false;
          this.toast.error('failed to upload')
          console.error(`failed to upload ${sheetName} rows between index: ${begin} and ${end}`, error);
        });
      }
    });
  }

  getHistory() {
    this.uploadHistory = [];
    this.isHistory = undefined;
    const apiURL = `settlements/uploads/?page=${this.page2}&limit=${this.limit2}&processor=${this.processor}`;
    this.payvueservice.apiCall(apiURL).then(data => {
      if (data.status === 200) {
        if (data.data.length > 0) {
          this.itemCount2 = data.itemCount;
          this.serial = 1 + (this.page - 1) * this.limit2;

          this.uploadHistory = data.data;
          this.isHistory = true;
        } else {
          this.isHistory = false;
          this.itemCount2 = 1;
        }
      } else {
        this.isHistory = false;
        this.itemCount2 = 1;
      }
    }).catch(error => {
      console.error(error);
      this.isHistory = false;
      this.itemCount2 = 1;
    });
  }


  pageChanged2(event: any): void {
    this.page2 = event.page;
    this.getHistory();
  }

  pageChanged3(event: any): void {
    const startItem = (event.page - 1) * this.limit;
    const endItem = event.page * this.limit;
    this.returnedArray = this.contentArray.slice(startItem, endItem);
    this.serial2 = 1 + (event.page - 1) * this.limit;
  }

  pageSet() {
    this.returnedArray = this.contentArray.slice(0, this.limit);
    this.serial2 = 1 + (1 - 1) * this.limit;
  }

  setPage(pageNo: number): void {
    this.page2 = pageNo;
  }

  sortBy(by: string | any): void {

    this.tableData4.sort((a: any, b: any) => {
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

  setLimit(event: any) {
    this.limit = event.target.value;
  }

  setSort(event: any) {
    this.sort = event.target.value;
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

}


