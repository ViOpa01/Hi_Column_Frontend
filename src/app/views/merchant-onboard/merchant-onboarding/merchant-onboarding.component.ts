import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { PayVueApiService } from '../../../providers/payvue-api.service';
import { ToastService } from 'ng-uikit-pro-standard';
import eventsService from '../../../providers/events.service';

@Component({
  selector: 'app-merchant-onboarding',
  templateUrl: './merchant-onboarding.component.html',
  styleUrls: ['./merchant-onboarding.component.scss']
})

export class MerchantOnboardingComponent implements OnInit {
  
  @Input() shadows = false;

  positions = {
    account_rel_manager: 1,
    branch_op_manager: 2,
    branch_manager: 3,
    internal_control: 4,
    head_office: 5,
  };

  approval_stages = {
    1: 'Account Relations Manager',
    2: 'Branch Operations Manager',
    3: 'Branch Manager',
    4: 'Internal Control',
    5: 'Head Office',
    6: 'Approved'
  };

  approval_position: number;

  position: string = "";

  merchant_id: string = "";

  next: boolean = false;
  next2: boolean = false;
  new: boolean = false;
  edit: boolean
  id: string = "";

  merchants: any[] = [];
  isData: boolean;

  details: any;

  company_name: string = ""; //this is merchant_name
  rc_number: number
  name_address: string = "";
  merchant_phone: string = "";
  merchant_email: string = "";

  industry: any[];
  others: string = "";
  merchant_contacts: any[];
  terminals: any[];

  merch_details: { isMap: boolean, id: string}[] = []

  contact_name: any[] = [];
  contact_designation: any[] = [];
  contact_office_phone: any[] = [];
  contact_mobile: any[] = [];
  contact_email: any[] = [];

  products: string = "";

  branch: string = "";
  account_name: string = "";
  account_number: string = "";
  bvn: string = "";

  time: string = "";
  amount: string = "";
  account: string = "";
  alert: string = "";

  terminal_details: any[] = [];
  isMore: boolean;

  attach = false;

  terminal_number: number;

  terminal_location: string = "";
  contact_person: string = "";
  phone_number: string = "";
  POS_number: number;
  organisedArray: any[] = [];

  ussd: string = "";
  business_code: string = "";
  pan_account: string = "";
  staff_name: string = "";
  staff_id: string = "";
  upperlimit: number;
  settlement_cycle: number;
  msc_rate: number;

  terminal_index: number;

  error_size: string;
  errors: any = {};
  error: boolean;
  others_mcc: string = "1003"


  isSave: any[] = [3];


  isNext = false;

  business = [
    { name: 'stores', value: 'Stores and Supermarket', mcc: '5499', charge: '' },
    { name: 'cosmetics', value: 'Cosmetics', mcc: '5977', charge: '' },
    { name: 'design', value: 'Interior Design', mcc: '5712', charge: '' },
    { name: 'courier', value: 'Logistics/Courier', mcc: '4215', charge: '' },
    { name: 'club', value: 'Club/Bar', mcc: '5813', charge: '' },
    { name: 'electronics', value: 'Electronics', mcc: '5732', charge: '' },
    { name: 'gym', value: 'Gym', mcc: '7997', charge: '' },
    { name: 'hotel', value: 'Hotel/Guest House', mcc: '7011', charge: '' },
    { name: 'food', value: 'Fast Food', mcc: '5814', charge: '' },
    { name: 'embassy', value: 'Embassy', mcc: '9399', charge: '' },
    { name: 'cyber', value: 'Cyber Café', mcc: '5045', charge: '' },
    { name: 'airline', value: 'Airlines', mcc: '4511', charge: '' },
    { name: 'de_change', value: 'Bureau de Change', mcc: '', charge: '' },
    { name: 'hospitals', value: 'Hospitals', mcc: '8062', charge: '' },
    { name: 'automobile', value: 'Automobile Parts', mcc: '5511', charge: '' },
    { name: 'travel', value: 'Travel Agencies', mcc: '4722', charge: '' },
    { name: 'catering', value: 'Catering Services', mcc: '5811', charge: '' },
    { name: 'jewelry', value: 'Jewelry', mcc: '5944', charge: '' },
    { name: 'laundry', value: 'Laundry', mcc: '7210', charge: '' },
    { name: 'telecoms', value: 'Telecoms', mcc: '4814', charge: '' },
    { name: 'church', value: 'Church/NGO', mcc: '8398', charge: '' },
    { name: 'salon', value: 'Salon', mcc: '7230', charge: '' },
    { name: 'books', value: 'Bookshop', mcc: '5943', charge: '' },
    { name: 'wholesaler', value: 'Wholesaler', mcc: '5300', charge: '' },
    { name: 'education', value: 'Education/Schools', mcc: '8299', charge: '' },
    { name: 'security', value: 'Security Services', mcc: '7393', charge: '' },
    { name: 'legal', value: 'Legal Services', mcc: '8111', charge: '' },
    { name: 'restaurants', value: 'Restaurants', mcc: '5812', charge: '' },
    { name: 'fuel', value: 'Fuel Stations', mcc: '5983', charge: '' }
  ]

