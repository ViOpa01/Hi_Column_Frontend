import { Component, OnInit, ElementRef, ViewChild, Input, HostListener, TemplateRef } from '@angular/core';
import { PayVueApiService } from '../../../providers/payvue-api.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastService } from 'ng-uikit-pro-standard';
import { formatDate } from '@angular/common';

import { NgForm } from '@angular/forms';
import { FormCanDeactivate } from '../../../../app/shared/FormCanDeactivate';
import { WebworkerService } from "../../../../app/providers/webworker.service";
import html2canvas from 'html2canvas';
import { SocketService } from '../../../../app/providers/socket.service';
import eventsService from 'app/providers/events.service';
// import { UtilService } from 'app/providers/util.service';

@Component({
  selector: 'app-merchantdispute',
  templateUrl: './merchantdispute.component.html',
  styleUrls: ['./merchantdispute.component.scss']
})
export class MerchantDisputeComponent extends FormCanDeactivate implements OnInit {
  @Input() shadows = false;
  receiptRowDatas;
  receiptRowData;
  messageRowData;

  switchesData: any[] = [];

  is_printing: boolean;
  title: string;
  dispute_messages: any[] = [];

  datetime
  dateData
  time
  panData
  amountData
  status_message
  auth_id
  name
  rrn

  modalRef: BsModalRef;
  isSending: boolean;
  isSending2: boolean;

  currentSheet: string;
  date: string;
  threshold = 2000;
  isThreshold = false;
  counter = 0;
  headers: any;

  rowID: any;
  note: any;

  rotate = false;
  maxSize = 10;

  progress = 0;
  progressMax = 0;

  processor: string = "";
  processor2: string = "";
  processor3: string = "";
  processor4: string = "";
  processor5: string = "";

  terminal2: string;
  terminal3: string;
  terminal4: string;
  terminal5: string;

  amount2: string;
  amount3: string;
  amount4: string;
  amount5: string;

  stan2: string;
  stan3: string;
  stan4: string;
  stan5: string;

  page2 = 1;
  page3 = 1;
  page4 = 1;
  page5 = 1;

  limit2 = 50;
  limit3 = 50;
  limit4 = 50;
  limit5 = 50;

  serial2 = 0;
  serial3 = 0;
  serial4 = 0;
  serial5 = 0;

  search: string;

  itemCount2: number;
  itemCount3: number;
  itemCount4: number;

  pan2: string;
  pan3: string;
  pan4: string;
  pan5: string;

  sort2 = 'transdate';
  sort3 = 'transdate';
  sort4 = 'transdate';
  sort5 = 'transdate';

  dir2 = 'desc';
  dir3 = 'desc';
  dir4 = 'desc';
  dir5 = 'desc';

  search2: string = '';
  search3: string = '';
  search4: string = '';
  search5: string = '';

  from2: string;
  from3: string;
  from4: string;
  from5: string;

  to2: string;
  to3: string;
  to4: string;
  to5: string;

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

  uIds: any[] = [];
  pendingRecords: any[] = [];
  approvedRecords: any[] = [];
  declinedRecords: any[] = [];

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
  isData2: boolean;
  isData3: boolean;
  isData4: boolean;
  isData5: boolean;

  reading: boolean;
  uploading: boolean;
  checking: boolean;
  checked: boolean;
  correct: boolean;

  isThere: boolean;
  isThere2: boolean;
  isThere3: boolean;
  isThere4: boolean;
  isThere5: boolean;

  @ViewChild('form')
  form: NgForm;


  file: File;
  showResult = false; isConfirmed = false; confirmCB = false; isFile = false; isVerified = false;
  arrayBuffer: any; totalRowCnt = 0; excelArray: any;

  filename: string;

  @ViewChild('settlements') settlementFile: ElementRef;
  constructor(private payvueservice: PayVueApiService, private toast: ToastService, private socket: SocketService) {
    super();
    this.socket.on('dispute-notify-message').subscribe(() => {
      this.loadPageData();
    })
  }

