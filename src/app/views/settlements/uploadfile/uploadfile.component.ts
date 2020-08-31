import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';
import { PayVueApiService } from '../../../providers/payvue-api.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastService } from 'ng-uikit-pro-standard';
import { formatDate } from '@angular/common';

import * as xlsx from 'xlsx';
import * as filesaver from 'file-saver'
import { NgForm } from '@angular/forms';
import { FormCanDeactivate } from 'app/shared/FormCanDeactivate';
import { WebworkerService } from "app/providers/webworker.service";
import { SocketService } from 'app/providers/socket.service';
import eventsService from 'app/providers/events.service';
@Component({
  selector: 'app-uploadfile',
  templateUrl: './uploadfile.component.html',
  styleUrls: ['./uploadfile.component.scss']
})
export class UploadfileComponent extends FormCanDeactivate implements OnInit {
 
  @Input() shadows = false;
  switchName: string = "";
  processor: string = "";
  switchesData: any[] = [];
  switchNames: any [] = [];
  switchDetail: any;
  title: string;
  uploadPercent: number;

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
  uploading: boolean = false;
  isDeleting: any[];
  isUploading = false;
  isChecked: boolean;
  sheetCount: number;
  sheetsArray: any[] = []
  validSwitches: any[] = []


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

  @ViewChild('settlements') settlementFile: ElementRef;
  constructor(private payvueservice: PayVueApiService, private webWorkerService: WebworkerService, private toast: ToastService, private socket: SocketService) {
    super();

    this.socket.on('settlement-upload-message').subscribe(data =>{
      if (!data) return
      this.getHistory();
    })

    this.socket.on('settlement-dload-message').subscribe(data =>{ 
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
    this.payvueservice.uploadPercent.subscribe(percent => {
      this.uploadPercent = percent;
      if(this.uploadPercent == 100) {
        this.isUploading = undefined
      this.fileModel= '';
      this.sheetsArray = [];
      this.sheetCount = undefined;
      this.switchNames = [];
     
      }
    })
    this.getHistory();
    this.getSwitch();
    this.date = formatDate(new Date(), 'yyyy-MM-dd', 'en');

    eventsService.getEvent('UploadHistory').subscribe(page => {
      this.page = page;
      this.getHistory();
    })
  }

  showLoader(event: any) {
    if (event.target.nativeElement.children[0].children[0].classList.contains('check')) {
      this.visible = true;
      window.setTimeout(() => {
        this.visible = false;
      }, 2000);
    }
  }

  sheets() {
    this.sheetsArray = [];
    this.switchNames = this.switchNames.slice(0,this.sheetCount);
      for (let i = 1;i <= this.sheetCount; i++) {
        this.sheetsArray.push(i);
      } 
     
  }

  selectSwitch() {
   this.switchNames = this.switchNames.filter(item => item != 'undefined');
   this.validSwitches = this.switchNames.filter(item => item != 'ignore');
  }

  check(event:any) {
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

  getSwitchDetails(name) {
    return this.switchesData.find(item => item.name === name)
  }


  doUpload() {
    localStorage.setItem('xfile', 'true');
    this.isUploading = true
    let names = this.switchNames.join(',');
    const formData = new FormData();
    formData.append('xlsx_file',this.file);
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

  getHistory() {
    
    this.isDeleting = [];
    this.uploadHistory = [];
    this.isHistory = undefined;
    const apiURL = `settlements/uploads/?page=${this.page}&limit=${this.limit2}&processor=${this.processor}`;
    this.payvueservice.apiCall(apiURL).then(data => {
      if (data.status === 200) {
        if (data.data.length > 0) {
          this.itemCount2 = data.itemCount;
          this.serial = 1 + (this.page - 1) * this.limit2;

          this.uploadHistory = data.data;
          for(var i = 0; i < this.uploadHistory.length; i++){
            this.isDeleting.push(undefined);
          } 

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

  deleteFile(id, i) {
    console.log(id);
    const check = confirm('Do you wish to change this merchant\'s email?');
    if(!check) return;
    this.isDeleting[i] = true;
    console.log(this.isDeleting[i]);
    // return;
    const apiURL = `settlements/delete-settlement/${id}`;
    this.payvueservice.apiCall(apiURL).then(data => {
      this.toast.success(data.data);
      this.isDeleting[i] = false;
      this.getHistory();
    }).catch(error =>{
      this.toast.error('failed to delete file');
      console.log(error);
      this.isDeleting[i] = undefined;
    })

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

    this.uploadHistory.sort((a: any, b: any) => {
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
