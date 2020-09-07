import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { PayVueApiService } from 'app/providers/payvue-api.service';
import { ToastService } from 'ng-uikit-pro-standard';

import * as xlsx from 'xlsx';
import * as filesaver from 'file-saver'
import { NgForm } from '@angular/forms';
import { EXCEL_IMPORT } from "app/providers/excel-read-script";
import { EXCEL_EXPORT } from "app/providers/excel-export-script";
import { EXCEL_JSON } from 'app/providers/excel-json-script';
import { EXCEL_HEADERS } from 'app/providers/excel-json-script';
import { WebworkerService } from "app/providers/webworker.service";
import eventsService from 'app/providers/events.service';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  @Input() shadows = false;
  fileType: string = "";
  switchesData: any[] = [];
  switchesDisputeData: any[] = [];
  terminalFilesData: any[] = [];

  allMSC: boolean;
  switchDetail: any;
  switchDetailDispute: any;
  terminalFileDetail: any;

  totalRowCount: number = 0;
  merchant: string = "";
  email: any[] = [3]
  frequency: number = 2;
  notification: any[] = [];
  mAccount: string;
  config: any;

  isSaving: boolean;
  accountSaving: boolean;
  onlineSaving: boolean;
  activeSaving: boolean;
  switchSaving: boolean;
  switchUpdating: boolean;
  switchDeleting: boolean;
  switchSavingDispute: boolean;
  switchUpdatingDispute: boolean;
  switchDeletingDispute: boolean;
  switchSavingTrans: boolean;
  switchUpdatingTrans: boolean;
  switchDeletingTrans: boolean;
  terminalSaving: boolean
  terminalUpdating: boolean
  terminalDeleting: boolean

  emailSaving: any[] = [3];
  emailDeleting: boolean;

  rotate = false;
  maxSize = 10;
  account: string;
  page = 1;
  limit = 20;
  limitR = 20;

  itemCount: number;
  serial = 0;
  serialR = 0;
  isData: boolean;

  @ViewChild('form')
  form: NgForm;
  isMore: boolean;

  reading: boolean;
  uploading: boolean;
  checking: boolean;
  checked: boolean;
  correct: boolean;

  errorPOS: any[] = [2];
  errorTerminal: string;
  errorTerminalEdit: string;
  errorOnline: string;
  errorActive: string;
  errorSwitch: string;
  errorSwitchEdit: string;
  errorSwitchDispute: string;
  errorSwitchEditDispute: string;
  errorSwitchTrans: string;
  errorSwitchEditTrans: string;

  headers: any;
  data: any;
  valid: any[] = [];
  invalid: any[] = [];

  progress = 0;
  progressMax = 0;
  interval;

  contentArray: any[] = [];
  returnedArray: any[] = [];

  currentSheet: string;
  threshold = 2000;
  isThreshold = false;
  counter = 0;

  file: File;
  showResult = false; isConfirmed = false; confirmCB = false; isFile = false; isVerified = false;
  arrayBuffer: any; totalRowCnt = 0; excelArray: any;

  filename: string;

  title: string;

  private EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  private EXCEL_EXTENSION = 'xlsx';

  merchantU: boolean;
  isSuperMerchant: boolean;
  user: boolean;
  admin: boolean;
  super: boolean;

  emails: {
    email: string;
    deletingStatus: boolean;
    type: string;
  }[];

  hours: number;
  minutes: number;
  seconds: number;

  daysActive: number;
  hoursActive: number;
  minutesActive: number;
  secondsActive: number;

  emailArray: any[] = [3];
  savingPOS: any[] = [2];

  //settlememt
  headersArray: any[] = [];
  switchName: string = "";
  switchStart: number = 1;
  switchHeaders: string = "";
  terminalHeader: string = "";
  dateHeader: string = "";
  merchantHeader: string = "";
  rrnHeader: string = "";
  nameHeader: string = "";
  accountHeader: string = "";
  panHeader: string = "";
  transHeader: string = "";
  settlementHeader: string = "";
  chargeHeader: string = "";

  headersArrayEdit: any[] = [];
  switchNameEdit: string = "";
  switchStartEdit: number = 1;
  switchHeadersEdit: string = "";
  terminalHeaderEdit: string = "";
  dateHeaderEdit: string = "";
  merchantHeaderEdit: string = "";
  rrnHeaderEdit: string = "";
  nameHeaderEdit: string = "";
  accountHeaderEdit: string = "";
  panHeaderEdit: string = "";
  transHeaderEdit: string = "";
  settlementHeaderEdit: string = "";
  chargeHeaderEdit: string = "";

  //dispute
  headersArrayDispute: any[] = [];
  switchNameDispute: string = "";
  switchStartDispute: number = 1;
  switchHeadersDispute: string = "";
  terminalHeaderDispute: string = "";
  dateHeaderDispute: string = "";
  merchantHeaderDispute: string = "";
  rrnHeaderDispute: string = "";
  stanHeaderDispute: string = "";
  panHeaderDispute: string = "";
  transHeaderDispute: string = "";

  headersArrayEditDispute: any[] = [];
  switchNameEditDispute: string = "";
  switchStartEditDispute: number = 1;
  switchHeadersEditDispute: string = "";
  terminalHeaderEditDispute: string = "";
  dateHeaderEditDispute: string = "";
  merchantHeaderEditDispute: string = "";
  rrnHeaderEditDispute: string = "";
  stanHeaderEditDispute: string = "";
  panHeaderEditDispute: string = "";
  transHeaderEditDispute: string = "";

  //trans
  headersArrayTrans: any[] = [];
  switchNameTrans: string = "";
  switchStartTrans: number = 1;
  switchHeadersTrans: string = "";
  terminalHeaderTrans: string = "";
  dateHeaderTrans: string = "";
  merchantHeaderTrans: string = "";
  rrnHeaderTrans: string = "";
  nameHeaderTrans: string = "";
  panHeaderTrans: string = "";
  transHeaderTrans: string = "";
  stanHeaderTrans: string = "";
  reasonHeaderTrans: string = "";
  responseHeaderTrans: string = "";
  addressHeaderTrans: string = "";

  headersArrayEditTrans: any[] = [];
  switchNameEditTrans: string = "";
  switchStartEditTrans: number = 1;
  switchHeadersEditTrans: string = "";
  terminalHeaderEditTrans: string = "";
  dateHeaderEditTrans: string = "";
  merchantHeaderEditTrans: string = "";
  rrnHeaderEditTrans: string = "";
  nameHeaderEditTrans: string = "";
  panHeaderEditTrans: string = "";
  transHeaderEditTrans: string = "";
  stanHeaderEditTrans: string = "";
  reasonHeaderEditTrans: string = "";
  responseHeaderEditTrans: string = "";
  addressHeaderEditTrans: string = "";

  //Terminal
  terminalFileHeadersArray: any[] = [];
  terminalFile: string = "";
  terminalFileStart: number = 1;
  terminalFileHeaders: string = "";
  merchantHeaderTerminalFile: string = "";
  nameHeaderTerminalFile: string = "";
  terminalHeaderTerminalFile: string = "";
  contactHeaderTerminalFile: string = "";
  phoneHeaderTerminalFile: string = "";
  emailHeaderTerminalFile: string = "";
  addressHeaderTerminalFile: string = "";
  accountHeaderTerminalFile: string = "";
  ptspHeaderTerminalFile: string = "";
  dTypeHeaderTerminalFile: string = "";
  dNameHeaderTerminalFile: string = "";
  dSerialHeaderTerminalFile: string = "";
  appNameHeaderTerminalFile: string = "";
  appVersionHeaderTerminalFile: string = "";
  networkHeaderTerminalFile: string = "";
  accountNameHeaderTerminalFile: string = "";
  bankCodeHeaderTerminalFile: string = "";
  mccHeaderTerminalFile: string = "";
  stateCodeHeaderTerminalFile: string = "";
  lgaHeaderTerminalFile: string = "";
  branchHeaderTerminalFile: string = "";
  categoryHeaderTerminalFile: string = "";

  terminalFileHeadersArrayEdit: any[] = [];
  terminalFileEdit: string = "";
  terminalFileStartEdit: number = 1;
  terminalFileHeadersEdit: string = "";
  merchantHeaderTerminalFileEdit: string = "";
  nameHeaderTerminalFileEdit: string = "";
  terminalHeaderTerminalFileEdit: string = "";
  contactHeaderTerminalFileEdit: string = "";
  phoneHeaderTerminalFileEdit: string = "";
  emailHeaderTerminalFileEdit: string = "";
  addressHeaderTerminalFileEdit: string = "";
  accountHeaderTerminalFileEdit: string = "";
  ptspHeaderTerminalFileEdit: string = "";
  dTypeHeaderTerminalFileEdit: string = "";
  dNameHeaderTerminalFileEdit: string = "";
  dSerialHeaderTerminalFileEdit: string = "";
  appNameHeaderTerminalFileEdit: string = "";
  appVersionHeaderTerminalFileEdit: string = "";
  networkHeaderTerminalFileEdit: string = "";
  accountNameHeaderTerminalFileEdit: string = "";
  bankCodeHeaderTerminalFileEdit: string = "";
  mccHeaderTerminalFileEdit: string = "";
  stateCodeHeaderTerminalFileEdit: string = "";
  lgaHeaderTerminalFileEdit: string = "";
  branchHeaderTerminalFileEdit: string = "";
  categoryHeaderTerminalFileEdit: string = "";

  bLess: number;
  nLess: number;

  isUploading: boolean;
  uploadPercent: number;
  isChecked: boolean;
  fileModel: any;

  printer: boolean;
  lastSeen: boolean;

  nDays: number;
  supportSave: boolean;

  constructor(private payvueservice: PayVueApiService, private webWorkerService: WebworkerService, private toast: ToastService) {
    const userStr = localStorage.getItem('user');

    const u = JSON.parse(userStr);

    if (u && u.role.toLowerCase() == 'merchant') {

      this.merchantU = false;

      if(u && u.isSuperMerchant) {

        this.isSuperMerchant = true
      }
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
      if (this.uploadPercent == 100) {
        this.isUploading = undefined
        this.fileModel = '';
        this.fileType = '';
      }
    })

    for (let i = 0; i < this.emailSaving.length; i++) {
      this.emailSaving[i] = undefined;
    }
    for (let i = 0; i < this.savingPOS.length; i++) {
      this.savingPOS[i] = undefined;
    }
    for (let i = 0; i < this.errorPOS.length; i++) {
      this.errorPOS[i] = "";
    }
    for (let i = 0; i < this.email.length; i++) {
      this.email[i] = "";
    }

    this.getNotification()
    this.getConfig();
    this.getSwitch();
    this.getDisputeSwitch();
    this.getTerminalFile();
  }

  delete(index: number) {
    this.organisedArray.splice(index, 1);
  }

  setStatus(event,type){
    if(type == 'printer') {
      this.printer = event.srcElement.checked
    }
    if(type == 'lastSeen') {
      this.lastSeen = event.srcElement.checked

      if(!this.lastSeen) {
        this.nDays = null;
      }
    }
  }

  saveMSC(){
    
  }

  autoSupport() {
    this.supportSave = true;
    const apiURL = `config`;
    this.payvueservice.apiCall(apiURL,'post', {notify_bad_printer: this.printer, notify_inactive_terminal : this.lastSeen, notify_inactive_terminal_days: this.nDays }).then(data =>  {
      this.toast.success(data.message)
      this.supportSave = false;
      this.getConfig();
    }).catch(error => {
      let errorBody = error.error
      this.toast.error(errorBody.error)
      this.supportSave = undefined;
    })

  }
  getNotification() {
    this.notification = [];
    this.isData = undefined;
    const apiURL = `config/settlements?page=${this.page}&limit=${this.limit}`;
    this.payvueservice.apiCall(apiURL).then(data => {
      if (data.data.length > 0) {
        this.notification = data.data;
        this.itemCount = data.itemCount;
        this.isData = true;
      }
      else {
        this.isData = false;
        this.itemCount = 1;
      }

    }).catch(error => {
      console.error(error);
      this.isData = false;
      this.itemCount = 1;
    });
  }

  getConfig() {
    const apiURL = `config`;
    this.emails = [];
    this.payvueservice.apiCall(apiURL).then(data => {
      this.config = data.data

      let online = this.formatConverter(this.config.online_terminal_seconds);
      this.hours = online.h;
      this.minutes = online.m;
      this.seconds = online.s;

      let active = this.formatConverter(this.config.active_terminal_seconds);
      this.daysActive = active.d;
      this.hoursActive = active.h;
      this.minutesActive = active.m;
      this.secondsActive = active.s;

      this.emailArray[0] = this.config.sd_advice_emails || [];
      this.emailArray[1] = [];
      this.emailArray[2] = this.config['pos_support'] || [];

      this.bLess = this.config.low_battery_level
      this.nLess = this.config.low_network_level

      this.printer = this.config.notify_bad_printer
      this.lastSeen = this.config.notify_inactive_terminal
      this.nDays = this.config.notify_inactive_terminal_days

      const dis = this;

      this.emailArray[0].forEach(email => {
        dis.emails.push({ email: email, deletingStatus: undefined, type: 'same-day' })
      })

      this.emailArray[1].forEach(email => {
        dis.emails.push({ email: email, deletingStatus: undefined, type: 'merchant' })
      })

      this.emailArray[2].forEach(email => {
        dis.emails.push({ email: email, deletingStatus: undefined, type: 'support' })
      })
    }).catch(error => {
      console.log(error)
    })
  }

  getSwitch() {
    const apiURL = `config/switch/settlement`;
    this.payvueservice.apiCall(apiURL).then(data => {

      if (data.data.length > 0) {
        this.switchesData = data.data;
      }

    }).catch(error => {
      console.error(error);
    });
  }

  getDisputeSwitch() {
    const apiURL = `config/switch/dispute`;
    this.payvueservice.apiCall(apiURL).then(data => {

      if (data.data.length > 0) {
        this.switchesDisputeData = data.data;
      }

    }).catch(error => {
      console.error(error);
    });
  }

  getTerminalFile() {
    const apiURL = `config/switch/terminal`;
    this.payvueservice.apiCall(apiURL).then(data => {

      if (data.data.length > 0) {
        this.terminalFilesData = data.data;
      }

    }).catch(error => {
      console.error(error);
    });
  }

  getSwitchDetails(name) {
    this.switchDetail = this.switchesData.find(item => item.name === name)
    if (this.switchDetail) {
      this.switchStartEdit = this.switchDetail.headerRowNumber;
      this.switchHeadersEdit = this.switchDetail.rawColumns.join()
      this.merchantHeaderEdit = this.switchDetail.commonColumns.merchant_id;
      this.terminalHeaderEdit = this.switchDetail.commonColumns.terminal_id;
      this.dateHeaderEdit = this.switchDetail.commonColumns.transaction_date;
      this.rrnHeaderEdit = this.switchDetail.commonColumns.rrn;
      this.nameHeaderEdit = this.switchDetail.commonColumns.merchant_name || "";
      this.accountHeaderEdit = this.switchDetail.commonColumns.merchant_account_nr;
      this.panHeaderEdit = this.switchDetail.commonColumns.pan;
      this.transHeaderEdit = this.switchDetail.commonColumns.transaction_amount;
      this.settlementHeaderEdit = this.switchDetail.commonColumns.settlement_amount;
      this.chargeHeaderEdit = this.switchDetail.commonColumns.charge || "";
    }
    else {
      this.switchStartEdit = 1;
      this.switchHeadersEdit = "";
      this.merchantHeaderEdit = "";
      this.terminalHeaderEdit = "";
      this.dateHeaderEdit = "";
      this.rrnHeaderEdit = "";
      this.nameHeaderEdit = "";
      this.accountHeaderEdit = "";
      this.panHeaderEdit = "";
      this.transHeaderEdit = "";
      this.settlementHeaderEdit = "";
      this.chargeHeaderEdit = "";
    }
  }

  getDisputeSwitchDetails(name) {
    this.switchDetailDispute = this.switchesDisputeData.find(item => item.name === name)
    if (this.switchDetailDispute) {
      this.switchStartEditDispute = this.switchDetailDispute.headerRowNumber;
      this.switchHeadersEditDispute = this.switchDetailDispute.rawColumns.join()
      this.merchantHeaderEditDispute = this.switchDetailDispute.commonColumns.merchant_id;
      this.terminalHeaderEditDispute = this.switchDetailDispute.commonColumns.terminal_id
      this.dateHeaderEditDispute = this.switchDetailDispute.commonColumns.transaction_date
      this.rrnHeaderEditDispute = this.switchDetailDispute.commonColumns.rrn
      this.stanHeaderEditDispute = this.switchDetailDispute.commonColumns.stan || "";
      this.panHeaderEditDispute = this.switchDetailDispute.commonColumns.pan
      this.transHeaderEditDispute = this.switchDetailDispute.commonColumns.transaction_amount
    }
    else {
      this.switchStartEditDispute = 1;
      this.switchHeadersEditDispute = "";
      this.merchantHeaderEditDispute = "";
      this.terminalHeaderEditDispute = "";
      this.dateHeaderEditDispute = "";
      this.rrnHeaderEditDispute = "";
      this.stanHeaderEditDispute = "";
      this.panHeaderEditDispute = "";
      this.transHeaderEditDispute = "";
    }

  }

  getTerminalsDetails(name) {
    this.terminalFileDetail = this.terminalFilesData.find(item => item.name === name)
    if (this.terminalFileDetail) {
      this.terminalFileStartEdit = this.terminalFileDetail.headerRowNumber;
      this.terminalFileHeadersEdit = this.terminalFileDetail.rawColumns.join()
      this.merchantHeaderTerminalFileEdit = this.terminalFileDetail.commonColumns.merchant_id;
      this.nameHeaderTerminalFileEdit = this.terminalFileDetail.commonColumns.merchant_name;
      this.terminalHeaderTerminalFileEdit = this.terminalFileDetail.commonColumns.terminal_id;
      this.contactHeaderTerminalFileEdit = this.terminalFileDetail.commonColumns.merchant_contact;
      this.phoneHeaderTerminalFileEdit = this.terminalFileDetail.commonColumns.merchant_phone;
      this.emailHeaderTerminalFileEdit = this.terminalFileDetail.commonColumns.merchant_email;
      this.addressHeaderTerminalFileEdit = this.terminalFileDetail.commonColumns.merchant_address;
      this.accountHeaderTerminalFileEdit = this.terminalFileDetail.commonColumns.merchant_account_nr;
      this.ptspHeaderTerminalFileEdit = this.terminalFileDetail.commonColumns.ptsp;
      this.dTypeHeaderTerminalFileEdit = this.terminalFileDetail.commonColumns.device_type;
      this.dNameHeaderTerminalFileEdit = this.terminalFileDetail.commonColumns.device_name;
      this.dSerialHeaderTerminalFileEdit = this.terminalFileDetail.commonColumns.serial;
      this.appNameHeaderTerminalFileEdit = this.terminalFileDetail.commonColumns.app_name;
      this.appVersionHeaderTerminalFileEdit = this.terminalFileDetail.commonColumns.app_version;
      this.networkHeaderTerminalFileEdit = this.terminalFileDetail.commonColumns.network_type;
      this.accountNameHeaderTerminalFileEdit = this.terminalFileDetail.commonColumns.merchant_account_name;
      this.bankCodeHeaderTerminalFileEdit = this.terminalFileDetail.commonColumns.bank_code;
      this.mccHeaderTerminalFileEdit = this.terminalFileDetail.commonColumns.mcc;
      this.stateCodeHeaderTerminalFileEdit = this.terminalFileDetail.commonColumns.state_code;
      this.lgaHeaderTerminalFileEdit = this.terminalFileDetail.commonColumns.lga;
      this.branchHeaderTerminalFileEdit = this.terminalFileDetail.commonColumns.bank_branch;
      this.categoryHeaderTerminalFileEdit = this.terminalFileDetail.commonColumns.category;
    }
    else {
      this.terminalFileStartEdit = 1;
      this.terminalFileHeadersEdit = "";
      this.merchantHeaderTerminalFileEdit = "";
      this.nameHeaderTerminalFileEdit = ""
      this.terminalHeaderTerminalFileEdit = "";
      this.contactHeaderTerminalFileEdit = "";
      this.phoneHeaderTerminalFileEdit = "";
      this.emailHeaderTerminalFileEdit = "";
      this.addressHeaderTerminalFileEdit = "";
      this.accountHeaderTerminalFileEdit = "";
      this.ptspHeaderTerminalFileEdit = "";
      this.dTypeHeaderTerminalFileEdit = "";
      this.dNameHeaderTerminalFileEdit = "";
      this.dSerialHeaderTerminalFileEdit = "";
      this.appNameHeaderTerminalFileEdit = "";
      this.appVersionHeaderTerminalFileEdit = "";
      this.networkHeaderTerminalFileEdit = "";
      this.accountNameHeaderTerminalFileEdit = "";
      this.bankCodeHeaderTerminalFileEdit = "";
      this.mccHeaderTerminalFileEdit = "";
      this.stateCodeHeaderTerminalFileEdit = "";
      this.lgaHeaderTerminalFileEdit = "";
      this.branchHeaderTerminalFileEdit = "";
      this.categoryHeaderTerminalFileEdit = "";

    }
  }

  splitHeaders(header) {
    return header.split(',').map(item => item.trim()).filter(item => item);
  }

  saveNotification() {
    let multiData: any;
    this.isSaving = true;
    const apiURL = `config/settlements`;
    multiData = this.organisedArray.map(rec => {
      const item = { ...rec }
      item.merchant_id = item.merchant_id.join(' ');
      item.settlement_count = item.frequency;
      delete item.frequency;
      return item;
    })

    this.payvueservice.apiCall(apiURL, 'post', { data: multiData }).then(data => {
      this.toast.success(data.message)
      this.isSaving = false;
      this.getNotification();
      this.organisedArray = [];
      this.isMore = undefined;
    }).catch(error => {
      let errorBody = error.error
      this.toast.error(errorBody.error)
      this.isSaving = undefined;
    })
  }

  saveAccount() {
    this.accountSaving = true;
    const apiURL = `config/settlement-bank-account`;
    this.payvueservice.apiCall(apiURL, 'post', { account_no: this.account }).then(data => {
      this.toast.success(data.message);
      this.accountSaving = false;
      this.getConfig();
    }).catch(error => {
      let errorBody = error.error
      this.toast.error(errorBody.error)
      this.accountSaving = undefined;
    })
  }

  timeConverter(hours = 0, minutes = 0, seconds = 0, days = 0) {
    var cm;
    var tseconds;
    if ((days && isNaN(days)) || (hours && isNaN(hours)) || (minutes && isNaN(minutes)) || (seconds && isNaN(seconds))) {
      alert("Please enter numbers only");
      return false;
    }
    cm = days * (60 * 60 * 24) + hours * (60 * 60) + minutes * 60 + seconds * 1;
    tseconds = cm;

    return tseconds
  }

  formatConverter(seconds) {
    seconds = Number(seconds);
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor(seconds % (3600 * 24) / 3600);
    const m = Math.floor(seconds % 3600 / 60);
    const s = Math.floor(seconds % 60);

    return { d, h, m, s };
  }

  savePOS(type) {
    if (type == 'battery') {
      this.savingPOS[0] = true;
      if (this.bLess < 1 || this.bLess > 99) { this.savingPOS[0] = false; return this.errorPOS[0] = "Battery Level Value; Min: 1 percent; Max: 99 percent" }

      if (this.bLess == undefined) {
        this.savingPOS[0] = false;
        return this.errorPOS[0] = "Please enter valid value into the box";
      }

      this.errorPOS[0] = ''
      const apiURL = `config`
      this.payvueservice.apiCall(apiURL, 'post', { low_battery_level: this.bLess }).then(data => {
        this.toast.success(data.message);
        this.savingPOS[0] = false;
        this.getConfig();
      }).catch(error => {
        let errorBody = error.error
        this.toast.error(errorBody.error)
        this.savingPOS[0] = undefined;
      })
    }
    if (type == 'network') {
      this.savingPOS[1] = true;
      if (this.nLess < 1 || this.nLess > 99) { this.savingPOS[1] = false; return this.errorPOS[1] = "Network Level Value; Min: 1 percent; Max: 99 percent" }

      if (this.nLess == undefined) {

        this.savingPOS[1] = false;
        return this.errorPOS[1] = "Please enter valid value into the box";
      }

      this.errorPOS[1] = ''
      const apiURL = `config`
      this.payvueservice.apiCall(apiURL, 'post', { low_network_level: this.nLess }).then(data => {
        this.toast.success(data.message);
        this.savingPOS[1] = false;
        this.getConfig();
      }).catch(error => {
        let errorBody = error.error
        this.toast.error(errorBody.error)
        this.savingPOS[1] = undefined;
      })
    }
  }

  saveOnline() {
    this.onlineSaving = true;
    let time = this.timeConverter(this.hours, this.minutes, this.seconds)
    if (23 < this.hours || this.hours < 0) { this.onlineSaving = false; return this.errorOnline = "Max: 23 hours" }
    if (59 < this.minutes || this.minutes < 0) { this.onlineSaving = false; return this.errorOnline = "Max: 59 minutes" }
    if (59 < this.seconds || this.seconds < 0) { this.onlineSaving = false; return this.errorOnline = "Max: 59 seconds" }
    if (time == 0) {
      this.errorOnline = "Please enter valid values into the boxes";
      this.onlineSaving = false;
      return false;
    } else if (this.hours == undefined || this.minutes == undefined || this.seconds == undefined) {
      this.errorOnline = "Please enter valid values into the boxes";
      this.onlineSaving = false;
      return false;
    }
    this.errorOnline = '';
    const apiURL = `config/online-terminal-time`
    this.payvueservice.apiCall(apiURL, 'post', { online_seconds: time }).then(data => {
      this.toast.success(data.message);
      this.onlineSaving = false;
      this.getConfig();
    }).catch(error => {
      let errorBody = error.error
      this.toast.error(errorBody.error)
      this.onlineSaving = undefined;
    })
  }

  saveActive() {
    this.activeSaving = true;
    let time = this.timeConverter(this.hoursActive, this.minutesActive, this.secondsActive, this.daysActive);
    if (100 < this.daysActive || this.daysActive < 0) { this.activeSaving = false; return this.errorActive = 'Max: 100 days' }
    if (23 < this.hoursActive || this.hoursActive < 0) { this.activeSaving = false; return this.errorActive = "Max: 23 hours" }
    if (59 < this.minutesActive || this.minutesActive < 0) { this.activeSaving = false; return this.errorActive = "Max: 59 minutes" }
    if (59 < this.secondsActive || this.secondsActive < 0) { this.activeSaving = false; return this.errorActive = "Max: 59 seconds" }
    if (time == 0) {
      this.errorActive = "Please enter valid values into the boxes";
      this.activeSaving = false;
      return false;
  } else if (this.hoursActive == undefined || this.minutesActive == undefined || this.secondsActive == undefined || this.daysActive == undefined ) {
      this.errorActive = "Please enter valid values into the boxes";
      this.activeSaving = false;
      return false;
    }
    this.errorActive = ""
    const apiURL = `config/active-terminal-time`
    this.payvueservice.apiCall(apiURL, 'post', { active_seconds: time }).then(data => {
      this.toast.success(data.message);
      this.activeSaving = false;
      this.getConfig();
    }).catch(error => {
      let errorBody = error.error
      this.toast.error(errorBody.error)
      this.activeSaving = undefined;
    })
  }

  saveEmail(type: string) {
    if (type == "same-day") {
      this.emailSaving[0] = true;
      const apiURL = `config/sd-advice-email`
      this.payvueservice.apiCall(apiURL, 'post', { email: this.email[0] }).then(data => {
        this.toast.success(data.message);
        if (data.error) this.toast.error(data.error);
        this.emailSaving[0] = false;
        this.emailArray[0] = data.data.sd_advice_emails;

        let email2
        email2 = this.emails.filter((item) => {
          if (item.type !== 'same-day') {
            return item
          }
        })

        this.emails = [...email2];

        const dis = this;
        this.emailArray[0].forEach(email => {
          dis.emails.push({ email: email, deletingStatus: undefined, type: 'same-day' })
        })

      }).catch(error => {
        console.log(error)
        let errorBody;
        if (error.error) {
          errorBody = error.error
          this.toast.error(errorBody.error)
        } else {
          this.toast.error(error.message)
        }
        this.emailSaving[0] = undefined;
      })
    }

    if (type == "merchant") {
      this.emailSaving[1] = true;
      const apiURL = `config/sd-advice-email`
      this.payvueservice.apiCall(apiURL, 'post', { email: this.email[1] }).then(data => {
        this.toast.success(data.message);
        if (data.error) this.toast.error(data.error);
        this.emailSaving[1] = false;
        this.emailArray[1] = [];

        // this.emails = [];
        let email2
        email2 = this.emails.filter((item) => {
          if (item.type !== 'merchant') {
            return item
          }
        })

        this.emails = [...email2];

        const dis = this;
        this.emailArray[1].forEach(email => {
          dis.emails.push({ email: email, deletingStatus: undefined, type: 'merchant' })
        })

      }).catch(error => {
        let errorBody = error.error
        if (errorBody.error) {
          this.toast.error(errorBody.error)
        } else {
          this.toast.error(error.message)
        }
        this.emailSaving[1] = undefined;
      })
    }

    if (type == "support") {
      this.emailSaving[2] = true;
      const apiURL = `config/set-email/pos_support`
      this.payvueservice.apiCall(apiURL, 'post', { email: this.email[2] }).then(data => {
        this.toast.success(data.message);
        if (data.error) this.toast.error(data.error);
        this.emailSaving[2] = false;
        this.emailArray[2] = data.data.this.config['pos_support'];

        // this.emails = [];
        let email2
        email2 = this.emails.filter((item) => {
          if (item.type !== 'support') {
            return item
          }
        })

        this.emails = [...email2];

        const dis = this;
        this.emailArray[2].forEach(email => {
          dis.emails.push({ email: email, deletingStatus: undefined, type: 'support' })
        })

      }).catch(error => {
        let errorBody = error.error
        if (errorBody.error) {
          this.toast.error(errorBody.error)
        } else {
          this.toast.error(error.message)
        }
        this.emailSaving[2] = undefined;
      })
    }
  }

  deleteEmail(email, type) {
    this.emails.map(x => {
      if (x.email === email && type === 'same-day' && x.type === type) {
        x.deletingStatus = true;
        const apiURL = `config/sd-advice-email/${email}`
        this.payvueservice.apiCall(apiURL, 'delete').then(data => {
          this.toast.success(data.message);
          if (data.error) this.toast.error(data.error);
          x.deletingStatus = false;
          this.emailArray[0] = data.data.sd_advice_emails

          // this.emails = [];
          let email2
          email2 = this.emails.filter((item) => {
            if (item.type !== 'same-day') {
              return item
            }
          })

          this.emails = [...email2];
          const dis = this;
          this.emailArray[0].forEach(email => {
            dis.emails.push({ email: email, deletingStatus: undefined, type: 'same-day' })

          })
        }).catch(error => {
          let errorBody = error.error
          if (errorBody.error) {
            this.toast.error(errorBody.error)
          } else {
            this.toast.error(error.message)
          }
          x.deletingStatus = undefined;
        })
      }

      if (x.email === email && type === 'merchant' && x.type === type) {
        x.deletingStatus = true;
        const apiURL = `config/sd-advice-email/${email}`
        this.payvueservice.apiCall(apiURL, 'delete').then(data => {
          this.toast.success(data.message);
          if (data.error) this.toast.error(data.error);
          x.deletingStatus = false;
          this.emailArray[1] = []

          // this.emails = [];
          let email2
          email2 = this.emails.filter((item) => {
            if (item.type !== 'merchant') {
              return item
            }
          })

          this.emails = [...email2];

          const dis = this;
          this.emailArray[1].forEach(email => {
            dis.emails.push({ email: email, deletingStatus: undefined, type: 'merchant' })
          })
        }).catch(error => {
          let errorBody = error.error
          if (errorBody.error) {
            this.toast.error(errorBody.error)
          } else {
            this.toast.error(error.message)
          }
          x.deletingStatus = undefined;
        })
      }

      if (x.email === email && type === 'support' && x.type === type) {
        x.deletingStatus = true;
        const apiURL = `config/set-email/${email}`
        this.payvueservice.apiCall(apiURL, 'delete').then(data => {
          this.toast.success(data.message);
          if (data.error) this.toast.error(data.error);
          x.deletingStatus = false;
          this.emailArray[2] = data.data.this.config['pos_support']

          // this.emails = [];
          let email2
          email2 = this.emails.filter((item) => {
            if (item.type !== 'support') {
              return item
            }
          })

          this.emails = [...email2];

          const dis = this;
          this.emailArray[2].forEach(email => {
            dis.emails.push({ email: email, deletingStatus: undefined, type: 'support' })
          })
        }).catch(error => {
          let errorBody = error.error
          if (errorBody.error) {
            this.toast.error(errorBody.error)
          } else {
            this.toast.error(error.message)
          }
          x.deletingStatus = undefined;
        })
      }
    })

  }

  saveSwitch() {
    this.switchSaving = true;
    const apiURL = `config/switch/settlement`;
    if (!this.switchName) { this.switchSaving = false; return this.errorSwitch = "Name of Switch not provided" }
    if (!this.switchStart) { this.switchSaving = false; return this.errorSwitch = "Header Row No not provided" }
    if (this.switchStart < 1) { this.switchSaving = false; return this.errorSwitch = "Header Row No must be greater than 0" }
    if (!this.switchHeaders) { this.switchSaving = false; return this.errorSwitch = "Headers not provided" }
    if (!this.merchantHeader) { this.switchSaving = false; return this.errorSwitch = "Merchant ID not provided" }
    if (!this.terminalHeader) { this.switchSaving = false; return this.errorSwitch = "Terminal ID not provided" }
    if (!this.dateHeader) { this.switchSaving = false; return this.errorSwitch = "Transaction Date not provided" }
    if (!this.rrnHeader) { this.switchSaving = false; return this.errorSwitch = "RRN not provided" }
    // if (!this.accountHeader) { this.switchSaving = false; return this.errorSwitch = "Merchant Account No not provided" }
    // if (!this.panHeader) { this.switchSaving = false; return this.errorSwitch = "PAN not provided" }
    if (!this.transHeader) { this.switchSaving = false; return this.errorSwitch = "Transaction Amount not provided" }
    // if (!this.settlementHeader) { this.switchSaving = false; return this.errorSwitch = "Settlement Amount not provided" }

    this.errorSwitch = '';
    this.payvueservice.apiCall(apiURL, 'post', { name: this.switchName, headers: this.switchHeaders, transaction_date: this.dateHeader, rrn: this.rrnHeader, merchant_id: this.merchantHeader, merchant_name: this.nameHeader, terminal_id: this.terminalHeader, merchant_account_nr: this.accountHeader, pan: this.panHeader, transaction_amount: this.transHeader, charge: this.chargeHeader, settlement_amount: this.settlementHeader, header_row_number: this.switchStart }).then(data => {
      this.toast.success(data.message);
      this.switchSaving = false;
      this.getSwitch();
      this.switchName = "";
      this.switchStart = 1;
      this.switchHeaders = "";
      this.merchantHeader = "";
      this.terminalHeader = "";
      this.dateHeader = "";
      this.rrnHeader = "";
      this.nameHeader = "";
      this.accountHeader = "";
      this.panHeader = "";
      this.transHeader = "";
      this.settlementHeader = "";
      this.chargeHeader = "";

    }).catch(error => {
      console.log(error, 'settings');
      let errorBody = error.error
      const errorFields = errorBody.fields || {};
      this.toast.error(errorBody.error)
      for (const item of Object.values(errorFields)) {
        this.errorSwitch += ` ${item}`
      }
      this.switchSaving = undefined;
    })
  }

  updateSwitch() {
    this.switchUpdating = true;
    const apiURL = `config/switch/settlement`;
    if (!this.switchNameEdit) { this.switchUpdating = false; return this.errorSwitchEdit = "Name of Switch not provided" }
    if (!this.switchStartEdit) { this.switchUpdating = false; return this.errorSwitchEdit = "Header Row No not provided" }
    if (this.switchStartEdit < 1) { this.switchUpdating = false; return this.errorSwitchEdit = "Header Row No must be greater than 0" }
    if (!this.switchHeadersEdit) { this.switchUpdating = false; return this.errorSwitchEdit = "Headers not provided" }
    if (!this.merchantHeaderEdit) { this.switchUpdating = false; return this.errorSwitchEdit = "Merchant ID not provided" }
    if (!this.terminalHeaderEdit) { this.switchUpdating = false; return this.errorSwitchEdit = "Terminal ID not provided" }
    if (!this.dateHeaderEdit) { this.switchUpdating = false; return this.errorSwitchEdit = "Transaction Date not provided" }
    if (!this.rrnHeaderEdit) { this.switchUpdating = false; return this.errorSwitchEdit = "RRN not provided" }
    // if (!this.accountHeaderEdit) { this.switchUpdating = false; return this.errorSwitchEdit = "Merchant Account No not provided" }
    // if (!this.panHeaderEdit) { this.switchUpdating = false; return this.errorSwitchEdit = "PAN not provided" }
    if (!this.transHeaderEdit) { this.switchUpdating = false; return this.errorSwitchEdit = "Transaction Amount not provided" }
    // if (!this.settlementHeaderEdit) { this.switchUpdating = false; return this.errorSwitchEdit = "Settlement Amount not provided" }

    this.errorSwitchEdit = '';
    this.payvueservice.apiCall(apiURL, 'patch', { name: this.switchNameEdit, headers: this.switchHeadersEdit, transaction_date: this.dateHeaderEdit, rrn: this.rrnHeaderEdit, merchant_id: this.merchantHeaderEdit, merchant_name: this.nameHeaderEdit, terminal_id: this.terminalHeaderEdit, merchant_account_nr: this.accountHeaderEdit, pan: this.panHeaderEdit, transaction_amount: this.transHeaderEdit, charge: this.chargeHeaderEdit, settlement_amount: this.settlementHeaderEdit, header_row_number: this.switchStartEdit }).then(data => {
      this.toast.success(data.message);
      this.switchUpdating = false;
      this.getSwitch();
      this.switchNameEdit = "";
      this.switchStartEdit = 1;
      this.switchHeadersEdit = "";
      this.merchantHeaderEdit = "";
      this.terminalHeaderEdit = "";
      this.dateHeaderEdit = "";
      this.rrnHeaderEdit = "";
      this.nameHeaderEdit = "";
      this.accountHeaderEdit = "";
      this.panHeaderEdit = "";
      this.transHeaderEdit = "";
      this.settlementHeaderEdit = "";
      this.chargeHeaderEdit = "";
    }).catch(error => {
      let errorBody = error.error
      const errorFields = errorBody.fields || {};
      this.toast.error(errorBody.error)
      for (const item of Object.values(errorFields)) {
        this.errorSwitchEdit += ` ${item}`
      }
      this.switchUpdating = undefined;
    })
  }

  deleteSwitch() {
    this.switchDeleting = true
    const apiURL = `config/switch/settlement/${this.switchNameEdit}`;
    if (!this.switchNameEdit) { this.switchDeleting = false; return this.errorSwitchEdit = "Name of Switch not provided" }
    this.errorSwitchEdit = '';
    this.payvueservice.apiCall(apiURL, 'delete').then(data => {
      this.toast.success(data.message);
      this.switchDeleting = false;
      this.getSwitch();
      this.switchNameEdit = ""
      this.switchStartEdit = 1
      this.switchHeadersEdit = ""
      this.terminalHeaderEdit = ""
      this.dateHeaderEdit = ""
      this.merchantHeaderEdit = ""
      this.rrnHeaderEdit = ""
      this.nameHeaderEdit = ""
      this.accountHeaderEdit = ""
      this.panHeaderEdit = ""
      this.transHeaderEdit = ""
      this.settlementHeaderEdit = ""
      this.chargeHeaderEdit = ""
    }).catch(error => {
      let errorBody = error.error
      this.toast.error(errorBody.error)
      this.switchDeleting = undefined;
    })
  }

  saveDisputeSwitch() {
    this.switchSavingDispute = true;
    const apiURL = `config/switch/dispute`;
    if (!this.switchNameDispute) { this.switchSavingDispute = false; return this.errorSwitchDispute = "Name of Switch not provided" }
    if (!this.switchStartDispute) { this.switchSavingDispute = false; return this.errorSwitchDispute = "Header Row No not provided" }
    if (this.switchStartDispute < 1) { this.switchSavingDispute = false; return this.errorSwitchDispute = "Header Row No must be greater than 0" }
    if (!this.switchHeadersDispute) { this.switchSavingDispute = false; return this.errorSwitchDispute = "Headers not provided" }
    if (!this.terminalHeaderDispute) { this.switchSavingDispute = false; return this.errorSwitchDispute = "Terminal ID not provided" }
    if (!this.dateHeaderDispute) { this.switchSavingDispute = false; return this.errorSwitchDispute = "Transaction Date not provided" }
    if (!this.rrnHeaderDispute) { this.switchSavingDispute = false; return this.errorSwitchDispute = "RRN not provided" }
    if (!this.panHeaderDispute) { this.switchSavingDispute = false; return this.errorSwitchDispute = "PAN not provided" }
    if (!this.transHeaderDispute) { this.switchSavingDispute = false; return this.errorSwitchDispute = "Transaction Amount not provided" }

    this.errorSwitchDispute = '';
    this.payvueservice.apiCall(apiURL, 'post', { name: this.switchNameDispute, headers: this.switchHeadersDispute, transaction_date: this.dateHeaderDispute, rrn: this.rrnHeaderDispute, merchant_id: this.merchantHeaderDispute, terminal_id: this.terminalHeaderDispute, stan: this.stanHeaderDispute, pan: this.panHeaderDispute, transaction_amount: this.transHeaderDispute, header_row_number: this.switchStartDispute }).then(data => {
      this.toast.success(data.message);
      this.switchSavingDispute = false;
      this.getDisputeSwitch();
      this.switchNameDispute = "";
      this.switchStartDispute = 1;
      this.switchHeadersDispute = "";
      this.merchantHeaderDispute = "";
      this.terminalHeaderDispute = "";
      this.dateHeaderDispute = "";
      this.rrnHeaderDispute = "";
      this.stanHeaderDispute = "";
      this.panHeaderDispute = "";
      this.transHeaderDispute = "";
    }).catch(error => {
      let errorBody = error.error
      const errorFields = errorBody.fields || {};
      this.toast.error(errorBody.error)
      for (const item of Object.values(errorFields)) {
        this.errorSwitchDispute += ` ${item}`
      }
      this.switchSavingDispute = undefined;
    })
  }

  updateDisputeSwitch() {
    this.switchUpdatingDispute = true;
    const apiURL = `config/switch/dispute`;
    if (!this.switchNameEditDispute) { this.switchUpdatingDispute = false; return this.errorSwitchEditDispute = "Name of Switch not provided" }
    if (!this.switchStartEditDispute) { this.switchUpdatingDispute = false; return this.errorSwitchEditDispute = "Header Row No not provided" }
    if (this.switchStartEditDispute < 1) { this.switchUpdatingDispute = false; return this.errorSwitchEditDispute = "Header Row No must be greater than 0" }
    if (!this.switchHeadersEditDispute) { this.switchUpdatingDispute = false; return this.errorSwitchEditDispute = "Headers not provided" }
    if (!this.terminalHeaderEditDispute) { this.switchUpdatingDispute = false; return this.errorSwitchEditDispute = "Terminal ID not provided" }
    if (!this.dateHeaderEditDispute) { this.switchUpdatingDispute = false; return this.errorSwitchEditDispute = "Transaction Date not provided" }
    if (!this.rrnHeaderEditDispute) { this.switchUpdatingDispute = false; return this.errorSwitchEditDispute = "RRN not provided" }
    if (!this.panHeaderEditDispute) { this.switchUpdatingDispute = false; return this.errorSwitchEditDispute = "PAN not provided" }
    if (!this.transHeaderEditDispute) { this.switchUpdatingDispute = false; return this.errorSwitchEditDispute = "Transaction Amount not provided" }

    this.errorSwitchEditDispute = '';
    this.payvueservice.apiCall(apiURL, 'patch', { name: this.switchNameEditDispute, headers: this.switchHeadersEditDispute, transaction_date: this.dateHeaderEditDispute, rrn: this.rrnHeaderEditDispute, merchant_id: this.merchantHeaderEditDispute, terminal_id: this.terminalHeaderEditDispute, stan: this.stanHeaderEditDispute, pan: this.panHeaderEditDispute, transaction_amount: this.transHeaderEditDispute, header_row_number: this.switchStartEditDispute }).then(data => {
      this.toast.success(data.message);
      this.switchUpdatingDispute = false;
      this.getDisputeSwitch();
    }).catch(error => {
      let errorBody = error.error
      const errorFields = errorBody.fields || {};
      this.toast.error(errorBody.error)
      for (const item of Object.values(errorFields)) {
        this.errorSwitchEditDispute += ` ${item}`
      }
      this.switchUpdatingDispute = undefined;
    })
  }

  deleteDisputeSwitch() {
    this.switchDeletingDispute = true
    const apiURL = `config/switch/dispute/${this.switchNameEditDispute}`;
    if (!this.switchNameEditDispute) { this.switchDeletingDispute = false; return this.errorSwitchEditDispute = "Name of Switch not provided" }
    this.errorSwitchEditDispute = '';
    this.payvueservice.apiCall(apiURL, 'delete').then(data => {
      this.toast.success(data.message);
      this.switchDeletingDispute = false;
      this.getDisputeSwitch();
      this.switchNameEditDispute = ""
      this.switchStartEditDispute = 1
      this.switchHeadersEditDispute = ""
      this.terminalHeaderEditDispute = ""
      this.dateHeaderEditDispute = ""
      this.merchantHeaderEditDispute = ""
      this.rrnHeaderEditDispute = ""
      this.stanHeaderEditDispute = ""
      this.panHeaderEditDispute = ""
      this.transHeaderEditDispute = ""
    }).catch(error => {
      let errorBody = error.error
      this.toast.error(errorBody.error)
      this.switchDeletingDispute = undefined;
    })
  }

  saveTerminalFile() {
    this.terminalSaving = true;
    const apiURL = `config/switch/terminal`;
    if (!this.terminalFile) { this.terminalSaving = false; return this.errorTerminal = "Name of Terminal File not provided" }
    if (!this.terminalFileStart) { this.terminalSaving = false; return this.errorTerminal = "Header Row No not provided" }
    if (this.terminalFileStart < 1) { this.terminalSaving = false; return this.errorTerminal = "Header Row No must be greater than 0" }
    if (!this.terminalFileHeaders) { this.terminalSaving = false; return this.errorTerminal = "Headers not provided" }
    if (!this.merchantHeaderTerminalFile) { this.terminalSaving = false; return this.errorTerminal = "Merchant ID not provided" }
    if (!this.nameHeaderTerminalFile) { this.terminalSaving = false; return this.errorTerminal = "Merchant Name not provided" }
    if (!this.terminalHeaderTerminalFile) { this.terminalSaving = false; return this.errorTerminal = "Terminal ID not provided" }
    if (!this.contactHeaderTerminalFile) { this.terminalSaving = false; return this.errorTerminal = "Contact not provided" }
    if (!this.phoneHeaderTerminalFile) { this.terminalSaving = false; return this.errorTerminal = "Phone not provided" }
    if (!this.emailHeaderTerminalFile) { this.terminalSaving = false; return this.errorTerminal = "Email not provided" }
    if (!this.addressHeaderTerminalFile) { this.terminalSaving = false; return this.errorTerminal = "Address not provided" }
    if (!this.accountHeaderTerminalFile) { this.terminalSaving = false; return this.errorTerminal = "Account not provided" }
    if (!this.ptspHeaderTerminalFile) { this.terminalSaving = false; return this.errorTerminal = "PTSP not provided" }
    if (!this.dTypeHeaderTerminalFile) { this.terminalSaving = false; return this.errorTerminal = "Device Type not provided" }
    if (!this.dNameHeaderTerminalFile) { this.terminalSaving = false; return this.errorTerminal = "Device Name not provided" }
    if (!this.dSerialHeaderTerminalFile) { this.terminalSaving = false; return this.errorTerminal = "Device Serial not provided" }
    if (!this.appNameHeaderTerminalFile) { this.terminalSaving = false; return this.errorTerminal = "App Name not provided" }
    if (!this.appVersionHeaderTerminalFile) { this.terminalSaving = false; return this.errorTerminal = "App Version not provided" }
    if (!this.networkHeaderTerminalFile) { this.terminalSaving = false; return this.errorTerminal = "Network not provided" }
    if (!this.accountNameHeaderTerminalFile) { this.terminalSaving = false; return this.errorTerminal = "Merchant Account Name not provided" }
    if (!this.bankCodeHeaderTerminalFile) { this.terminalSaving = false; return this.errorTerminal = "Bank Code not provided" }
    if (!this.mccHeaderTerminalFile) { this.terminalSaving = false; return this.errorTerminal = "MCC not provided" }
    if (!this.stateCodeHeaderTerminalFile) { this.terminalSaving = false; return this.errorTerminal = "State Code not provided" }
    if (!this.lgaHeaderTerminalFile) { this.terminalSaving = false; return this.errorTerminal = "LGA not provided" }
    if (!this.branchHeaderTerminalFile) { this.terminalSaving = false; return this.errorTerminal = "Bank Branch not provided" }
    if (!this.categoryHeaderTerminalFile) { this.terminalSaving = false; return this.errorTerminal = "Category not provided" }

    this.errorTerminal = '';
    this.payvueservice.apiCall(apiURL, 'post', { name: this.terminalFile, headers: this.terminalFileHeaders, merchant_contact: this.contactHeaderTerminalFile, merchant_phone: this.phoneHeaderTerminalFile, merchant_id: this.merchantHeaderTerminalFile, merchant_name: this.nameHeaderTerminalFile, terminal_id: this.terminalHeaderTerminalFile, merchant_email: this.emailHeaderTerminalFile, merchant_address: this.addressHeaderTerminalFile, merchant_account_nr: this.accountHeaderTerminalFile, ptsp: this.ptspHeaderTerminalFile, device_type: this.dTypeHeaderTerminalFile, device_name: this.dNameHeaderTerminalFile, serial: this.dSerialHeaderTerminalFile, app_name: this.appNameHeaderTerminalFile, app_version: this.appVersionHeaderTerminalFile, network_type: this.networkHeaderTerminalFile, merchant_account_name: this.accountNameHeaderTerminalFile, bank_code: this.bankCodeHeaderTerminalFile, mcc: this.mccHeaderTerminalFile, state_code: this.stateCodeHeaderTerminalFile, lga: this.lgaHeaderTerminalFile, bank_branch: this.branchHeaderTerminalFile, category: this.categoryHeaderTerminalFile, header_row_number: this.terminalFileStart }).then(data => {
      this.toast.success(data.message);
      this.terminalSaving = false;
      this.getTerminalFile();
      this.terminalFile = "";
      this.terminalFileStart = 1;
      this.terminalFileHeaders = "";
      this.merchantHeaderTerminalFile = "";
      this.nameHeaderTerminalFile = "";
      this.terminalHeaderTerminalFile = "";
      this.contactHeaderTerminalFile = "";
      this.phoneHeaderTerminalFile = "";
      this.emailHeaderTerminalFile = "";
      this.addressHeaderTerminalFile = "";
      this.accountHeaderTerminalFile = "";
      this.ptspHeaderTerminalFile = "";
      this.dTypeHeaderTerminalFile = "";
      this.dNameHeaderTerminalFile = "";
      this.dSerialHeaderTerminalFile = "";
      this.appNameHeaderTerminalFile = "";
      this.appVersionHeaderTerminalFile = "";
      this.networkHeaderTerminalFile = "";
      this.accountNameHeaderTerminalFile = "";
      this.bankCodeHeaderTerminalFile = "";
      this.mccHeaderTerminalFile = ""; 
      this.stateCodeHeaderTerminalFile = "";
      this.lgaHeaderTerminalFile = "";
      this.branchHeaderTerminalFile = ""; 
      this.categoryHeaderTerminalFile = "";

    }).catch(error => {
      console.log(error, 'settings');
      let errorBody = error.error
      const errorFields = errorBody.fields || {};
      this.toast.error(errorBody.error)
      for (const item of Object.values(errorFields)) {
        this.errorTerminal += ` ${item}`
      }
      this.terminalSaving = undefined;
    })
  }

  updateTerminalFile() {
    this.terminalUpdating = true;
    const apiURL = `config/switch/terminal`;
    if (!this.terminalFileEdit) { this.terminalUpdating = false; return this.errorTerminalEdit = "Name of Terminal File not provided" }
    if (!this.terminalFileStartEdit) { this.terminalUpdating = false; return this.errorTerminalEdit = "Header Row No not provided" }
    if (this.terminalFileStartEdit < 1) { this.terminalUpdating = false; return this.errorTerminalEdit = "Header Row No must be greater than 0" }
    if (!this.terminalFileHeadersEdit) { this.terminalUpdating = false; return this.errorTerminalEdit = "Headers not provided" }
    if (!this.merchantHeaderTerminalFileEdit) { this.terminalUpdating = false; return this.errorTerminalEdit = "Merchant ID not provided" }
    if (!this.nameHeaderTerminalFileEdit) { this.terminalUpdating = false; return this.errorTerminalEdit = "Merchant Name not provided" }
    if (!this.terminalHeaderTerminalFileEdit) { this.terminalUpdating = false; return this.errorTerminalEdit = "Terminal ID not provided" }
    if (!this.contactHeaderTerminalFileEdit) { this.terminalUpdating = false; return this.errorTerminalEdit = "Contact not provided" }
    if (!this.phoneHeaderTerminalFileEdit) { this.terminalUpdating = false; return this.errorTerminalEdit = "Phone not provided" }
    if (!this.emailHeaderTerminalFileEdit) { this.terminalUpdating = false; return this.errorTerminalEdit = "Email not provided" }
    if (!this.addressHeaderTerminalFileEdit) { this.terminalUpdating = false; return this.errorTerminalEdit = "Address not provided" }
    if (!this.accountHeaderTerminalFileEdit) { this.terminalUpdating = false; return this.errorTerminalEdit = "Account not provided" }
    if (!this.ptspHeaderTerminalFileEdit) { this.terminalUpdating = false; return this.errorTerminalEdit = "PTSP not provided" }
    if (!this.dTypeHeaderTerminalFileEdit) { this.terminalUpdating = false; return this.errorTerminalEdit = "Device Type not provided" }
    if (!this.dNameHeaderTerminalFileEdit) { this.terminalUpdating = false; return this.errorTerminalEdit = "Device Name not provided" }
    if (!this.dSerialHeaderTerminalFileEdit) { this.terminalUpdating = false; return this.errorTerminalEdit = "Device Serial not provided" }
    if (!this.appNameHeaderTerminalFileEdit) { this.terminalUpdating = false; return this.errorTerminalEdit = "App Name not provided" }
    if (!this.appVersionHeaderTerminalFileEdit) { this.terminalUpdating = false; return this.errorTerminalEdit = "App Version not provided" }
    if (!this.networkHeaderTerminalFileEdit) { this.terminalUpdating = false; return this.errorTerminalEdit = "Network not provided" }
    if (!this.accountNameHeaderTerminalFileEdit) { this.terminalUpdating = false; return this.errorTerminalEdit = "Merchant Account Name not provided" }
    if (!this.bankCodeHeaderTerminalFileEdit) { this.terminalUpdating = false; return this.errorTerminalEdit = "Bank Code not provided" }
    if (!this.mccHeaderTerminalFileEdit) { this.terminalUpdating = false; return this.errorTerminalEdit = "MCC not provided" }
    if (!this.stateCodeHeaderTerminalFileEdit) { this.terminalUpdating = false; return this.errorTerminalEdit = "State Code not provided" }
    if (!this.lgaHeaderTerminalFileEdit) { this.terminalUpdating = false; return this.errorTerminalEdit = "LGA not provided" }
    if (!this.branchHeaderTerminalFileEdit) { this.terminalUpdating = false; return this.errorTerminalEdit = "Bank Branch not provided" }
    if (!this.categoryHeaderTerminalFileEdit) { this.terminalUpdating = false; return this.errorTerminalEdit = "Category not provided" }

    this.errorTerminalEdit = '';
    this.payvueservice.apiCall(apiURL, 'patch', { name: this.terminalFileEdit, headers: this.terminalFileHeadersEdit, merchant_contact: this.contactHeaderTerminalFileEdit, merchant_phone: this.phoneHeaderTerminalFileEdit, merchant_id: this.merchantHeaderTerminalFileEdit, merchant_name: this.nameHeaderTerminalFileEdit, terminal_id: this.terminalHeaderTerminalFileEdit, merchant_email: this.emailHeaderTerminalFileEdit, merchant_address: this.addressHeaderTerminalFileEdit, merchant_account_nr: this.accountHeaderTerminalFileEdit, ptsp: this.ptspHeaderTerminalFileEdit, device_type: this.dTypeHeaderTerminalFileEdit, device_name: this.dNameHeaderTerminalFileEdit, serial: this.dSerialHeaderTerminalFileEdit, app_name: this.appNameHeaderTerminalFileEdit, app_version: this.appVersionHeaderTerminalFileEdit, network_type: this.networkHeaderTerminalFileEdit, merchant_account_name: this.accountNameHeaderTerminalFileEdit, bank_code: this.bankCodeHeaderTerminalFileEdit, mcc: this.mccHeaderTerminalFileEdit, state_code: this.stateCodeHeaderTerminalFileEdit, lga: this.lgaHeaderTerminalFileEdit, bank_branch: this.branchHeaderTerminalFileEdit, category: this.categoryHeaderTerminalFileEdit,  header_row_number: this.terminalFileStartEdit }).then(data => {
      this.toast.success(data.message);
      this.terminalUpdating = false;
      this.getTerminalFile();
      this.terminalFileEdit = "";
      this.terminalFileStartEdit = 1;
      this.terminalFileHeadersEdit = "";
      this.merchantHeaderTerminalFileEdit = "";
      this.nameHeaderTerminalFileEdit = "";
      this.terminalHeaderTerminalFileEdit = "";
      this.contactHeaderTerminalFileEdit = "";
      this.phoneHeaderTerminalFileEdit = "";
      this.emailHeaderTerminalFileEdit = "";
      this.addressHeaderTerminalFileEdit = "";
      this.accountHeaderTerminalFileEdit = "";
      this.ptspHeaderTerminalFileEdit = "";
      this.dTypeHeaderTerminalFileEdit = "";
      this.dNameHeaderTerminalFileEdit = "";
      this.dSerialHeaderTerminalFileEdit = "";
      this.appNameHeaderTerminalFileEdit = "";
      this.appVersionHeaderTerminalFileEdit = "";
      this.networkHeaderTerminalFileEdit = "";
      this.accountNameHeaderTerminalFileEdit = "";
      this.bankCodeHeaderTerminalFileEdit = "";
      this.mccHeaderTerminalFileEdit = ""; this.stateCodeHeaderTerminalFileEdit = "";
      this.lgaHeaderTerminalFileEdit = "";
      this.branchHeaderTerminalFileEdit = ""; 
      this.categoryHeaderTerminalFileEdit = "";

    }).catch(error => {
      console.log(error, 'settings');
      let errorBody = error.error
      const errorFields = errorBody.fields || {};
      this.toast.error(errorBody.error)
      for (const item of Object.values(errorFields)) {
        this.errorTerminalEdit += ` ${item}`
      }
      this.terminalUpdating = undefined;
    })
  }

  deleteTerminalFile() {
    this.terminalDeleting = true
    const apiURL = `config/switch/terminal/${this.terminalFileEdit}`;
    if (!this.terminalFileEdit) { this.terminalDeleting = false; return this.errorTerminalEdit = "Name of Switch not provided" }
    this.errorTerminalEdit = '';
    this.payvueservice.apiCall(apiURL, 'delete').then(data => {
      this.toast.success(data.message);
      this.terminalDeleting = false;
      this.getTerminalFile();
      this.terminalFileEdit = "";
      this.terminalFileStartEdit = 1;
      this.terminalFileHeadersEdit = "";
      this.merchantHeaderTerminalFileEdit = "";
      this.nameHeaderTerminalFileEdit = "";
      this.terminalHeaderTerminalFileEdit = "";
      this.contactHeaderTerminalFileEdit = "";
      this.phoneHeaderTerminalFileEdit = "";
      this.emailHeaderTerminalFileEdit = "";
      this.addressHeaderTerminalFileEdit = "";
      this.accountHeaderTerminalFileEdit = "";
      this.ptspHeaderTerminalFileEdit = "";
      this.dTypeHeaderTerminalFileEdit = "";
      this.dNameHeaderTerminalFileEdit = "";
      this.dSerialHeaderTerminalFileEdit = "";
      this.appNameHeaderTerminalFileEdit = "";
      this.appVersionHeaderTerminalFileEdit = "";
      this.networkHeaderTerminalFileEdit = "";
      this.accountNameHeaderTerminalFileEdit = "";
      this.bankCodeHeaderTerminalFileEdit = "";
      this.mccHeaderTerminalFileEdit = ""; 
      this.stateCodeHeaderTerminalFileEdit = "";
      this.lgaHeaderTerminalFileEdit = "";
      this.branchHeaderTerminalFileEdit = ""; 
      this.categoryHeaderTerminalFileEdit = "";
    }).catch(error => {
      let errorBody = error.error
      this.toast.error(errorBody.error)
      this.terminalDeleting = undefined;
    })
  }

  saveTrans() {
    this.switchSavingTrans = true;
    const apiURL = `config/switch/settlement`;
    if (!this.switchNameTrans) { this.switchSaving = false; return this.errorSwitchTrans = "Name of Switch not provided" }
    if (!this.switchStartTrans) { this.switchSaving = false; return this.errorSwitchTrans = "Header Row No not provided" }
    if (this.switchStartTrans < 1) { this.switchSaving = false; return this.errorSwitchTrans = "Header Row No must be greater than 0" }
    if (!this.switchHeadersTrans) { this.switchSaving = false; return this.errorSwitchTrans = "Headers not provided" }
    if (!this.merchantHeaderTrans) { this.switchSaving = false; return this.errorSwitchTrans = "Merchant ID not provided" }
    if (!this.terminalHeaderTrans) { this.switchSaving = false; return this.errorSwitchTrans = "Terminal ID not provided" }
    if (!this.dateHeaderTrans) { this.switchSaving = false; return this.errorSwitchTrans = "Transaction Date not provided" }
    if (!this.rrnHeaderTrans) { this.switchSaving = false; return this.errorSwitchTrans = "RRN not provided" }
    if (!this.panHeaderTrans) { this.switchSaving = false; return this.errorSwitchTrans = "PAN not provided" }
    if (!this.transHeaderTrans) { this.switchSaving = false; return this.errorSwitchTrans = "Transaction Amount not provided" }
    if (!this.stanHeaderTrans) { this.switchSaving = false; return this.errorSwitchTrans = "Stan not provided" }
    if (!this.reasonHeaderEditTrans) { this.switchSaving = false; return this.errorSwitchTrans = "Message Reason not provided" }
    if (!this.responseHeaderEditTrans) { this.switchSaving = false; return this.errorSwitchTrans = "Response Code not provided" }
    if (!this.addressHeaderEditTrans) { this.switchSaving = false; return this.errorSwitchTrans = "Merchant Address not provided" }

    this.errorSwitchTrans = '';
    this.payvueservice.apiCall(apiURL, 'post', { name: this.switchNameTrans, headers: this.switchHeadersTrans, transactionTime: this.dateHeader, rrn: this.rrnHeader, merchantId: this.merchantHeader, merchantName: this.nameHeader, terminalId: this.terminalHeader, maskedPan: this.panHeader, amount: this.transHeader, STAN: this.stanHeaderTrans, messageReason: this.reasonHeaderTrans, responseCode: this.responseHeaderTrans, merchantAddress: this.addressHeaderTrans, header_row_number: this.switchStartTrans }).then(data => {
      this.toast.success(data.message);
      this.switchSavingTrans = false;
      this.getSwitch();
      this.switchNameTrans = "";
      this.switchStartTrans = 1;
      this.switchHeadersTrans = "";
      this.merchantHeaderTrans = "";
      this.terminalHeaderTrans = "";
      this.dateHeaderTrans = "";
      this.rrnHeaderTrans = "";
      this.nameHeaderTrans = "";
      this.panHeaderTrans = "";
      this.transHeaderTrans = "";
      this.stanHeaderTrans = "";
      this.reasonHeaderTrans = "";
      this.responseHeaderTrans = "";
      this.addressHeaderTrans = "";

    }).catch(error => {
      console.log(error, 'settings');
      let errorBody = error.error
      const errorFields = errorBody.fields || {};
      this.toast.error(errorBody.error)
      for (const item of Object.values(errorFields)) {
        this.errorSwitchTrans += ` ${item}`
      }
      this.switchSavingTrans = undefined;
    })
  }

  pageChanged(event: any): void {
    this.page = event.page;
    this.getNotification();
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
                ((typeof (this.data[j]['settlement_count']) === 'number')) &&
                !(24 % (this.data[j]['settlement_count'])) &&
                (this.data[j]['merchant_id'])) {

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
  isSet: boolean = false;
  organisedArray: any[] = [];

  addMore() {
    const merchant_id = [...new Set(this.merchant.split(',').map(item => item.trim()))]
    this.organiser({ merchant_id, account: this.mAccount, frequency: this.frequency })
    this.merchant = '';
    this.mAccount = '';
  }

  private arraySort(result: any[]) {
    this.organisedArray = [];
    const dis = this;

    result.forEach(function (item) {
      dis.updateOrganisedArray(item);
    })
  }

  private organiser(item: any) {
    item.merchant_id = item.merchant_id.filter(id => id !== "")
    let obj = this.organisedArray.find(rec => rec.frequency === item.frequency)
    let objIndex = this.organisedArray.findIndex(rec => rec.frequency === item.frequency)
    if (obj) {
      const objAccount = obj.account || "";
      if (objAccount == item.account) {
        //unique ID
        this.organisedArray = this.organisedArray.map(rec => {
          rec.merchant_id = rec.merchant_id.filter(id => !item.merchant_id.includes(id))
          return rec;
        }).filter(rec => rec.merchant_id.length)
        obj.merchant_id = [...new Set(obj.merchant_id.concat(item.merchant_id))]
        this.organisedArray[objIndex] = obj;
      }
      else {
        //removes ID when account not the same, adds it to array
        this.organisedArray = this.organisedArray.map(rec => {
          rec.merchant_id = rec.merchant_id.filter(id => !item.merchant_id.includes(id))
          return rec;
        }).filter(rec => rec.merchant_id.length)
        this.organisedArray.push(item)
      }
    }
    else {
      this.organisedArray = this.organisedArray.map(rec => {
        rec.merchant_id = rec.merchant_id.filter(id => !item.merchant_id.includes(id))
        return rec;
      }).filter(rec => rec.merchant_id.length)
      this.organisedArray.push(item)
    }

    const organArray = this.organisedArray.filter(rec => rec.frequency == item.frequency && rec.account == item.account);
    this.organisedArray = this.organisedArray.filter(rec => !(rec.frequency == item.frequency && rec.account == item.account));
    const organIds = [].concat(...organArray.map(item => item.merchant_id))
    if (organIds.length) this.organisedArray.push({
      account: item.account,
      frequency: item.frequency,
      merchant_id: organIds,
    })
  }

  private updateOrganisedArray(item: any) {

    item.merchant_id.map(mid => {
      //makes all ids unique
      this.organisedArray = this.organisedArray.map(m => {
        m.merchant_id = m.merchant_id.filter(id => id !== mid)
        return m;
      })
        .filter(() => {
          return true
        })

      return mid;
    })
    let obj = this.organisedArray.find(m => m.frequency === item.frequency);
    if (obj === undefined) {

      this.organisedArray.push(item);
    }
    else if (obj !== undefined && obj.account !== undefined) {
      if (obj.account == item.account) {
        obj.merchant_id = obj.merchant_id.concat(item.merchant_id).filter(id => id !== "");
        obj.merchant_id = [...new Set(obj.merchant_id)];
        this.organisedArray.map(rec => {
          if (rec.frequency == item.frequency && rec.account == item.account) {
            rec.merchant_id = obj.merchant_id
          }
          return rec;
        })
      }
      else {
        this.organisedArray.push(item);
      }

    }
    else {
      obj.merchant_id = obj.merchant_id.concat(item.merchant_id).filter(id => id !== "");
      obj.merchant_id = [...new Set(obj.merchant_id)];
      this.organisedArray.map(rec => {
        if (rec.frequency == item.Frequency) {
          rec.merchant_id = obj.merchant_id
        }
        return rec;
      })
    }

    this.organisedArray = this.organisedArray.filter(item => item.merchant_id.filter(id => id !== "").length);
  }

  setThreshold() {
    if (this.threshold > 0 || this.threshold === 2000) {
      this.isThreshold = true;
    } else if (this.threshold === undefined || this.threshold === 0 || this.threshold === null) {
      this.threshold = 2000;
      this.isThreshold = true;
    }
  }

  loadPageData() {
    this.getNotification()
    this.getConfig()
  }

  doUpload(sheetName?: string) {
    localStorage.setItem('xfile', 'true');
    if (this.valid.length > 0) {
      const apiURL = `config/settlements`;
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

  doUpload2() {
    localStorage.setItem('xfile', 'true');
    this.isUploading = true
    const formData = new FormData();
    formData.append('xlsx_file', this.file);
    formData.append('processors', this.fileType)
    console.log(this.fileType)
    const apiURL = `terminals/upload-file`;

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

  check(event: any) {
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
}