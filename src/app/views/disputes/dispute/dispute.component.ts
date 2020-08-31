import { Component, OnInit, ElementRef, ViewChild, Input, HostListener, TemplateRef } from '@angular/core';
import { PayVueApiService } from '../../../providers/payvue-api.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastService } from 'ng-uikit-pro-standard';
import { formatDate } from '@angular/common';
import { HttpModule } from '@angular/http';

import * as xlsx from 'xlsx';
import * as moment from 'moment';
import * as filesaver from 'file-saver'
import { NgForm } from '@angular/forms';
import { FormCanDeactivate } from 'app/shared/FormCanDeactivate';
import { EXCEL_IMPORT } from "app/providers/excel-read-script";
import { EXCEL_EXPORT } from "app/providers/excel-export-script";
import { EXCEL_JSON } from 'app/providers/excel-json2-script';
import { EXCEL_HEADERS } from 'app/providers/excel-json2-script';
import { WebworkerService } from "app/providers/webworker.service";
import html2canvas from 'html2canvas';
import { SocketService } from 'app/providers/socket.service';
import eventsService from 'app/providers/events.service';
// import { UtilService } from 'app/providers/util.service';

// import jsPDF from 'jspdf';

@Component({
  selector: 'app-dispute',
  templateUrl: './dispute.component.html',
  styleUrls: ['./dispute.component.scss']
})
export class DisputeComponent extends FormCanDeactivate implements OnInit {
  @Input() shadows = false;
  totalRowCount: number = 0;
  receiptRowData;
  receiptRowDatas;
  messageRowData;

  switchName: string = "";
  switchesData: any[] = [];
  switchDetail: any;

  switchNames: any [] = [];


  is_printing: boolean;
  imgData;


  title: string;
  dispute_messages: any[] = [];


  modalRef: BsModalRef;
  isSending: boolean;


  currentSheet: string;
  date: string;
  threshold = 2000;
  isThreshold = false;
  counter = 0;
  headers: any;

  viewRowData: any;
  itemData = [];
  rotate = false;
  maxSize = 10;

  progress = 0;
  progressMax = 0;

  processor: string = "";
  processor1: string = "";
  processor2: string = "";
  processor3: string = "";
  processor4: string = "";
  processor6: string = "";

  terminal: string;
  terminal2: string;
  terminal3: string;
  terminal4: string;
  terminal5: string;
  terminal6: string;

  amount: string;
  amount2: string;
  amount3: string;
  amount4: string;
  amount5: string;
  amount6: string;

  stan: string;
  stan2: string;
  stan3: string;
  stan4: string;
  stan5: string;
  stan6: string;

  page = 1;
  page2 = 1;
  page3 = 1;
  page4 = 1;
  page5 = 1;
  page6 = 1;

  limit = 50;
  limit2 = 50;
  limit3 = 50;
  limit4 = 50;
  limit5 = 50;
  limit6 = 50;
  limitR = 50;

  serial = 0;
  serial2 = 0;
  serial3 = 0;
  serial4 = 0;
  serial5 = 0;
  serial6 = 0;
  serialR = 0;

  search: string = '';
  search2: string = '';
  search3: string = '';
  search4: string = '';
  search5: string = '';
  search6: string = '';

  itemCount: number;
  itemCount2: number;
  itemCount3: number;
  itemCount4: number;
  itemCount6: number;

  pan: string;
  pan2: string;
  pan3: string;
  pan4: string;
  pan5: string;
  pan6: string;


  dir = 'desc';
  dir2 = 'desc';
  dir3 = 'desc';
  dir4 = 'desc';
  dir5 = 'desc';
  dir6 = 'desc';

  from: string = '';
  from2: string = '';
  from3: string = '';
  from4: string = '';
  from5: string = '';
  from6: string = '';

  to: string = '';
  to2: string = '';
  to3: string = '';
  to4: string = '';
  to5: string = '';
  to6: string = '';

