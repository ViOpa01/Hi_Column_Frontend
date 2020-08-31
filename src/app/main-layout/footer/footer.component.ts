import { Component, OnInit } from '@angular/core';
import {formatDate} from '@angular/common';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  date: string;
  constructor() { }

  ngOnInit() {
    this.date = formatDate(new Date(), 'yyyy', 'en');
  }

}