  compliance = [
    { name: 'background_check', value: 'Background check on prospective merchants and Principal Shareholders / Key Officers', value2: '', value3: "Background Check" },
    { name: 'credit_check', value: 'Credit check, Background Investigations and Reference checks of merchant', value2: '', value3: "Credit Check, Background Investigations and Reference checks" },
    { name: 'physical_inspection', value: 'Physical Inspectton of Premises and Records ', value2: '', value3: "Physically Inspect Premises and Records" },
    { name: 'previous_agreement', value: 'Investigate into the merchants previous POS agreements and (provide issue report if any)', value2: '', value3: "Previous POS agreements Investigation" },

  ]

  conditions: any = {};
  itemCount: number;
  serial = 0;
  page = 1;
  limit = 50;
  private sorted = false;

  constructor(private payvueservice: PayVueApiService, private toast: ToastService) {
    let user = payvueservice.getUser();
    this.position = user.position;
    this.approval_position = this.positions[this.position];

  }

  ngOnInit() {
    this.getMerchants();

    for(let i = 0; i < this.isSave.length; i++) {
      this.isSave[i] = false;
    }

    eventsService.getEvent('terminal-inventory').subscribe(data => {
      if(data) this.merch_details[this.terminal_index].isMap = true
    })

    eventsService.getEvent('OnboardingPage').subscribe(page => {
      this.page = page;
      this.getMerchants();
    })
  }

  setDetails(row: any) {
    this.details = row;

    const dis = this;
    this.details.terminals.forEach(id => {
      
      dis.merch_details.push({ isMap: undefined, id: "" })
      console.log( dis.merch_details, 'hello');
    })
  }

  check() {
    let result = this.merchants.filter(id => id._id === this.id);
    
    if((result[0]||{}).merchant_id) {
      this.attach = true
    }
    else{
      this.toast.info('Please Add Merchant ID', 'Missing Merchant ID')
    }
  }


  check2() {
    let result = this.merchants.filter(id => id._id === this.id);
    if((result[0]||{}).merchant_id) {
     return true
    }
    else{
      return false
    }
  }

