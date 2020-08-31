import { Component, OnInit, Input } from '@angular/core';
import { PayVueApiService } from 'app/providers/payvue-api.service';
import { formatDate } from '@angular/common';
import eventsService from 'app/providers/events.service';

@Component({
  selector: 'app-terminal-performance',
  templateUrl: './terminal-performance.component.html',
  styleUrls: ['./terminal-performance.component.scss']
})
export class TerminalPerformanceComponent implements OnInit {
  @Input('merchant') merchant: string;
  @Input() shadows = true;
  @Input('show') show = true;

  maxSize = 10;
  rotate = false;
  terminals: any[] = [];
  value: number;
  volume: number;
  // terminal: string = '';
  isData: boolean;
  date: string;

  from: string = '';
  to: string = '';
  
  page = 1;
  limit = 50;
  serial = 0;
  itemCount: number;
  private sorted = false;
  constructor(private payvueservice: PayVueApiService) { }

  ngOnInit() {
    this.date = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.from = this.date;
    this.to = this.date;
    this.getTerminalSummary()

    eventsService.getEvent('TerminalSummary').subscribe(page => {
      this.page = page;
      this.getTerminalSummary();
    })
  }

  getTerminalSummary() {
    this.isData = undefined;
    this.terminals = [];
    const apiURL = `merchants/terminal-performance/${this.merchant}?page=${this.page}&limit=${this.limit}&startdate=${this.from}&enddate=${this.to}`;
    this.payvueservice.apiCall(apiURL).then(data => {
      if(data.data.length > 0) {
        this.value = data.summary.total_value;
        this.volume = data.summary.total_volume;
        this.itemCount = data.itemCount;
        this.serial = 1 + (this.page - 1) * this.limit;
        this.terminals = data.data
        this.isData = true
      }
      else {
        this.isData = false;
        this.itemCount = 1;
        
      }
    }).catch(error => {
      console.log(error)
      this.isData = false;
      this.itemCount = 1;
    })
  }

  pageChanged(event: any): void {
    this.page = event.page;
    this.getTerminalSummary();
  }

  sortBy(by: string | any): void {

    this.terminals.sort((a: any, b: any) => {
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

  setPage() {
    this.page = 1;
  }
}
