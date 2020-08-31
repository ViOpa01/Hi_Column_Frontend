import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { PayVueApiService } from '../../providers/payvue-api.service';
import { ToastService } from 'ng-uikit-pro-standard';
import eventsService from '../../providers/events.service';
import * as xlsx from 'xlsx';
import { NgForm } from '@angular/forms';

import { EXCEL_IMPORT } from "../../providers/excel-read-script";
import { EXCEL_JSON } from '../../providers/excel-json-script';
import { EXCEL_HEADERS } from '../../providers/excel-json-script';
import { WebworkerService } from "../../providers/webworker.service";
import { EXCEL_EXPORT } from "../../providers/excel-export-script";
import * as filesaver from 'file-saver'


@Component({
  selector: 'app-terminal-inventory',
  templateUrl: './terminal-inventory.component.html',
  styleUrls: ['./terminal-inventory.component.scss']
})
export class TerminalInventoryComponent implements OnInit {

  @Input('merchant') merchant: string;
  @Input() shadows = true;
  @Input('show') show = false;
  @Input('count') count: number;

  counter = 0;
  isMax: boolean;
  maxSize = 10;
  rotate = false;
  inventory: any[] = [];
  search: string = '';
  terminal: any[] = []
  organisedArray: any[] = [];
  type: string = "";
  serial_terminal: string = "";
  model: string = "";
  condition: string = "";
  isData: boolean;
  date: string;
  upload: boolean;

  title: string;


  details: any;
  
  page = 1;
  limit = 50;
  serial = 0;
  itemCount: number;
  terminals: { isMap: boolean, id: string}[] = [];

  checked: boolean;
  totalRowCount: number = 0;
  filename: string;
  isThreshold = false;

  currentSheet: string;

  headers: any;
  data: any;
  valid: any[] = [];
  invalid: any[] = [];

  progress = 0;
  progressMax = 0;
  interval;

  
  contentArray: any[] = [];
  returnedArray: any[] = [];

  limitR = 20;
  serialR = 0;

  @ViewChild('form')
  form: NgForm;
  isMore: boolean;
  isSaving: boolean;
  isSavingTerminal: boolean;

  admin: boolean;
  super: boolean;


  private sorted = false;
  constructor(private payvueservice: PayVueApiService, private webWorkerService: WebworkerService, private toast: ToastService) { }

  private EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  private EXCEL_EXTENSION = 'xlsx';

  ngOnInit() {
    this.getTerminalInventory();

    this.admin = false;
    this.super = false;
    const userStr = localStorage.getItem('user');

    const u = JSON.parse(userStr);
    if(u && u.role.toLowerCase() == 'admin') {
      
      this.admin = true;
    }
    if(u && u.role.toLowerCase() == 'super') {
      
      this.super = true;
    }

    eventsService.getEvent('TerminalInventoryPage').subscribe(page => {
      this.page = page;
      this.getTerminalInventory();
    })
  }

  map(row: any) {
    this.details = row;
  }

  addMore() {
    if (this.type && this.serial_terminal && this.model && this.condition) {
      this.organiser({ type: this.type, serial_no: this.serial_terminal, model: this.model, condition: this.condition });
    }
  }

  onClickedOutside(e, index) {
    console.log('hehrj', e.target, `pointer-${index}`)
    if (e.target.id !== `pointer-${index}`) {
      this.terminals[index].isMap = false;
    }
  }

  private organiser(item: any) {
    console.log(item.serial_terminal, 'hello')
    let obj = this.organisedArray.find(rec => (rec.serial_no === item.serial_terminal));

    if (obj) {
    console.log(obj.serial_no, 'hello')

      obj.type = item.type
      obj.model = item.model
      obj.condition = item.condition
    }
    else {
      this.organisedArray.push(item);
    }

  }

  delete(index: number) {
    this.organisedArray.splice(index, 1);
  }

  getTerminalInventory() {
    this.isData = undefined;
    this.inventory = [];
    const apiURL = `terminals/onboard?search=${this.search}&page=${this.page}&limit=${this.limit}`;
    this.payvueservice.apiCall(apiURL).then(data => {
      if(data.data.length > 0) {
        this.itemCount = data.itemCount;
        this.serial = 1 + (this.page - 1) * this.limit;
        this.inventory = data.data
        this.isData = true
        const dis = this;
        this.inventory.forEach(id => {
          dis.terminals.push({ isMap: undefined, id: "" })
        })
      }
      else {
        this.isData = false;
        this.itemCount = 1;
      }
    }).catch(error => {
      console.log(error)
      this.isData = false;
      this.itemCount = 1;
    })
  }

