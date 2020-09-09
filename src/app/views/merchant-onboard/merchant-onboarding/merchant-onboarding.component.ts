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
  selector: 'app-merchant-onboarding',
  templateUrl: './merchant-onboarding.component.html',
  styleUrls: ['./merchant-onboarding.component.scss']
})

export class MerchantOnboardingComponent implements OnInit  {

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

  superMerchant: boolean = true;
  isEdit: boolean;

  merchant: string = "";
  terminal: string = "";
  receiptRowData;
  receiptView: boolean = false;
  merchantU: boolean;
  super: boolean;
  isSuper: boolean;


  bankModel = BankModel
  brandModel = CardModel

  private sorted = false;


  private EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  private EXCEL_EXTENSION = 'xlsx';
  firstname: string;
  lastname: string;
  business_name: string;
  email: string;
  mobile_number: string;
  bank_code: string;
  account_number: string;
  address: string;
  state: string;
  bvn: string;
  sub_firstname: string;
  sub_lastname: string;
  sub_business_name: string;
  sub_email: string;
  sub_mobile_number: string;
  superMerchantCode: string;
  superMerchantCode2: string;
  superMerchantName: string;
  sub_bank_code: string;
  sub_account_number: string;
  sub_address: string;
  sub_state: string;
  sub_bvn: string;
  sub_password: string;
  password: string;
  same_account_details: boolean;
  name: string;

  isUploading = false;
  file: File;

  details: any
  isView: boolean;
  isSub: boolean;

  error = true;
  errors: any = {};


