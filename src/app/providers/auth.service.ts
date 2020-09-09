import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})


export class AuthService {
  origin_url: string;

  constructor(private router: Router) { }

  logout() {
    // if (window.location.pathname != '/')
    //     localStorage.setItem('redirect', window.location.pathname);
    localStorage.removeItem('itt');
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  logIn(token, user) {
    localStorage.setItem('itt', token)
    localStorage.setItem('sysid',"OTkxRkFFMTg3M0E1Njc0MjVDRTZFMTg1QzhDQzYxNzMzQTU2NzQ1QzhDQzYxNzM5OEFBQ0FFN0Q2NkJBQ0RFNw==")
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('user', JSON.stringify(user))
    // const userStr = localStorage.getItem('user');
    // const u = JSON.parse(userStr);

    let intendedURL = localStorage.getItem('intendedURL');
    if(intendedURL && intendedURL !== '/login') {
      localStorage.removeItem('intendedURL');
      this.router.navigateByUrl(intendedURL);
      return;
    }
    this.router.navigate(['/dashboard']);
    // if(u && u.role.toLowerCase() == 'merchant'){
    //   this.router.navigate(['dispute/merchant'])
    // }
    // else {
    //   this.router.navigate(['/dashboard']);
    // }
    
    
  }

  loggedIn() {
    return !!localStorage.getItem('itt');
  }

  checkSession(err) {
    console.log(err);
    let status = false;

    if(err.error.status == 400 ){

      for(let i = 0; i < err.error.errors.length; i++){
        if(err.error.errors[i] == "Invalid Authorization Token"){
          localStorage.setItem('intendedURL',location.pathname);
          this.logout();
          status = true;

          return;
        }
      }

      return status;
    }
  //   if (err.status == 401 || err.status == 403) {
  //     localStorage.setItem('intendedURL',location.pathname);
  //     this.logout();
  //     return true
  //   // }else if(err.statusText) {
  //   //   if(err.statusText== "Unknown Error"){
  //   //   this.logout();
  //   //   return true;
  //   // }
  // }
    return false;
  }

  roleCheck(role: string) {
    if (this.loggedIn()) {
      if (localStorage.getItem('face') == null) this.logout();

      if (localStorage.getItem('face') == role) {
        return true;
      }
      return false;
    }
    return false
  }


}