  save(index) {
    this.isSavingTerminal = true
    if(this.count && this.counter < this.count){
      this.counter++;

      let terminal = this.inventory.splice(index,1)[0];

      terminal.terminal_id = this.terminals[index].id
      console.log(terminal);
     this.terminal.push(terminal);
    }
    if(this.counter == this.count) {
      const event = eventsService.getEvent('terminal-inventory')
      event.emit(true);
      this.isMax = true;
      console.log("reached count");
    }

    const apiURL = `terminals/assign`;
    this.payvueservice.apiCall(apiURL, 'post', {id: this.details._id, terminal_id: this.terminals[index].id, merchant_id: this.merchant}).then(data => {
      this.toast.success(data.message)
      this.isSavingTerminal = false;
      if(!this.count) this.getTerminalInventory();
      this.isMore = undefined;
      this.terminals[index].isMap = false;
      this.terminals.splice(index,1);
    }).catch(error => {
      let errorBody = error.error
      this.toast.error(errorBody.error)
      this.isSavingTerminal = undefined;
    })
  }

  saveTerminal() {
    let multiData: any;
    this.isSaving = true;
    const apiURL = `terminals/onboard`;
    multiData = this.organisedArray
    this.payvueservice.apiCall(apiURL, 'post', { data: multiData }).then(data => {
      this.toast.success(data.message)
      this.isSaving = false;
      this.getTerminalInventory();
      this.organisedArray = [];
      this.isMore = undefined;
    }).catch(error => {
      let errorBody = error.error
      this.toast.error(errorBody.error)
      this.isSaving = undefined;
    })
  }

  pageChanged(event: any): void {
    this.page = event.page;
    this.getTerminalInventory();
  }

  sortBy(by: string | any): void {

    this.inventory.sort((a: any, b: any) => {
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

  setPage() {
    this.page = 1;
  }

  sheetNames: {
    sheetName: string;
    uploadingStatus: boolean;
    validatingStatus: boolean;
    rowCount: number;
    valid: any[];
    invalid: any[];
  }[]; /*loop this in html with showing the name of sheet and an upload button */
  uploadedWorkBook: xlsx.WorkBook;
  readingFile: boolean;
  uploadingFile: boolean;
  validatingFile: boolean;

  public readExcel(evt: any) {
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
              var rx = range.e.r - range.s.r;
              dis.totalRowCount += rx;
              dis.sheetNames.push({ sheetName: sheetName, uploadingStatus: undefined, validatingStatus: undefined, valid: undefined, invalid: undefined, rowCount: rx });
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

            let validation: boolean;
            let good = [];
            let bad = [];

            for (let j = 0; j < this.data.length; j++) {
              if (
                (this.data[j]['type']) &&
                  (this.data[j]['serial_no']) &&
                  (this.data[j]['model']) &&
                  (this.data[j]['condition'])) {

                validation = true;
              } else {
                validation = false;
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
    this.doUpload(sheetName);
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


  doUpload(sheetName?: string) {
    localStorage.setItem('xfile', 'true');
    if (this.valid.length > 0) {
      const apiURL = `terminals/onboard`;
      this.sheetNames.map(x => {
        if (x.sheetName === sheetName) {
          this.payvueservice.apiCall(apiURL, 'post', { data: this.valid })
            .then(() => {
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

            }).catch(error => {
              this.sheetNames.map(x => {
                if (x.sheetName === sheetName) {
                  x.uploadingStatus = undefined;
                }
              });
              this.uploadingFile = false;
              this.toast.error('failed to upload')
              console.error(`failed to upload ${sheetName}`, error);
            });
        }
      });
    }
  }

  loadPageData() {
    this.getTerminalInventory()
  }

  pageChangedSimple(event: any): void {
    const startItem = (event.page - 1) * this.limitR;
    const endItem = event.page * this.limitR;
    this.returnedArray = this.contentArray.slice(startItem, endItem);
    this.serialR = 1 + (event.page - 1) * this.limitR;
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
        this.save2(result, 'export', this.EXCEL_TYPE, this.EXCEL_EXTENSION);
      }
    ).catch(console.error);
  }

  private save2(file, filename, filetype, fileextension) {
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