  reactiveForm: FormGroup = new FormGroup({
    stores: new FormControl(false),
    cosmetics: new FormControl(false),
    design: new FormControl(false),
    courier: new FormControl(false),
    club: new FormControl(false),
    electronics: new FormControl(false),
    gym: new FormControl(false),
    hotel: new FormControl(false),
    food: new FormControl(false),
    embassy: new FormControl(false),
    cyber: new FormControl(false),
    airline: new FormControl(false),
    de_change: new FormControl(false),
    hospitals: new FormControl(false),
    automobile: new FormControl(false),
    travel: new FormControl(false),
    catering: new FormControl(false),
    jewelry: new FormControl(false),
    laundry: new FormControl(false),
    telecoms: new FormControl(false),
    church: new FormControl(false),
    salon: new FormControl(false),
    books: new FormControl(false),
    wholesaler: new FormControl(false),
    education: new FormControl(false),
    security: new FormControl(false),
    legal: new FormControl(false),
    restaurants: new FormControl(false),
    fuel: new FormControl(false),
    background_check: new FormControl(false),
    credit_check: new FormControl(false),
    physical_inspection: new FormControl(false),
    previous_agreement: new FormControl(false),
  });

  checkProperties(obj) {
    for (var key in obj) {
        if (obj[key] !== undefined && obj[key] != "" && obj[key] !== null)
            return true;
    }
    return false;
}
  checkFirstPage(status = true) {
    const isPhone = /^(0|234|\+234)[0-9]{10}$/
    const isEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

    this.error = false;

    if (!this.isNext) return;

    this.errors = {
      merchant_name: !this.company_name ? "Merchant/Comapny Name is required" : "",
      rc_number: !this.rc_number ? "RC Number is required" : "",
      name_address: !this.name_address ? "Address is required" : "",
      merchant_phone: !this.merchant_phone ? "Phone Number is required" : "",
      merchant_email: !this.merchant_email ? "Email is required" : "",
      industry: (!this.industry.length && !this.others) ? "Business Segment is required" : "",
      merchant_contacts: !this.merchant_contacts.length ? "Contact Information is required" : "",
      contact_name: [],
      contact_designation: [],
      contact_mobile: [],
      contact_email: [],
    }

    if(!this.errors.merchant_phone && !isPhone.test(this.merchant_phone)) {
      this.errors.merchant_phone = 'Invalid Phone Format'
    }

    if(!this.errors.merchant_email && !isEmail.test(this.merchant_email)) {
      this.errors.merchant_email = 'Invalid Email Format'
    }


    let contacts = this.merchant_contacts

    for( var key in contacts) {
      const check = this.checkProperties(contacts[key]);
      if(check) {
        let i = parseInt(key)
        this.merchant_contacts = this.merchant_contacts.splice(i,1)
      }
    }

    
    for (let i = 0; i < this.merchant_contacts.length; i++) {

      const prefix = i === 0 ? 'Primary ' : '';
      if (!this.contact_name[i]) {
        this.errors.contact_name[i] = `${prefix}Contact Name is required`;
        this.error = true;
      }

      if (!this.contact_designation[i]) {
        this.errors.contact_designation[i] = `${prefix}Contact Designation is required`;
        this.error = true;
      }

      if (!this.contact_mobile[i]) {
        this.errors.contact_mobile[i] = `${prefix}Contact Phone is required`;
        this.error = true;
      } else if (!isPhone.test(this.contact_mobile[i])) {
        this.errors.contact_mobile[i] = `Invalid Phone Format`;
        this.error = true;
      }

      if (!this.contact_email[i]) {
        this.errors.contact_email[i] = `${prefix}Contact Email is required`;
        this.error = true;
      } else if (!isEmail.test(this.contact_email[i])) {
        this.errors.contact_email[i] = `Invalid Email Format`;
        this.error = true;
      }
    }

    if (!this.company_name) this.error = true
    if (!this.rc_number) this.error = true
    if (!this.name_address) this.error = true
    if (!this.merchant_phone) this.error = true
    if (!this.merchant_email) this.error = true
    if (!this.industry.length && !this.others) this.error = true
    if (!this.merchant_contacts.length) this.error = true

    if (!this.error && this.isNext && status) {
      this.next = true;
      this.isNext = false;
    }
    else {
      this.next = false;
    }
  }