  ngOnInit() {
    this.loadPageData();
    this.getSwitch();
    //  this.util.addScript();

    eventsService.getEvent('PendingMerchant').subscribe(page => {
      this.page2 = page;
      this.getPending();
    })

    eventsService.getEvent('ApprovedMerchant').subscribe(page => {
      this.page3 = page;
      this.getApproved();
    })

    eventsService.getEvent('DeclinedMerchant').subscribe(page => {
      this.page4 = page;
      this.getDeclined();
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

  printAll(event, data = null) {
    /**
     * if(data && event) finds correspending data for the selectedDisputesIds
     */
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

  getPending() {
    this.pendingRecords = [];
    this.isData2 = undefined;
    let query = '';
    if (this.from2) query += '&startdate=' + this.from2;
    if (this.to2) query += '&enddate=' + this.to2;
    const apiURL = `merchants/disputes/pending?limit=${this.limit2}&processor=${this.processor2}&search=${this.search2}${query}`;
    this.payvueservice.apiCall(apiURL).then(data => {
      if (data.status === 200) {
        if (data.data.length > 0) {
          this.itemCount2 = data.itemCount;
          this.serial2 = 1 + (this.page2 - 1) * this.limit2;

          this.pendingRecords = this.createReceiptType(data.data);
          this.isData2 = true;
        } else {
          this.isData2 = false;
          this.itemCount2 = 1;
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
    this.approvedRecords = [];
    this.isData3 = undefined;
    let query = '';
    if (this.from3) query += '&startdate=' + this.from3;
    if (this.to3) query += '&enddate=' + this.to3;
     const apiURL = `merchants/disputes/approved?limit=${this.limit3}&processor=${this.processor3}&search=${this.search3}${query}`;
    this.payvueservice.apiCall(apiURL).then(data => {

      if (data.status === 200) {
        if (data.data.length > 0) {
          this.itemCount3 = data.itemCount;
          this.serial3 = 1 + (this.page3 - 1) * this.limit3;

          this.approvedRecords = this.createReceiptType(data.data);
          this.isData3 = true;
        } else {
          this.isData3 = false;
          this.itemCount3 = 1;
        }
      } else {
        this.isData3 = false; 
        this.itemCount3 = 1;
      }
    }).catch(error => {
      this.isData3 = false;
    });
  }

  getDeclined() {
    this.declinedRecords = [];
    this.isData4 = undefined;
    let query = '';
    if (this.from4) query += '&startdate=' + this.from4;
    if (this.to4) query += '&enddate=' + this.to4;
    const apiURL = `merchants/disputes/declined?limit=${this.limit4}&processor=${this.processor4}&search=${this.search4}${query}`;
    this.payvueservice.apiCall(apiURL).then(data => {
      if (data.status === 200) {
        if (data.data.length > 0) {
          this.itemCount4 = data.itemCount;
          this.serial4 = 1 + (this.page4 - 1) * this.limit4;

          this.declinedRecords = this.createReceiptType(data.data);
          this.isData4 = true;
        } else {
          this.isData4 = false; 
          this.itemCount4 = 1;
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


  sortBy(by: string | any, array): void {
    let sortingArray = []
    switch (array) {
      case 'tabPending':
        sortingArray = this.pendingRecords;
        break;
      case 'tabApproved':
        sortingArray = this.approvedRecords;
        break;
      case 'tabDeclined':
        sortingArray = this.declinedRecords;
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


  passIndex(rowID) {
    this.rowID = rowID;
  }


  disputes: any[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 65, 534, 23, 223, 13, 31, 32, 24, 35, 5768, 68, 67]
  selectedDisputesIds: any[] = [];

  selectDisputes(isChecked, dispute, tab) {
    switch (tab) {
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
    } else {
      if (dispute == 'all') {
        this.selectedDisputesIds = [];
      } else {
        const index = this.selectedDisputesIds.indexOf(dispute);
        if (index > -1) {
          this.selectedDisputesIds.splice(index, 1);
        }
      }
    }

  }

  acceptDispute(modal) {
    this.isSending = true;
    const apiURL = `merchants/resolve`;
    this.payvueservice.apiCall(apiURL, 'post', { status: 'accept', dispute_id: this.rowID, message: this.note }).then(data => {
      if (data.status == 200) {
        this.toast.success(data.data.message)
        this.isSending = false;
        this.loadPageData();
        this.note = '';
        modal.hide();
      }
    }).catch(error => {
      console.log(error);
      this.isSending = undefined;

    })
  }

  rejectDispute(modal) {
    this.isSending2 = true;
    const apiURL = `merchants/resolve`;
    this.payvueservice.apiCall(apiURL, 'post', { status: 'reject', dispute_id: this.rowID, message: this.note }).then(data => {
      if (data.status == 200) {
        this.toast.success(data.data.message)
        this.isSending2 = false;
        this.loadPageData();
        this.note = '';
        modal.hide();
      }
    }).catch(error => {
      console.log(error);
      this.isSending2 = undefined;
    })
  }

  getData(dispute_messages) {
    this.dispute_messages = dispute_messages;
    return this.dispute_messages
  }

  loadPageData() {
    this.getApproved();
    this.getPending();
    this.getDeclined();

    // this.getHistory();
    this.date = formatDate(new Date(), 'yyyy-MM-dd', 'en');
  }

  setPage(page: number): void {

    switch (page) {
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
    if (type == 'token') {
      return !!data.transaction_data.token;
    }
    if (type == 'small') {
      return data.transaction_data.category == 'Airtime' || data.transaction_data.category == 'TV';
    }
  }


}