  data: any;
  pid: any;
  merchname: string;
  merchaccno: number;
  // merchant: string;
  // terminal: string;
  // pan: string;
  // stan: number;
  // amount: number;
  settlement: number;
  charge: number;

  unsentRecords: any[] = [];
  uIds: any[] = [];
  pendingRecords: any[] = [];
  approvedRecords: any[] = [];
  declinedRecords: any[] = [];
  notFoundRecords: any[] = [];

  contentArray: any[] = [];
  returnedArray: any[] = [];

  valid: any[] = [];
  invalid: any[] = [];
  visible = false;
  stringified: string;
  interval;
  works: any;
  tableData2: any[] = []

  validation: any;

  private sorted = false;
  isData: boolean;
  isData2: boolean;
  isData3: boolean;
  isData4: boolean;
  isData5: boolean;
  isData6: boolean;

  reading: boolean;
  uploading: boolean;
  checking: boolean;
  checked: boolean;
  correct: boolean;

  @ViewChild('form')
  form: NgForm;


  file: File;
  showResult = false; isConfirmed = false; confirmCB = false; isFile = false; isVerified = false;
  arrayBuffer: any; totalRowCnt = 0; excelArray: any;

  filename: string;

  private EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  private EXCEL_EXTENSION = 'xlsx';

  merchantU: boolean;
  user: boolean;
  admin: boolean;
  super: boolean;