  constructor(private payvueservice: PayVueApiService, private socket: SocketService, private webWorkerService: WebworkerService, private toast: ToastService) {
    this.merchantU = false;
    const userStr = localStorage.getItem('user');

    const u = JSON.parse(userStr);
    if (u && u.role.toLowerCase() == 'merchant') {

      this.merchantU = true;

      if(u.isSuperMerchant){

        this.isSuper = true;
      }
    }
    else if (u && u.role.toLowerCase() == 'super admin') {

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

    this.getMerchants();
    // this.getFailureReason();

    eventsService.getEvent('MerchListPage').subscribe(page => {
      this.page = page;
      this.getMerchants();
      
      // if(this.show) {
      //   this.getFailureReason();
      // }
      
    })
  }

  doUpload() {
    localStorage.setItem('xfile', 'true');
    this.isUploading = true
    const formData = new FormData();
    formData.append('file',this.file);
    const apiURL = `:5009/v1/merchants/create/bulksubmerchants/${this.superMerchantCode2}`;
    

    this.payvueservice.apiCall(apiURL, 'post', formData, true, true).then(data => {
      console.log(data);

      let isProcessing = true;
      this.superMerchantCode2 = '';
      
      eventsService.getEvent('upload-processing').emit(isProcessing);
      
      localStorage.removeItem('xfile');
    }).catch(error => {
      this.isUploading = false;
      this.toast.error(`failed to upload  ${this.file.name}`);
      console.error(`failed to upload ${this.file.name}`, error)
    })
  }


  clear(){
    this.error = false;
    this.errors = {}
    this.same_account_details = false;

    this.superMerchant = undefined;
    this.firstname = '';
    this.lastname = '';
    this.business_name = '';
    this.email = '';
    this.mobile_number = '';
    this.bank_code = '';
    this.account_number = '';
    this.address = '';
    this.state = '';
    this.bvn = '';
    this.password = '';

    this.sub_firstname = '';
    this.sub_lastname = '';
    this.sub_business_name = '';
    this.sub_email = '';
    this.sub_mobile_number = '';
    this.superMerchantCode = '';
    this.sub_bank_code = '';
    this.sub_account_number = '';
    this.sub_address = '';
    this.sub_state = '';
    this.sub_bvn = '';
    this.sub_password = '';
  }

  setDetails(row){
    this.details = row;
    this.isView = true;
  }


  check(type?){ 

    if(type == 'check'){
      if(this.errors.sub_account_number){
        this.errors.sub_account_number = ""
      }

      if(this.errors.sub_bank_code){
        this.errors.sub_bank_code = ""
      }
      
      if(this.errors.sub_bvn){
        this.errors.sub_bvn = ""
      }

      return
    }


    const isPhone = /^(0|234|\+234)[0-9]{10}$/
    const isEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    const isName = /^[a-zA-Z]+$/
    const isNumber = /^[0-9]*$/
    // this will check user input

    this.error = false;

    if(this.superMerchant){

      this.errors = {

        email: !this.email ? "Email is required" : "",
          mobile: !this.mobile_number ? "Mobile is required" : "",
          firstname: !this.firstname ? "First Name is required" : "",
          lastname: !this.lastname ? "Last Name is required" : "",
          password: !this.password ? "Password is required" : "",
          businessname: !this.business_name ? "Business Name is required" : "",
          address: !this.address ? "Address is required" : "",
          state: !this.state ? "State is required" : "",
          bank_code: !this.bank_code ? "Bank Code is required" : "",
          account_number: !this.account_number ? "Account Number is required" : "",
          bvn: !this.bvn ? "BVN is required" : "",

      }

      if (!this.errors.mobile && !isPhone.test(this.mobile_number)) {
        this.errors.mobile = 'Invalid Phone Format'
        this.error = true
      }

      if (!this.errors.email && !isEmail.test(this.email)) {
        this.errors.email = 'Invalid Email Format'
        this.error = true
      }

      if (!this.errors.firstname && !isName.test(this.firstname)) {
        this.errors.firstname = 'Invalid Name Format'
        this.error = true
      }

      if (!this.errors.lastname && !isName.test(this.lastname)) {
        this.errors.lastname = 'Invalid Name Format'
        this.error = true
      }

      if (!this.errors.account_number && !isNumber.test(this.account_number)) {
        this.errors.account_number = 'Invalid Account Format'
        this.error = true
      }

      if(!this.email) this.error = true
      if(!this.mobile_number) this.error = true
      if(!this.firstname) this.error = true
      if(!this.lastname) this.error = true
      if(!this.password) this.error = true
      if(!this.business_name) this.error = true
      if(!this.address) this.error = true
      if(!this.state) this.error = true
      if(!this.bank_code) this.error = true
      if(!this.account_number) this.error = true
      if(!this.bvn) this.error = true

    } else if(!this.superMerchant) {

      if(this.same_account_details){

        this.errors = {

          sub_email: !this.sub_email ? "Email is required" : "",
          sub_mobile: !this.sub_mobile_number ? "Mobile is required" : "",
          sub_firstname: !this.sub_firstname ? "First Name is required" : "",
          sub_lastname: !this.sub_lastname ? "Last Name is required" : "",
          sub_password: !this.sub_password ? "Password is required" : "",
          sub_businessname: !this.sub_business_name ? "Business Name is required" : "",
          sub_address: !this.sub_address ? "Address is required" : "",
          sub_state: !this.sub_state ? "State is required" : "",
          superMerchantCode: !this.superMerchantCode ? "Super Merchant Code is required" : ""
  
        }

        if (!this.errors.sub_mobile && !isPhone.test(this.sub_mobile_number)) {
          this.errors.sub_mobile = 'Invalid Phone Format'
          this.error = true
        }

        if (!this.errors.sub_email && !isEmail.test(this.sub_email)) {
          this.errors.sub_email = 'Invalid Email Format'
          this.error = true
        }

        if (!this.errors.sub_firstname && !isName.test(this.sub_firstname)) {
          this.errors.sub_firstname = 'Invalid Name Format'
          this.error = true
        }

        if (!this.errors.sub_lastname && !isName.test(this.sub_lastname)) {
          this.errors.sub_lastname = 'Invalid Name Format'
          this.error = true
        }



      if(!this.sub_email) this.error = true
      if(!this.sub_mobile_number) this.error = true
      if(!this.sub_firstname) this.error = true
      if(!this.sub_lastname) this.error = true
      if(!this.sub_password) this.error = true
      if(!this.sub_business_name) this.error = true
      if(!this.sub_address) this.error = true
      if(!this.sub_state) this.error = true
      if(!this.superMerchantCode) this.error = true

      } else {

        this.errors = {

          sub_email: !!this.sub_email ? "Email is required" : "",
          sub_mobile: !this.sub_mobile_number ? "Mobile is required" : "",
          sub_firstname: !this.sub_firstname ? "First Name is required" : "",
          sub_lastname: !this.sub_lastname ? "Last Name is required" : "",
          sub_password: !this.sub_password ? "Password is required" : "",
          sub_businessname: !this.sub_business_name ? "Business Name is required" : "",
          sub_address: !this.sub_address ? "Address is required" : "",
          sub_state: !this.sub_state ? "State is required" : "",
          sub_bank_code: !this.sub_bank_code ? "Bank Code is required" : "",
          sub_account_number: !this.sub_account_number ? "Account Number is required" : "",
          sub_bvn: !this.sub_bvn ? "BVN is required" : "",
          superMerchantCode: !this.superMerchantCode ? "Super Merchant Code is required" : ""
        }

        if (!this.errors.sub_mobile && !isPhone.test(this.sub_mobile_number)) {
          this.errors.sub_mobile = 'Invalid Phone Format'
          this.error = true
        }

        if (!this.errors.sub_email && !isEmail.test(this.sub_email)) {
          this.errors.sub_email = 'Invalid Email Format'
          this.error = true
        }

        if (!this.errors.sub_firstname && !isName.test(this.sub_firstname)) {
          this.errors.sub_firstname = 'Invalid Name Format'
          this.error = true
        }

        if (!this.errors.sub_lastname && !isName.test(this.sub_lastname)) {
          this.errors.sub_lastname = 'Invalid Name Format'
          this.error = true
        }

        if (!this.errors.sub_account_number && !isNumber.test(this.sub_account_number)) {
          this.errors.sub_account_number = 'Invalid Account Format'
          this.error = true
        }

        if(!this.sub_email) this.error = true
        if(!this.sub_mobile_number) this.error = true
        if(!this.sub_firstname) this.error = true
        if(!this.sub_lastname) this.error = true
        if(!this.sub_password) this.error = true
        if(!this.sub_business_name) this.error = true
        if(!this.sub_address) this.error = true
        if(!this.sub_state) this.error = true
        if(!this.sub_bank_code) this.error = true
        if(!this.sub_account_number) this.error = true
        if(!this.sub_bvn) this.error = true
        if(!this.superMerchantCode) this.error = true
      }

    }

  }

  saveMerchant(){
    this.check()

    if(this.error){
      this.toast.error('Please Check Errors')
      return;
    }


    if(this.superMerchant){
     
      const check = confirm('Do you wish to save this Super Merchant?');
      if (!check) return;

      let datas = {
          email: this.email,
          mobile: this.mobile_number,
          firstname: this.firstname,
          lastname: this.lastname,
          password: this.password,
          businessname: this.business_name,
          address: this.address,
          state: this.state,
          bank_code: this.bank_code,
          account_number: this.account_number,
          bvn: this.bvn
  
      }
      const apiURL = `:5009/v1/merchants/create/supermerchant`;
      this.payvueservice.apiCall(apiURL, 'post', datas ).then(data => {

          this.toast.success(data.message)
        
      }).catch(error => {
        console.error(error);
        this.isData = false;
      });
    } else if(!this.superMerchant){

      // this.check()
      // if(this.error) return;
      const check = confirm('Do you wish to save this Sub Merchant?');
      if (!check) return;

      let datas : any

      if(this.same_account_details){
        datas = {
          email: this.sub_email,
          mobile: this.sub_mobile_number,
          firstname: this.sub_firstname,
          lastname: this.sub_lastname,
          password: this.sub_password,
          businessname: this.sub_business_name,
          address: this.sub_address,
          state: this.sub_state,
          superMerchantCode: this.superMerchantCode,
          same_account_details : this.same_account_details

      }
        
  
      } else {
        datas = {
          email: this.sub_email,
          mobile: this.sub_mobile_number,
          firstname: this.sub_firstname,
          lastname: this.sub_lastname,
          password: this.sub_password,
          businessname: this.sub_business_name,
          address: this.sub_address,
          state: this.sub_state,
          bank_code: this.sub_bank_code,
          account_number: this.sub_account_number,
          bvn: this.sub_bvn,
          superMerchantCode: this.superMerchantCode
  
      }
      }

     
    const apiURL = `:5009/v1/merchants/create/submerchant`;
    this.payvueservice.apiCall(apiURL, 'post', datas ).then(data => {

        this.toast.success(data.message)
      
    }).catch(error => {
      console.error(error);
      this.isData = false;
    });
    }
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
    let tableData = []
    let exportData = []

    exportData = tableData

    const input = {
      config: {
        body: exportData,
        multiple: true,
        name: ["TRANSACTIONS", "SETTLEMENT", "SETTLEMENT ITEX"],
        // columns: {index: [1], names:  [["hello", "hi", "whatsup"]] }
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
      this.getMerchants();
    }
  }

  setName(name){
    this.name = name;
  }

  getMerchants(sub?) {

    let page = this.page < 1 ? 1 : this.page

    this.tableData = [];
    this.isData = undefined;

    if (this.date2) {
      this.from = this.date2
      this.to = this.date2
    }

    let user: any
    let merchant: any

    if(this.isSuper){
      user = this.payvueservice.getUser();
      merchant = user.merchantcode

    } else if(sub){
     
      merchant = sub
    } 
   

    let apiURL = ``;
    if(sub || this.isSuper){
      apiURL = `:5009/v1/merchants/submerchantforsupermerchant/${merchant}`;

    } else if(this.super){
      apiURL = `:5009/v1/merchants/supermerchant`;

    }
    this.payvueservice.apiCall(apiURL).then(data => {
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

      if(sub){
        this.isSub = true;
      } else{
        this.isSub = false;
      }
      
    }).catch(error => {
      console.error(error);
      this.isData = false;
    });
  }


  pageChanged(event: any): void {
    this.page = event.page;
    this.getMerchants();
  }

  setLimit(event: any) {
    this.limit = event.target.value;
  }

  setPage() {
    this.page = 1;
  }
}