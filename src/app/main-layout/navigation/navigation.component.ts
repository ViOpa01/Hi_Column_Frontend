import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../../providers/auth.service';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  @ViewChild('sidenav') sidenav: ElementRef;
  merchant: boolean;
  user: boolean;
  admin: boolean;
  super: boolean;
  url: any;

  clicked: boolean;

  constructor(private authService: AuthService, private route: ActivatedRoute) {
    this.clicked = this.clicked === undefined ? false : true;
    this.url = this.route.url;

    this.merchant = false;
    this.user = false;
    this.admin = false;
    this.super = false;
    const userStr = localStorage.getItem('user');

    const u = JSON.parse(userStr);
    if (u && u.role.toLowerCase() == 'merchant') {

      this.merchant = true;
    }
    if(u && u.role.toLowerCase() == '') {
      
      this.user = true;
    }
    if(u && u.role.toLowerCase() == 'admin') {
      
      this.admin = true;
    }
    if(u && u.role.toLowerCase() == 'super') {
      
      this.super = true;
    }
  }

  ngOnInit() {
  }

  setClicked(val: boolean): void {
    this.clicked = val;
  }

  signOut() {
    this.authService.logout();
  }

  goToElement(elemId) {
    const element = document.querySelector('#' + elemId);
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

}