  @ViewChild('settlements') settlementFile: ElementRef;
  constructor(private payvueservice: PayVueApiService, private webWorkerService: WebworkerService, private modalService: BsModalService, private toast: ToastService, private socket: SocketService) {
    super();
    this.socket.on('dispute-notify-message').subscribe(() => {
      this.loadPageData();
    })
    this.socket.on('dispute-upload-message').subscribe(() => {
      this.loadPageData();
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
    this.loadPageData();
    this.getSwitch();
    // this.util.addScript();

    eventsService.getEvent('UnsentBank').subscribe(page => {
      this.page = page;
      this.getDisputes();
    })

    eventsService.getEvent('PendingBank').subscribe(page => {
      this.page2 = page;
      this.getPending();
    })

    eventsService.getEvent('ApprovedBank').subscribe(page => {
      this.page3 = page;
      this.getApproved();
    })

    eventsService.getEvent('DeclinedBank').subscribe(page => {
      this.page4 = page;
      this.getDeclined();
    })

    eventsService.getEvent('NotFoundBank').subscribe(page => {
      this.page6 = page;
      this.getNotFound();
    })
  }

  printAll(event, data = null) {
    if (data && event) {
      this.receiptRowDatas = this.selectedDisputesIds.map(id => data.find(item => item._id == id))
      this.receiptRowDatas = this.receiptRowDatas.filter(item => item.transaction_data.rrn).sort((a: any, b: any) => {
        if (a['receiptType'] < b['receiptType']) return -1;
        if (a['receiptType'] > b['receiptType']) return 1;
        return 0;
      })

      return;
    }
    var printContents = document.getElementById('printAll').innerHTML;

    const element = document.createElement('div');
    element.style.display = 'none';
    element.innerHTML = printContents;

    document.body.append(element);

    const loader = document.createElement('i');
    loader.classList.add('fa', 'fa-spinner', 'fa-spin');
    event.target.append(loader);

    setTimeout(() => {

      document.getElementById('root').style.display = 'none';
      document.querySelector('.modal-backdrop').setAttribute('style', 'display: none')
      element.style.display = 'block';
      window.focus();
      window.print();
      document.getElementById('root').style.display = 'flex';
      document.querySelector('.modal-backdrop').setAttribute('style', 'display: block')

      element.remove();
      loader.remove();
    }, 1500)

  }

  exportAll(event) {

    const today = new Date();
    const date = today.getFullYear() + '' + (today.getMonth() + 1) + '' + today.getDate() + '_';
    const time = today.getHours() + '-' + today.getMinutes() + '-' + today.getSeconds();
    const name = `export${date}${time}.jpg`;
    this.is_printing = true;
    var printContents = document.getElementById('printAll').innerHTML;

    const element = document.createElement('div');
    element.style.display = 'none';
    element.innerHTML = printContents;

    document.body.append(element);

    const loader = document.createElement('i');
    loader.classList.add('fa', 'fa-spinner', 'fa-spin');
    event.target.append(loader);

    setTimeout(() => {

      document.getElementById('root').style.display = 'none';
      element.style.display = 'block';
      document.querySelector('.modal-backdrop').setAttribute('style', 'display: none')
      html2canvas(document.body).then((canvas) => {
        this.saveAs(canvas.toDataURL(), `${name}`)
        document.getElementById('root').style.display = 'flex';
        document.querySelector('.modal-backdrop').setAttribute('style', 'display: block')

        element.remove();
        loader.remove();
      })
    }, 1500)
  }

  saveAs(uri, filename) {

    var link = document.createElement('a');

    if (typeof link.download === 'string') {

      link.href = uri;
      link.download = filename;

      //Firefox requires the link to be in the body
      document.body.appendChild(link);

      //simulate click
      link.click();

      //remove the link when done
      document.body.removeChild(link);

    } else {

      window.open(uri);

    }
  }


  showLoader(event: any) {
    if (event.target.nativeElement.children[0].children[0].classList.contains('check')) {
      this.visible = true;
      window.setTimeout(() => {
        this.visible = false;
      }, 2000);
    }
    this.selectedDisputesIds = [];
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

  getSwitch() {
    const apiURL = `config/switch/dispute`;
    this.payvueservice.apiCall(apiURL).then(data => {
      this.switchesData = data.data

    }).catch(error =>
      {
        console.log(error)
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
    valid: any[];
    invalid: any[];
    switchDetail: any;
    switchName: any;
  }[]; /*loop this in html with showing the name of sheet and an upload button */
  uploadedWorkBook: xlsx.WorkBook;
  readingFile: boolean;
  uploadingFile: boolean;
  validatingFile: boolean;

  public readExcel(evt: any) {

    this.switchNames= [];
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
              
              dis.sheetNames.push({ sheetName: sheetName, uploadingStatus: undefined, validatingStatus: undefined, valid: undefined, invalid: undefined, switchDetail: undefined, switchName: undefined, rowCount: undefined });
            });

            this.uploadedWorkBook = result;
          }
        ).catch(console.error);
      };
      this.isThreshold = false;
      reader.readAsBinaryString(target.files[0]);
      localStorage.setItem('xfile', 'true');
    }
  }

  reset(sheetName) {
    this.sheetNames.map(x => {
      if (x.sheetName === sheetName) {
        x.validatingStatus = undefined;
        x.invalid = undefined;
        x.valid = undefined;
      }
    })
  }
  getHeaders(sheetName: string) {
    const ws: xlsx.WorkSheet = this.uploadedWorkBook.Sheets[sheetName];

    const input = {
      config: {
        body: ws,
        range: this.switchDetail
      },
      host: window.location.host,
      path: window.location.pathname,
      protocol: window.location.protocol
    };

    this.webWorkerService.run(EXCEL_HEADERS, input).then((result: any) => {
      this.headers = result;
      // console.log(this.headers);
    }).catch(console.error);
  }

  totalRowCounter() {
    const result = this.sheetNames.reduce((a, b) => ({ ...a, rowCount: (a.rowCount || 0) + (b.rowCount || 0)}));
    this.totalRowCount = result.rowCount;
  }

  validate(sheetName: string) {
    this.validatingFile = true;

    const ws: xlsx.WorkSheet = this.uploadedWorkBook.Sheets[sheetName];
    if (this.totalRowCount <= 10000) {
      this.sheetNames.map(x => {
        if (x.sheetName === sheetName) {
          x.validatingStatus = true;
              var range = xlsx.utils.decode_range(ws['!ref']);
              var rx = (range.e.r + 1) - x.switchDetail.headerRowNumber;
              x.rowCount = rx < 0 ? 0 : rx; 
          x.switchDetail = this.getSwitchDetails(x.switchName);
          this.switchDetail = x.switchDetail
        }
      })

      this.totalRowCounter();

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

            // result.pop()
            // result.pop()
            this.data = result;
            // console.log(this.data);

            let validation: boolean;
            let good = [];
            let bad = [];


            for (let j = 0; j < this.data.length; j++) {
              if (
                ((this.data[j][x.switchDetail.commonColumns.merchant_id])) &&
                ((this.data[j][x.switchDetail.commonColumns.terminal_id])) &&
                ((this.data[j][x.switchDetail.commonColumns.pan])) &&
                ((typeof (this.data[j][x.switchDetail.commonColumns.transaction_amount]) === 'number')) &&
                ((this.data[j][x.switchDetail.commonColumns.rrn])))
                {
                  if ((typeof (this.data[j][x.switchDetail.commonColumns.transaction_date]) === 'string')) {
                    this.data[j][x.switchDetail.commonColumns.transaction_date] = this.stringToSerialDateConverter(this.data[j][x.switchDetail.commonColumns.transaction_date])

                    if(Number.isNaN(this.data[j][x.switchDetail.commonColumns.transaction_date])) {
                      validation = false;
                    }
                    else {
                      validation = true;
                    }

                  }
                  else if ((typeof (this.data[j][x.switchDetail.commonColumns.transaction_date]) === 'number')) {
  
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

                if (x.valid.length > 0 && x.invalid.length == 0) {
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
    this.progressMax = this.data.length;
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

  private convertJSONKey(result: any[]) {
    const resultArray = [];
    for(const item of result) {
      const obj = {};
      for (let key in item) {
        const newKey = key.trim().replace(/\s/, '_').replace(/\//, '_').replace(/\-/, '_').replace(/\./, '').replace(/\'/, '').replace(/\#/, '').toLowerCase();
        obj[newKey] = item[key];
      }
      resultArray.push(obj);
    }
    return resultArray;
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

    const utcValue = new Date(date).getTime() / 1000;
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
    if (this.valid.length > 0) {
      this.excelArray = this.valid.slice(begin, end)

      var items = this.convertJSONKey([...this.excelArray]);

      console.log(`uploading rows between index: ${begin} and ${end}`, items);

      const apiURL = `disputes/uploads`;
      this.sheetNames.map(x => {
        if (x.sheetName === sheetName) {
          this.payvueservice.apiCall(apiURL, 'post', { pid: this.pid, filename: this.filename, processor: x.switchName, data: items, itemCount: this.valid.length })
            .then(data => {
              console.log(data, `uploaded rows between index: ${begin} and ${end}`);
              if (quantity < this.data.length) {

                begin = end;
                // this.progress =(items.length/this.progressMax)*100;
                end = begin + this.threshold
                quantity = quantity + this.threshold;
                this.doUpload(begin, end, quantity);
              } else {
                this.toast.success('Upload Successful')
                console.log('Time Taken', this.counter);
                this.form.submitted;
                this.sheetNames.map(x => {
                  if (x.sheetName === sheetName) {
                    x.uploadingStatus = false;
                  }
                });
                this.loadPageData();
                clearInterval(this.interval);
                this.counter = 0;
                localStorage.removeItem('xfile')
                this.uploadingFile = false;
              }
            }).catch(error => {
              this.sheetNames.map(x => {
                if (x.sheetName === sheetName) {
                  x.uploadingStatus = undefined;
                }
              });
              this.uploadingFile = false;
              this.toast.error('failed to upload')
              let errorBody = error.error
              console.log(errorBody);
              console.error(`failed to upload ${sheetName} rows between index: ${begin} and ${end}`, error);
            });
        }
      });

    }
  }

  getDisputes() {
    let page = this.page < 1 ? 1 : this.page
    this.unsentRecords = [];
    this.isData = undefined;
    let query = '';
    if (this.from) query += '&startdate=' + this.from;
    if (this.to) query += '&enddate=' + this.to;
     const apiURL = `disputes/unsent?limit=${this.limit}&processor=${this.processor}&page=${page}&search=${this.search}${query}`;
    this.payvueservice.apiCall(apiURL).then(data => {
      if (data.status === 200) {
        if (data.data.length > 0) {
          this.itemCount = data.itemCount;
          this.serial = 1 + (page - 1) * this.limit;

          this.unsentRecords = data.data;

          this.uIds = this.unsentRecords.map(item => item._id);
          this.isData = true;
          this.page = page;
        } else {
          this.itemCount = 1;
          this.isData = false;
        }
      } else {
          this.itemCount = 1;
          this.isData = false;
      }
    }).catch(error => {
          this.itemCount = 1;
          this.isData = false;
      console.log(error);

    });
  }

  getPending() {
    let page = this.page2 < 1 ? 1 : this.page2
    this.pendingRecords = [];
    this.isData2 = undefined;
    let query = '';
    if (this.from2) query += '&startdate=' + this.from2;
    if (this.to2) query += '&enddate=' + this.to2;
    const apiURL = `disputes/pending?limit=${this.limit2}&page=${page}&processor=${this.processor2}&search=${this.search2}${query}`;
    this.payvueservice.apiCall(apiURL).then(data => {
      if (data.status === 200) {
        if (data.data.length > 0) {
          this.itemCount2 = data.itemCount;
          this.serial2 = 1 + (page - 1) * this.limit2;
          this.pendingRecords = this.createReceiptType(data.data);
          this.isData2 = true;
          this.page2 = page
        } else {
          this.itemCount2 = 1;
          this.isData2 = false;
        }
      } else {
          this.itemCount2 = 1;
          this.isData2 = false;
      }
    }).catch(error => {
          this.itemCount2 = 1;
          this.isData2 = false;
      console.log(error);
    });
  }

  getApproved() {
    let page = this.page3 < 1 ? 1 : this.page3
    this.approvedRecords = [];
    this.isData3 = undefined;
    let query = '';
    if (this.from3) query += '&startdate=' + this.from3;
    if (this.to3) query += '&enddate=' + this.to3;
    const apiURL = `disputes/approved?limit=${this.limit3}&page=${page}&processor=${this.processor3}&search=${this.search3}${query}`;
    this.payvueservice.apiCall(apiURL).then(data => {
      if (data.status === 200) {
        if (data.data.length > 0) {
          this.itemCount3 = data.itemCount;
          this.serial3 = 1 + (page - 1) * this.limit3;

          this.approvedRecords = this.createReceiptType(data.data);
          this.isData3 = true;
          this.page3 = page;
        } else {
          this.itemCount3 = 1;
          this.isData3 = false;
        }
      } else {
          this.itemCount3 = 1;
          this.isData3 = false;
      }
    }).catch(error => {
          this.itemCount3 = 1;
          this.isData3 = false;
      console.log(error);
    });
  }

  getDeclined() {
    let page = this.page4 < 1 ? 1 : this.page4
    this.declinedRecords = [];
    this.isData4 = undefined;
    let query = '';
    if (this.from4) query += '&startdate=' + this.from4;
    if (this.to4) query += '&enddate=' + this.to4;
    const apiURL = `disputes/declined?limit=${this.limit4}&page=${page}&processor=${this.processor4}&search=${this.search4}${query}`;
    this.payvueservice.apiCall(apiURL).then(data => {
      if (data.status === 200) {
        if (data.data.length > 0) {
          this.itemCount4 = data.itemCount;
          this.serial4 = 1 + (page - 1) * this.limit4;

          this.declinedRecords = this.createReceiptType(data.data);
          this.isData4 = true;
          this.page4 = page;
        } else {
          this.itemCount4 = 1;
          this.isData4 = false;
        }
      } else {
          this.itemCount4 = 1;
          this.isData4 = false;
      }
    }).catch(error => {
          this.itemCount4 = 1;
          this.isData4 = false;
      console.log(error);
    });
  }

  getNotFound() {
    let page = this.page6 < 1 ? 1 : this.page6

    this.notFoundRecords = [];
    this.isData6 = undefined;
    let query = '';
    if (this.from6) query += '&startdate=' + this.from6;
    if (this.to6) query += '&enddate=' + this.to6;
    const apiURL = `disputes/not-found?limit=${this.limit6}&page=${page}&processor=${this.processor6}&search=${this.search6}${query}`;
    this.payvueservice.apiCall(apiURL).then(data => {
      if (data.status === 200) {
        if (data.data.length > 0) {
          this.itemCount6 = data.itemCount;
          this.serial6 = 1 + (page - 1) * this.limit6;

          this.notFoundRecords = data.data;
          this.isData6 = true;
          this.page6 = page
        } else {
          this.itemCount6 = 1;
          this.isData6 = false;
        }
      } else {
          this.itemCount6 = 1;
          this.isData6 = false;
      }
    }).catch(error => {
          this.itemCount6 = 1;
          this.isData6 = false;
      console.log(error);
    });
  }

  pageChanged(event: any): void {
    this.page = event.page;
    this.getDisputes();
  }

  pageChanged2(event: any): void {
    this.page2 = event.page;
    this.getPending();
  }

  pageChanged3(event: any): void {
    this.page3 = event.page;
    this.getApproved();
  }

  pageChanged4(event: any): void {
    this.page4 = event.page;
    this.getDeclined();
  }

  pageChanged6(event: any): void {
    this.page6 = event.page;
    this.getNotFound();
  }

  pageChangedSimple(event: any): void {
    const startItem = (event.page - 1) * this.limitR;
    const endItem = event.page * this.limitR;
    this.returnedArray = this.contentArray.slice(startItem, endItem);
    this.serialR = 1 + (event.page - 1) * this.limitR;
  }

  pageSet() {
    this.returnedArray = this.contentArray.slice(0, this.limitR);
    this.serialR = 1 + (1 - 1) * this.limitR;
  }

  sortBy(by: string | any, array): void {
    let sortingArray = []
    switch (array) {
      case 'tabUnsent':
        sortingArray = this.unsentRecords;
        break;
      case 'tabPending':
        sortingArray = this.pendingRecords;
        break;
      case 'tabApproved':
        sortingArray = this.approvedRecords;
        break;
      case 'tabDeclined':
        sortingArray = this.declinedRecords;
        break;
      case 'tabNotFound':
        sortingArray = this.notFoundRecords;
        break;
      default:
        break;
    }
    sortingArray.sort((a: any, b: any) => {
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

  setLimit2(event: any) {
    this.limit2 = event.target.value;
  }

  setLimit3(event: any) {
    this.limit3 = event.target.value;
  }

  setLimit4(event: any) {
    this.limit4 = event.target.value;
  }

  setLimit5(event: any) {
    this.limit5 = event.target.value;
  }

  setLimit6(event: any) {
    this.limit6 = event.target.value;
  }


  selectedDisputesIds: any[] = [];

  selectDisputes(isChecked, dispute, tab) {
    switch (tab) {
      case 'tabUnsent':
        this.uIds = this.unsentRecords.map(item => item._id);
        break;
      case 'tabPending':
        this.uIds = this.pendingRecords.map(item => item._id);
        break;
      case 'tabApproved':
        this.uIds = this.approvedRecords.map(item => item._id);
        break;
      case 'tabDeclined':
        this.uIds = this.declinedRecords.map(item => item._id);
        break;
      default:
        break;
    }
    if (isChecked.checked) {
      if (dispute == 'all') {

        this.selectedDisputesIds = [...this.uIds];

      } else {
        if (this.selectedDisputesIds.indexOf(dispute) > -1) {
        } else {
          this.selectedDisputesIds.push(dispute)
        }
      }

      // console.log('checkbox is checked', `item: ${dispute}`, `selected items: ${this.selectedDisputes}`, `all items: ${this.disputes}`);
    } else {
      if (dispute == 'all') {
        this.selectedDisputesIds = [];
      } else {
        const index = this.selectedDisputesIds.indexOf(dispute);
        // console.log(index)
        if (index > -1) {
          this.selectedDisputesIds.splice(index, 1);
        }
      }

      // console.log('checkbox is unchecked', `item: ${dispute}`, `selected items: ${this.selectedDisputes}`, `all items: ${this.disputes}`);
    }
    // console.log(this.selectedDisputes.length, this.uIds.length, dispute)
  }

  sendDispute() {
    this.isSending = true;
    const apiURL = `disputes/notify`;
    if (this.selectedDisputesIds.length > 0) {

      this.payvueservice.apiCall(apiURL, 'post', {
        data: this.selectedDisputesIds
      }).then(data => {
        // if (data.status == 200) {
        // setTimeout(() => {
        this.toast.success(data.data.message)

        this.selectedDisputesIds.map(id => {
          this.unsentRecords.splice(this.unsentRecords.findIndex(item => item._id == id), 1)
        })
        this.selectedDisputesIds = [];

        // this.unsentRecords.forEach(dispute => {
        //   this.unsentRecords.splice(this.unsentRecords.indexOf(dispute), 0);
        // });

        this.isSending = false;
        // this.loadPageData();
        // }, 10000);

        // }
      }).catch(error => {
        console.log(error);
        this.isSending = undefined;
      })
    }
  }

  loadPageData() {
    this.getDisputes();
    this.getApproved();
    this.getPending();
    this.getDeclined();
    this.getNotFound();

    // this.getHistory();
    this.date = formatDate(new Date(), 'yyyy-MM-dd', 'en');
  }

  getData(dispute_messages) {
    this.dispute_messages = dispute_messages;
    return this.dispute_messages
  }

  setPage(page: number): void {

    switch (page) {
      case 1:
        this.page = 1;
        break;
      case 2:
        this.page2 = 1;
        break;
      case 3:
        this.page3 = 1;
        break;
      case 4:
        this.page4 = 1;
        break;
      case 5:
        this.page5 = 1;
        break;
      case 6:
        this.page6 = 1;
        break;
      default:
        break;
    }
  }

  createReceiptType(data) {
    const result = data.map(item => {
      let receiptType = '';

      if (item.transaction_data.category == 'VICEBANKING') receiptType = 'purchase';
      if (`${item.transaction_data.accountType}`.toLowerCase() == 'postpaid' || item.transaction_data.type == 'postpaid' || item.transaction_data.productType == 'postpaid') receiptType = 'postpaid'
      if (item.transaction_data.token && item.transaction_data.category !== 'Internet') receiptType = 'token'
      if (item.transaction_data.category == 'Airtime' || item.transaction_data.category == 'TV' || item.transaction_data.category == 'Internet') receiptType = 'small';
      item.receiptType = receiptType;
      return item;
    })
    return result;
  }

  isReceiptType(data, type) {

    if (type == 'purchase') {
      return data.transaction_data.category == 'VICEBANKING';
      // return true;

    }
    if (type == 'postpaid') {
      if (data.transaction_data.accountType) {
        let lower = (data.transaction_data.accountType).toLowerCase();
        return lower == 'postpaid';
      }
      else {
        return data.transaction_data.type == 'postpaid' || data.transaction_data.productType == 'postpaid';
      }

      // return true;
    }
    if (type == 'token' && data.transaction_data.category !== 'Internet') {
      return !!data.transaction_data.token;
    }
    if (type == 'small') {
      return data.transaction_data.category == 'Airtime' || data.transaction_data.category == 'TV' || data.transaction_data.category == 'Internet';
    }
  }

}