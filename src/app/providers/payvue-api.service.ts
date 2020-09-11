import { Injectable, EventEmitter } from '@angular/core';
import { HttpHeaders, HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import 'rxjs';
import { AuthService } from './auth.service';
import { environment } from 'environments/environment';
import 'rxjs/add/operator/catch';
import { throwError } from 'rxjs';
import { ToastService } from 'ng-uikit-pro-standard';


@Injectable()
export class PayVueApiService {

  // private rootURL = environment.baseUrl + '/api/v1/';
  private rootURL = environment.baseUrl;
  uploadPercent = new EventEmitter();
  isDone = new EventEmitter();
  constructor(private http: HttpClient,
    private authservice: AuthService,
    // private socket: Socket,
    private toast: ToastService
  ) { }

  getUser(): any {
    const userStr = localStorage.getItem('user');
    try {
      const user = JSON.parse(userStr);
      return user;
    }
    catch (error) {
      return null;
    }
  }
  apiCall(url, method = 'get', data = {}, isFormData = false, showProgress = false, sysid?): Promise<any> {
    let apiURL = `${this.rootURL}${url}`;
    // if(isFormData) apiURL = `http://192.168.9.123:3000/${url}`
    // if(isFormData) apiURL = `http://23.239.0.110:8082/${url}`
    
    let headers = new HttpHeaders();
    if (!isFormData) headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Authorization', '' + localStorage.getItem('itt'));

    if(sysid){
      console.log('here')
      headers = headers.append('sysid', localStorage.getItem('sysid'))
    }

    headers = headers.append('Access-Control-Allow-Origin', '*');
    
    let options = { headers, reportProgress: false, observe: '' };
    if (showProgress) {
      options.reportProgress = true,
        options.observe = 'events'
    }

    const request = this.http[method](apiURL, 'get delete'.includes(method) ? options : data, options);

    return new Promise((resolve, reject) => {
      request.subscribe(event => {
        if (showProgress && event.type === HttpEventType.UploadProgress) {
          const percentDone = Math.round(100 * event.loaded / event.total);
          this.uploadPercent.emit(percentDone);
        } else if (event instanceof HttpResponse) {
          const done = 'File is completely uploaded!'
          this.isDone.emit(done);
        }
        if (event.type === HttpEventType.Response || !event.body) {
          resolve(event.body || event)
        }
      }, error => {
        this.authservice.checkSession(error)
        if(typeof error.message == 'string'){
          this.toast.error(error.message)


        }else{
          this.toast.error(error.message.toString())

        }
        console.log(error, 'errors are happening')
        reject(error);
      })
    })
  }
}

