import { Component, OnInit, Input } from '@angular/core';

import { PayVueApiService } from "../../../providers/payvue-api.service";
import {ToastService} from 'ng-uikit-pro-standard';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  email: string;
  phone: string;
  emailError: string;
  isEmailError: boolean;

  password: string;
  isPassError: boolean;
  passError: string;

  firstname: string;
  firstError: string;
  isFirstError: boolean;
  emailFormat = '^[\\w._-]+@[\\w]+[-.]?[\\w]+\.[\\w]+$'
  nameFormat = '^[a-zA-Z]+$'
  phoneFormat = /^(0|234|\+234)[0-9]{10}$/

  lastname: string;
  lastError: string;
  isLastError: boolean;

  role: string;

  loading = false;
  errors: any
  error: boolean;
  constructor(private payvueservice: PayVueApiService, private toast: ToastService) { }

  optionsSelect: Array<any>;
  ngOnInit() {
    this.optionsSelect = [
      // { value: '', label: 'Staff' },
      // { value: 'account_rel_manager', label: 'Account Relationship Manager' },
      // { value: 'branch_op_manager', label: 'Branch Operations Manager' },
      // { value: 'branch_manager', label: 'Branch Manager' },
      // { value: 'internal_control', label: 'Internal Control' },
      // { value: 'head_office', label: 'Head Office' }, 
      { value: 'Admin', label: 'Admin' },
      // { value: 'super admin', label: 'Super Admin' },
      ];

      this.errors = {
        firstname: "",
        firstValid: "",
        lastname: "",
        lastValid: "",
        email: "",
        email_detail: "",
        password: "",
        length: "",
        permissions: "",
        phone: "",
        phone_detail: ""
        // role: "",
        // country: ""
      }
    }

    userDetails = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        // Validators.email,
  
        Validators.pattern(this.emailFormat)
      ]),
      first: new FormControl('', [
        Validators.required,
        // Validators.email,
  
        Validators.pattern(this.nameFormat)
      ]),
      last: new FormControl('', [
        Validators.required,
        // Validators.email,
  
        Validators.pattern(this.nameFormat)
      ]),
      // phone: new FormControl('', [
      //   Validators.required,
      //   // Validators.email,
  
      //   Validators.pattern(this.nameFormat)
      // ]),
    });
  
  

  register(){
    this.errors = {
      firstname: "",
      firstValid: "",
      lastname: "",
      lastValid: "",
      email: "",
      email_detail: "",
      password: "",
      length: "",
      permissions: "",
      // role: "",
      // country: ""
    }
    this.error = false;

    this.loading = true;
    this.isFirstError = false;
    this.isLastError = false;
    this.isEmailError = false;
    this.isPassError = false;

    this.firstname = this.userDetails.get('first').value
    this.lastname = this.userDetails.get('last').value
    this.email = this.userDetails.get('email').value
    // this.phone = this.userDetails.get('phone').value



    this.errors = {
      firstname: !this.firstname ? "First Name is required" : "",
      first_detail: (!this.userDetails.get('first').valid && this.firstname) ? "This is not a Valid First Name" : "",
      lastname: !this.lastname ? "Last Name is required" : "",
      last_detail: (!this.userDetails.get('last').valid && this.lastname) ? "This is not a Valid Last Name" : "",
      email: !this.email ? "Email is required" : "",
      email_detail: (!this.userDetails.get('email').valid && this.email) ? "This is not a Valid Email" : "",
      password: !this.password ? "Password is required" : "",
      length: (this.password && this.password.length < 8) ? "Minimum password length is 8" : "",
      phone: (!this.phone) ? "Phone Number is required" : "",
      phone_detail: (!this.phoneFormat.test(this.phone) && this.phone) ? "This is not a Valid Phone Number" : "",

      // role: this.role == undefined ? "Role must be provided" : ""
    }

    if(!this.firstname) this.error = true
    if((!this.userDetails.get('first').valid && this.firstname)) this.error = true
    if(!this.lastname) this.error = true
    if((!this.userDetails.get('last').valid && this.lastname)) this.error = true
    if(!this.email) this.error = true
    if((!this.userDetails.get('email').valid && this.email)) this.error = true
    if(!this.password) this.error = true
    // if(this.role == undefined) this.error = true
    if(this.password && this.password.length < 8) this.error = true
    if(!this.phone) this.error = true
    if((!this.phoneFormat.test(this.phone) && this.phone)) this.error = true
    
    if(!this.error) {
    const apiURL = `:5009/v1/merchants/createAdmin
    `;
    this.payvueservice.apiCall(apiURL, 'post', {firstname: this.firstname, lastname: this.lastname, email: this.email, password: this.password, mobile: this.phone}).then(data =>
      {
        this.loading = false;
          this.toast.success(data.message);

      }).catch(error => {
        if (error.error) {
          if (typeof error.error.message == 'string') {
            this.toast.error(error.error.message)


          } else {
            this.toast.error(error.error.message.toString())

          }
        } else {
          this.toast.error(error.message)
        }

        this.loading = false;
      })
    } else {
      this.loading = false;
    }
  }

}