  checkSecondPage(status = true) {

    this.error = false;


    if (!this.isNext) return;

    this.errors = {
      products: !this.products ? "Products, Goods and Service Offerings are required" : "",
      terminal_number: !this.terminal_number ? "Number of POS Terminals is required" : "",
      time: !this.time ? "Business Opening Hours is required" : "",
      amount: !this.amount ? "Price Range of Items is required" : "",
      terminals: (!this.terminals.length) ? "POS Terminal Information is required" : "",
      account: !this.account ? "Account Type is required" : "",
      branch: !this.branch ? "Bank Branch is required" : "",
      account_name: !this.account_name ? "Account Name is required" : "",
      account_number: !this.account_number ? "Account Number is required" : "",
      bvn: !this.bvn ? "Bank BVN is required" : "",
      alert: !this.alert ? "SMS Alerts is required" : "",
    }


    if (!this.products) this.error = true
    if (!this.terminal_number) this.error = true
    if (!this.time) this.error = true
    if (!this.amount) this.error = true
    if (!this.terminals.length) this.error = true
    if (!this.account) this.error = true
    if (!this.branch) this.error = true
    if (!this.account_name) this.error = true
    if (!this.bvn) this.error = true
    if (!this.alert) this.error = true

    if (!this.error && this.isNext && status)  {
      this.onBoard();
    }
    else {
      this.next2 = false;
    }
  }

  checkThirdPage(status = true) {
    this.error = false;


    if (!this.isNext) return;

    this.errors = {
      ussd: !this.ussd ? "USSD Code is required" : "",
      business_code: !this.business_code ? "Business Occupation Code is required" : "",
      pan_account: !this.pan_account ? "PAN Account Number is required" : "",
      upperlimit: !this.upperlimit ? "Upper Limit is required" : "",
      settlement_cycle: !this.settlement_cycle ? "Settlement Cycle is required" : "",
      msc_rate: !this.msc_rate ? "MSC Rate is required" : "",
      compliance: []
    }

    let i = 0;
    for (const item of this.compliance) {
      if (!this.reactiveForm.controls[item.name].value || item.value2 == "") {

        this.errors.compliance[i] = `${item.value3} is required and Comment`
        this.error = true
      } else {
        this.errors.compliance[i] = ""
      }
      i++

    }

    if (!this.ussd) this.error = true
    if (!this.business_code) this.error = true
    if (!this.pan_account) this.error = true
    if (!this.upperlimit) this.error = true
    if (!this.settlement_cycle) this.error = true
    if (!this.msc_rate) this.error = true

    if (!this.error && this.isNext && status) {
      this.submit(this.id);
      this.isNext = false;
    }

  }

  openView() {
    this.new = true;
    this.next = true;
    this.next2 = true;
    this.edit = true;
  }

  getIndustries() {
    this.industry = [];
    for (const item of this.business) {
      if (this.reactiveForm.controls[item.name].value) this.industry.push(item.value)
    }
    this.industry = this.industry.concat(this.others.split(",").map(item => `${item}`.trim()).filter(item => item))
  }

  getContacts() {
    this.merchant_contacts = [];
    // this.contact_name = this.contact_name.filter(item => item)
    // this.contact_designation = this.contact_designation.filter(item => item)
    // this.contact_office_phone = this.contact_office_phone.filter(item => item)
    // this.contact_email = this.contact_email.filter(item => item)
    // this.contact_mobile = this.contact_mobile.filter(item => item)

    for (let i = 0; i < (this.contact_name.length || this.contact_designation.length || this.contact_office_phone.length || this.contact_email.length || this.contact_mobile.length); i++) {
      this.merchant_contacts.push({
        contact_name: this.contact_name[i],
        contact_designation: this.contact_designation[i],
        contact_tel: this.contact_office_phone[i],
        contact_phone: this.contact_mobile[i],
        contact_email: this.contact_email[i]
      })
      
      // if(this.next) {
      //   this.merchant_contacts = this.merchant_contacts.filter(item => item.contact_name && item.contact_designation && item.contact_email && item.contact_mobile)
      // }
    }
  }

