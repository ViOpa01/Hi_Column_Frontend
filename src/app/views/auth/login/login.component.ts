import { Router } from '@angular/router';
import { LoginVm } from '../../../Models/login-vm';
import { Component, OnInit } from '@angular/core';
import { PayVueApiService } from "../../../providers/payvue-api.service";
import { AuthService } from '../../../providers/auth.service';
import { ToastService } from 'ng-uikit-pro-standard';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;
  orangeFormName:string='';
  loginVm : LoginVm;
  loading = false;
  error: boolean
  errors: any

  category = {
    state: [],
    bankcodes: [],

  }

  // emailFormat = '^[\\w._-]+@[\\w]+[-.]?[\\w]+\.[\\w]+$'
  // idFormat = '^\\w{15}$'
  constructor(private router:Router, private payvueservice: PayVueApiService, private authService: AuthService, private toast: ToastService) { 

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

      return (emailFormat.test(c.value)) ? null : {
        validateInput: {
          valid: false
        }
      };
    }
  

  ngOnInit() {
    localStorage.removeItem('itt')
    // this.loginVm = new LoginVm();
    // console.log("Login Init");localStorage.Special='true';

    this.errors = {
      email_detail: "",
      password_length: "",
      password: "",
      email: ""
    }
  }


  errorHandler() {

    this.email = this.userDetails.get('email').value
    this.errors = {
      email_detail: (!this.userDetails.get('email').valid && this.email) ? "This is not a Valid Email" : "",
      password_length: (this.password && this.password.length < 8) ? "Minimum password length is 8 " : "",
      password: !this.password ? "Password is Required" : "",
      email: !this.email ? "Email is required" : ""
    }

    if((!this.userDetails.get('email').valid && this.email)) this.error = true
    if(!this.password) this.error = true
    if(!this.email) this.error = true
    if(this.password && this.password.length < 8) this.error = true

  }

  getCategory(type?) {
    const apiURL = `:5009/v1/location/statelgas/states`;
    const apiURL2 = `:5009/v1/services/getserviceplan/FUNDTRANSFERSNG`;

    if (type == 'state' || !type) {
      this.payvueservice.apiCall(apiURL)
        .then(data => {
          if (data.data.length) {
            this.category.state = data.data
            localStorage.setItem('state', JSON.stringify(this.category.state))
          } else {

            this.getCategory('state')
          }
        }).catch(error => {
          this.toast.error(error.message)
        })

    }

    if (type == 'bank' || !type) {
      this.payvueservice.apiCall(apiURL2)
        .then(data => {
          if (data.data.length) {
            this.category.bankcodes = data.data
            localStorage.setItem('bankcodes', JSON.stringify(this.category.bankcodes))
          } else {
            this.getCategory('bank')
          }
        }).catch(error => {
          this.toast.error(error.message)
        })
    }
  }
  
  signIn(){
    this.errors = {
      email_detail: "",
      password_length: "",
      password: "",
      email: ""
    }
    this.error = false;
    this.loading = true;
    const apiURL = `:5009/v1/auth/signinwebpay`;
    
    this.errorHandler()

    if(!this.error){
    this.payvueservice.apiCall(apiURL, 'post', {email: this.email, password: this.password}).then(data =>
      {
        this.loading = false;
        if(data.status == 200){
          this.authService.logIn(data.accesstoken.token, data.data)
          this.getCategory()
        }
        else {
          this.router.navigate(['/login']);
        }
      }).catch(error => {
        console.log('failed to login', error)
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
    }
    else {
      this.loading = false;
    }
    // localStorage.Special='false';
    // this.router.navigate(['/dashboards/'])
  }

}
