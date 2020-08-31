import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { PayVueApiService } from 'app/providers/payvue-api.service';
import { ToastService } from 'ng-uikit-pro-standard';

@Component({
  selector: 'app-reset-out',
  templateUrl: './reset-out.component.html',
  styleUrls: ['./reset-out.component.scss']
})
export class ResetOutComponent implements OnInit {
  email: string;
  token: string;
  password: string;
  co_password: string;
  errors: any
  error: boolean;

  loading: boolean;

  constructor(private router: Router, private route: ActivatedRoute, private payvueservice: PayVueApiService, private toast: ToastService) { }

  ngOnInit() {
    this.email = this.route.snapshot.queryParamMap.get('email');
    this.token = this.route.snapshot.queryParamMap.get('token');

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
    const apiURL = `auth/reset`;

    if(!this.error){
    this.payvueservice.apiCall(apiURL, 'patch', {
      email: this.email,
      token:this.token,
      password: this.password
    }).then(data => {
      if(data.status == 200) {
        this.loading = false;
        this.toast.success(data.data.message)
        this.router.navigate(['/login']);
      }
    }).catch(error => {
      let errorBody = JSON.parse(error._body)
      if(errorBody.fields) {
        this.toast.error(errorBody.fields.password, errorBody.error,)
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