  getTerminals() {
    this.terminals = [];
    for (const item of this.organisedArray) {
      this.terminals.push({
        location: item.terminal_location,
        contact_name: item.contact_person,
        contact_phone: item.phone_number,
        count: item.POS_number
      })
    }

  }

  getCompliance() {
    this.conditions = {};
    for (const item of this.compliance) {
      if (this.reactiveForm.controls[item.name].value) this.conditions[`${item.name}`] = item.value2
    }
  }

  approve(id) {
    const check = confirm('Do you wish to approve this Merchant?');
    if (!check) return;
   this.isSave[2] = true;
    const apiURL = `merchants/approve`
    this.payvueservice.apiCall(apiURL, 'post', {mid: id}).then(data => {
      this.toast.success(data.message);
      this.getMerchants();
      this.isSave[2] = false;
    }).catch(error => {
      this.isSave[2] = false;
      let errorBody = JSON.parse(error._body)
      this.toast.error(errorBody.error)
      console.log(error)
    })
  }

  setMerchant(id) {
    const check = confirm('Do you wish to set this as the Merchant ID?');
    if (!check) return;
   this.isSave[3] = true;
    const apiURL = `merchants/approve`
    this.payvueservice.apiCall(apiURL, 'patch', {mid: id, merchant_id: this.merchant_id}).then(data => {
      this.toast.success(data.message);
      this.getMerchants();
      this.isSave[3] = false;
    }).catch(error => {
      this.isSave[3] = false;
      let errorBody = JSON.parse(error._body)
      this.toast.error(errorBody.error)
      console.log(error)
    })
  }

  reject(id) {
    const check = confirm('Do you wish to reject this application?');
    if (!check) return;
   this.isSave[4] = true;
    const apiURL = `merchants/reject`
    this.payvueservice.apiCall(apiURL, 'patch', {mid: id}).then(data => {
      this.toast.success(data.message);
      this.getMerchants();
      this.isSave[4] = false;
    }).catch(error => {
      this.isSave[4] = false;
      let errorBody = JSON.parse(error._body)
      this.toast.error(errorBody.error)
      console.log(error)
    })
  }

  addMore() {
    this.error_size = "";

    const isPhone = /^(0|234|\+234)[0-9]{10}$/

    if(!this.terminal_location)this.errors.terminals = 'Terminal Location is Required';
    else if(!this.contact_person)this.errors.terminals = 'Contact Person is Required';
    else if(!this.phone_number)this.errors.terminals = 'Phone Number is Required';
    else if(this.phone_number && !isPhone.test(this.phone_number))this.errors.terminals = 'Invalid Phone Format';
    else if(!this.POS_number)this.errors.terminals = 'POS Number is Required';
    else if (this.terminal_location && this.contact_person && this.phone_number && this.POS_number) {
      this.organiser({ terminal_location: this.terminal_location, contact_person: this.contact_person, phone_number: this.phone_number, POS_number: this.POS_number });
    }
  }

  private organiser(item: any) {
    let obj = this.organisedArray.find(rec => (rec.terminal_location === item.terminal_location) && (rec.contact_person === item.contact_person) && (rec.phone_number === item.phone_number));
    const pos_number = this.organisedArray.reduce((a, b) => ({ POS_number: (a.POS_number || 0) + (b.POS_number || 0) }), {}).POS_number || 0;
    let total_number = pos_number + item.POS_number - (obj ? obj.POS_number : 0);
    if (total_number > this.terminal_number) {
      this.error_size = "Number of POS exceeded, check number of POS Terminals specified above"
      return;
    }
    if ( this.POS_number < 1) {
      this.error_size = "Invalid Number of POS"
      return;
    }
    if (obj) {
      obj.POS_number = item.POS_number
    }
    else {
      this.organisedArray.push(item);
    }

  }

