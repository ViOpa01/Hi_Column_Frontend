import { Component, OnInit } from '@angular/core';

import { PayVueApiService } from "../../../providers/payvue-api.service";
import {ToastService} from 'ng-uikit-pro-standard';
import { FormGroup, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export class ResetComponent implements OnInit {
  email: string;
  emailError: string;
  isEmailError: boolean;
  error: boolean
  errors: any
  loading = false;

  constructor(private payvueservice: PayVueApiService, private toast: ToastService) { }

  ngOnInit() {
    this.errors = {
      email_detail: "",
      email: ""
    }
  }

  userDetails = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      this.validateInput
      // Validators.email,

      // Validators.pattern(this.emailFormat)
    ]),
    }); 

    validateInput(c: FormControl) {
      let emailFormat = /^[\w._-]+@[\w]+[-.]?[\w]+\.[\w]+$/; 
      let idFormat = /^\w{15}$/

      return (emailFormat.test(c.value) || idFormat.test(c.value)) ? null : {
        validateInput: {
          valid: false
        }
      };
    }

    errorHandler() {
    this.email = this.userDetails.get('email').value

      this.errors = {
        email_detail:  (!this.userDetails.get('email').valid && this.email) ? "This is not a Valid Email or Merchant ID" : "",
        email: !this.email ? "Email or Merchant ID is required" : ""
      }
  
      if( (!this.userDetails.get('email').valid && this.email)) this.error = true
      if(!this.email) this.error = true
  
    }

  reset(){
    this.errors = {
      email_detail: "",
      email: ""
    }
    this.error = false;
    this.isEmailError = false;
    this.loading = true;
    const apiURL = `auth/reset/`;

    this.errorHandler()

    if(!this.error){
    this.payvueservice.apiCall(apiURL, 'post', {email: this.email}).then(data =>
      {
        this.loading = false;
        
           this.toast.success(`${data.data.message} at ${data.data.email}`)
       
      }).catch(error => {
        let errorBody = error.error
        let err = ''
        if(errorBody.error === 'Validation errors.')
        {
          if(errorBody.fields.email) {
            this.emailError = errorBody.fields.email;
            this.isEmailError = true;
            err += this.emailError + ' '
          }
        }
        
        this.toast.error(err,`failed: ${errorBody.error}`)
        this.loading = false;
      })
    }
    else{
      this.loading = false;
    }
  }
}
