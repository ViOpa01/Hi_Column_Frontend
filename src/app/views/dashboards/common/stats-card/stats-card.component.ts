import { Component, OnInit, Input } from '@angular/core';
import { PayVueApiService } from '../../../../providers/payvue-api.service';
import { SocketService } from 'app/providers/socket.service';

@Component({
  selector: 'app-stats-card',
  templateUrl: './stats-card.component.html',
  styleUrls: ['./stats-card.component.scss']
})
export class StatsCardComponent implements OnInit {
  @Input('totalValue') totalValue: number;
  @Input() shadows = false;
  data: any;
  isData: boolean;
  isData2: boolean;

  public chartType = 'pie';

  public chartDatasets: Array<any> = [];

  public chartLabels: Array<any> = ['Active', 'Inactive'];

  public chartColors: Array<any> = [
    {
      hoverBorderColor: ['rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.1)'], 
      hoverBorderWidth: 0, 
      backgroundColor: ["#F7464A", "#46BFBD"], 
      hoverBackgroundColor: ["#FF5A5E", "#5AD3D1"],
    }
  ];

  public chartOptions: any = {
    responsive: true
  };

  constructor(private payvueservice: PayVueApiService, private socket: SocketService) {
    this.socket.on('online-terminals-message').subscribe(data =>{
      if (!data) return;
      this.data.onlineTerminals = data;
      this.isData2 = true;
     })
  }
  ngOnInit() {
     this.getTerminalStatus();
  }

  getTerminalStatus() {
    this.isData = undefined;
    this.data = {};
    const apiURL = `terminals/stats`;
    this.payvueservice.apiCall(apiURL)
    .then(data => {
      if (data.status === 200) {
        if (!this.isEmpty(data.data)) {
          this.data = data.data;
          this.chartDatasets.push({ data: [this.data.activeTerminals, this.data.inactiveTerminals]})
          this.isData = true;
        }  else {
          this.isData = false;
        } 
      } else {
        this.isData = false;
      }
    }).catch(error => {
      console.error(error);
      this.isData = false;
    });
  }

  isEmpty(myObject) {
    for (const key in myObject) {
      if (myObject.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  }
}
