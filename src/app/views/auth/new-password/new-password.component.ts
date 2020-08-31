import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PayVueApiService } from 'app/providers/payvue-api.service';
import { ToastService } from 'ng-uikit-pro-standard';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss']
})
export class NewPasswordComponent implements OnInit {
  password: string;
  co_password: string;

  loading: boolean = false;
  errors: any
  error: boolean;

  constructor(private payvueservice: PayVueApiService, private toast: ToastService) { }

  ngOnInit() {
    this.errors = {
      password: "",
      length: "",
      co_pass: ""
    }
  }

  sendReset() {
    this.errors = {
      password: "",
      length: "",
      co_pass: ""
    }
    this.loading = true;

    this.errors = {
      password: !this.password ? "Password is required" : "",
      length: (this.password && this.password.length < 8) ? "Minimum password length is 8" : "",
      co_pass: ((this.password !== this.co_password) && this.password) ? "Passwords do not match" : ""
    }

    if(!this.password) this.error = true
    if((this.password && this.password.length < 8)) this.error = true
    if(((this.password !== this.co_password) && this.password)) this.error = true
    
    if(!this.error){
    const apiURL = `auth/reset`;
    this.payvueservice.apiCall(apiURL, 'patch', {
      password: this.password
    }).then(data => {
      this.loading = false;
        this.toast.success(data.data.message)
    }).catch(error => {
      console.log(error);
      let errorBody = JSON.parse(error._body)
      if(errorBody.fields) {
        this.toast.error(errorBody.fields.password, errorBody.error)
        this.loading = false;
      }
      else {
        this.toast.error(errorBody.error)
        this.loading = false;
      }
    
    })
  } else {
    this.loading = false;
  }
  }
  

}
