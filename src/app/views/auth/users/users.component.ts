import { Component, OnInit } from '@angular/core';
import { PayVueApiService } from "../../../providers/payvue-api.service";
import { ToastService } from 'ng-uikit-pro-standard';
import eventsService from 'app/providers/events.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: any[] = []
  serial: number;
  page: number = 1;
  limit: number = 50;
  isData: boolean;
  itemCount: number;
  rotate = false;
  maxSize = 10;
  merchant_id: string = '';
  merchant_email: string = '';
  loading: boolean;
  private sorted = false;
  count: number;

  error: boolean
  errors: any

  users_data: {
    id: string;
    edit: boolean;
  }[] = [];

  emailFormat = '^[\\w._-]+@[\\w]+[-.]?[\\w]+\.[\\w]+$'
  idFormat = '^\\w{15}$'
  constructor(private payvueservice: PayVueApiService, private toast: ToastService) { }

  ngOnInit() {
    this.getUsers();

    eventsService.getEvent('ManageUsersPage').subscribe(page => {
      this.page = page;
      this.getUsers();
    })

    this.errors = {
      email_detail: "",
      id_detail: "",
      id: "",
      email: ""
    }
  }

  userDetails = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      // Validators.email,

      Validators.pattern(this.emailFormat)
    ]),
    id: new FormControl('', [
      Validators.required,
      // Validators.email,

      Validators.pattern(this.idFormat)
    ]),
  });



  onClickedOutside(e, index) {

    if (e.target.id !== `pointer-${index}`) {
      this.users_data[index].edit = false;
    }
  }

  errorHandler() {

    this.merchant_email = this.userDetails.get('email').value
    this.merchant_id = this.userDetails.get('id').value
    this.errors = {
      email_detail: (!this.userDetails.get('email').valid && this.merchant_email) ? "This is not a Valid Email" : "",
      email: !this.merchant_email ? "Email is required" : "",
      id_detail: (!this.userDetails.get('id').valid && this.merchant_id) ? "This is not a Valid Merchant ID" : "",
      id: !this.merchant_id ? "Merchant ID is required" : ""
    }

    if ((!this.userDetails.get('email').valid && this.merchant_email)) this.error = true
    if (!this.userDetails.get('id').valid && this.merchant_id) this.error = true
    if (!this.merchant_email) this.error = true
    if (!this.merchant_id) this.error = true

  }

  setFocus(event) {
    document.getElementById('root').onclick = function (e) {
      if (document.getElementById('root').contains(event.target.parentElement)) {
        // Clicked in box
      } else {
        // Clicked outside the box
      }
    }
  }

  getUsers() {
    this.count = 0;
    this.users = [];
    this.users_data = [];
    this.isData = undefined;
    const apiURL = `users/?page=${this.page}&limit=${this.limit}`;
    this.payvueservice.apiCall(apiURL).then(data => {

      if (data.data.length > 0) {
        this.users = data.data;
        this.serial = 1 + (this.page - 1) * this.limit;
        this.itemCount = data.itemCount;
        this.isData = true;
        const dis = this;

        this.users.forEach(id => {
          if (id.role == 'Admin') {
            dis.count++;
          }
          dis.users_data.push({ id: id._id, edit: undefined })
        })
      } else {
        this.isData = false;
        this.itemCount = 1;
      }
    }).catch(error => {
      console.log(error);
      this.isData = false;
    })
  }

  pageChanged(event: any): void {
    this.page = event.page;
    this.getUsers();
  }

  sortBy(by: string | any): void {

    this.users.sort((a: any, b: any) => {
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

  editRole(index, event) {
    const check = confirm('Do you wish to Edit this user\'s role?');
    if (!check) {
      this.users_data[index].edit = false;
      return;
    }
    const id = this.users_data[index].id
    const role = event.target.value
    const apiURL = 'users/';
    this.payvueservice.apiCall(apiURL, 'patch', { id, role }).then(data => {
      this.users_data[index].edit = false;
      this.toast.success(data.data.message);
      this.getUsers();
    }).catch(error => {
      let errorBody = JSON.parse(error._body)
      this.toast.error(errorBody.error)
    })
  }

  delete(id) {
    const check = confirm('Do you wish to delete this user?');
    if (!check) return;
    const apiURL = `users/${id}`;
    this.payvueservice.apiCall(apiURL, 'delete').then(data => {
      this.toast.success(data.data.message);
      this.getUsers();
    }).catch(error => {
      let errorBody = JSON.parse(error._body)
      this.toast.error(errorBody.error)
    })
  }

  changeEmail() {
    this.errors = {
      email_detail: "",
      id_detail: "",
      id: "",
      email: ""
    }

    this.errorHandler();

    if (!this.error) {
      const check = confirm('Do you wish to change this merchant\'s email?');
      if (!check) return;
      this.loading = true;
      const apiURL = `users/merchant`;

      this.payvueservice.apiCall(apiURL, 'post', { merchant_id: this.merchant_id, email: this.merchant_email }).then(data => {
        this.toast.success(data.data.message);
        this.merchant_id = '';
        this.merchant_email = '';
        this.loading = undefined;
      }).catch(error => {
        console.log(error)
        if(error.error){
          if(error.error.error){
          this.toast.error(error.error.error);
          }
        }
        this.loading = false;
      })
    }

  }

}
