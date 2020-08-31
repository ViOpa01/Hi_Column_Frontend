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
      { value: '', label: 'Staff' },
      // { value: 'account_rel_manager', label: 'Account Relationship Manager' },
      // { value: 'branch_op_manager', label: 'Branch Operations Manager' },
      // { value: 'branch_manager', label: 'Branch Manager' },
      // { value: 'internal_control', label: 'Internal Control' },
      // { value: 'head_office', label: 'Head Office' }, 
      { value: 'admin', label: 'Admin' },
      { value: 'super admin', label: 'Super Admin' },
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
        role: "",
        country: ""
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
      role: "",
      country: ""
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



    this.errors = {
      firstname: !this.firstname ? "First Name is required" : "",
      first_detail: (!this.userDetails.get('first').valid && this.firstname) ? "This is not a Valid First Name" : "",
      lastname: !this.lastname ? "Last Name is required" : "",
      last_detail: (!this.userDetails.get('last').valid && this.lastname) ? "This is not a Valid Last Name" : "",
      email: !this.email ? "Email is required" : "",
      email_detail: (!this.userDetails.get('email').valid && this.email) ? "This is not a Valid Email" : "",
      password: !this.password ? "Password is required" : "",
      length: (this.password && this.password.length < 8) ? "Minimum password length is 8" : "",
      role: this.role == undefined ? "Role must be provided" : ""
    }

    if(!this.firstname) this.error = true
    if((!this.userDetails.get('first').valid && this.firstname)) this.error = true
    if(!this.lastname) this.error = true
    if((!this.userDetails.get('last').valid && this.lastname)) this.error = true
    if(!this.email) this.error = true
    if((!this.userDetails.get('email').valid && this.email)) this.error = true
    if(!this.password) this.error = true
    if(this.role == undefined) this.error = true
    if(this.password && this.password.length < 8) this.error = true
    
    if(!this.error) {
    const apiURL = `auth/signup/`;
    this.payvueservice.apiCall(apiURL, 'post', {firstname: this.firstname, lastname: this.lastname, email: this.email, password: this.password, role: this.role}).then(data =>
      {
        this.loading = false;
        if(data.status == 201){
          this.toast.success(data.data.message);
        }
        else {
          this.toast.error(data.error)
        }
      }).catch(error => {
        let errorBody = error.error
        let err = ''
        if(errorBody.error === 'Validation errors.')
        {
          if(errorBody.fields.firstname) {
            this.firstError = errorBody.fields.firstname;
            this.isFirstError = true;

            err += this.firstError + ' '
          }
          if(errorBody.fields.lastname) {
            this.lastError = errorBody.fields.lastname;
            this.isLastError = true;
            err += this.lastError + ' '
          }
          if(errorBody.fields.email) {
            this.emailError = errorBody.fields.email;
            this.isEmailError = true;
            err += this.emailError + ' '

          }
          if(errorBody.fields.password) {
            this.passError = errorBody.fields.password;
            err += this.passError + ' '

            this.isPassError = true;
          }
        }
        
        this.toast.error(err,`failed: ${errorBody.error}`)
        this.loading = false;
      })
    } else {
      this.loading = false;
    }
  }

}