  delete(index: number) {
    this.organisedArray.splice(index, 1);
  }

  onBoard() {
    this.isSave[0] = true;
    const apiURL = `merchants/onboard`
    this.payvueservice.apiCall(apiURL, 'post', {
      merchant_name: this.company_name,
      rc_number: this.rc_number,
      merchant_address: this.name_address,
      merchant_phone: this.merchant_phone,
      merchant_email: this.merchant_email,
      business_industry: this.industry,
      merchant_contacts: this.merchant_contacts,
      merchant_description: this.products,
      terminals: this.terminals,
      terminals_count: this.terminal_number,
      merchant_account_name: this.account_name,
      merchant_account_nr: this.account_number,
      merchant_account_type: this.account,
      bank_branch: this.branch,
      bvn: this.bvn,
      opening_hours: this.time,
      price_ranges: this.amount,
      receive_sms: this.alert
    }).then(data => {
      this.next2 = true;
      this.isNext = false;
      this.isSave[0] = false;

      this.toast.success(data.message);

      this.isMore = undefined;
      // this.new = false;
      this.id = data.data._id

      this.company_name = "";
      this.rc_number = NaN;
      this.name_address = "";
      this.merchant_phone = "";
      this.merchant_email = "";
      this.industry = [];
      this.others = "";

      this.merchant_contacts = [];
      this.contact_name = [];
      this.contact_designation = [];
      this.contact_office_phone = [];
      this.contact_email = [];
      this.contact_mobile = [];

      this.products = "";

      this.terminals = [];
      this.organisedArray = [];

      this.terminal_number = NaN;

      this.account_name = "";
      this.account_number = "";
      this.account = "";
      this.branch = "";
      this.bvn = "";
      this.time = "";
      this.amount = "";
      this.alert = "";

    }).catch(error => {
      this.isSave[0] = false;
      let errorBody = JSON.parse(error._body)
      this.toast.error(errorBody.error)
      console.log(error)
    })
  }

  submit(id) {
    this.isSave[1] = true;
    const apiURL = `merchants/onboard`
    this.payvueservice.apiCall(apiURL, 'patch', {
      mid: id,
      msc_rate: this.msc_rate,
      ussd_code: this.ussd,
      business_occupation_code: this.business_code,
      pan_account_nr: this.pan_account,
      upper_limit: this.upperlimit,
      settlement_cycle: this.settlement_cycle,
      profile_compliance: this.conditions
    }).then(data => {
      this.toast.success(data.data.message);
      this.isSave[1] = false;
      this.ussd = "";
      this.pan_account = "";
      this.upperlimit = NaN;
      this.settlement_cycle = NaN;
      this.msc_rate = NaN;
      this.staff_name = "";
      this.staff_id = "";
      for (const item of this.compliance) {
        item.value2 = ""
      }
      this.conditions = {};
      this.new = false;
      this.getMerchants();

    }).catch(error => {
      this.isSave[1] = false;
      let errorBody = JSON.parse(error._body)
      this.toast.error(errorBody.error)
      console.log(error)
    })
  }

  getMerchants() {
    this.merchants = [];
    this.isData = undefined;
    const apiURL = `merchants/onboard/?page=${this.page}&limit=${this.limit}`
    this.payvueservice.apiCall(apiURL).then(data => {
      if (data.data.length) {
        this.itemCount = data.itemCount;
        this.serial = 1 + (this.page - 1) * this.limit;
        this.merchants = data.data;
       
        this.isData = true;
      } else {
        this.isData = false;
      }

    }).catch(error => {
      console.log(error)
      this.isData = false;

    })
  }

  pageChanged(event: any): void {
    this.page = event.page;
    this.getMerchants();
  }

  sortBy(by: string | any): void {

    this.merchants.sort((a: any, b: any) => {
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

}