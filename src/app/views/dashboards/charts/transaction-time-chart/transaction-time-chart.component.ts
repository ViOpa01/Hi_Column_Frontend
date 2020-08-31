import { Component, OnInit, Input } from '@angular/core';
import {formatDate} from '@angular/common';
import { PayVueApiService } from 'app/providers/payvue-api.service';;
import { SocketService } from 'app/providers/socket.service';

@Component({
  selector: 'mdb-transaction-time-chart',
  templateUrl: './transaction-time-chart.component.html',
  styleUrls: ['./transaction-time-chart.component.scss']
})
export class TransactionTimeChartComponent implements OnInit {
  @Input('totalValue') totalValue: number
  date: string;
  time: any;

  data: any[];
  isData: boolean;
  from: string = '';

  public chartType = 'line';

  public chartDatasets: Array<any> = [];

  public chart1Labels: Array<any> = ['12 AM', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM',
    '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM',
    '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM',
    '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM'];

  public chartColors: Array<any> = [
    {
      backgroundColor: 'rgba(63,114,155,0.3)',
      borderColor: 'rgba(63,114,155,1)',
      borderWidth: 2,
      pointBackgroundColor: 'rgba(63,114,155,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(63,114,155,1)'
    }
  ];


  public chartOptions: any = {
    responsive: true,
    legend: {
      labels: {
        fontColor: '#5b5f62',
      }
    },
    tooltips: {
      callbacks: {
          label: function(tooltipItem, data) {
              var label = data.datasets[tooltipItem.datasetIndex].label || '';

              if (label) {
                  label += ': ';
              }
              label += tooltipItem.yLabel.toLocaleString();
              return label;
          }
      }
  },
    scales: {
      yAxes: [{
        ticks: {
          fontColor: '#5b5f62',
          beginAtZero: true,
          callback: function (value, index, values) {
            

            if (value > 1) {

              value = value.toLocaleString();
            }
            return value;
          }
        }
      }],
      xAxes: [{
        ticks: {
          fontColor: '#5b5f62',
        }
      }]
    }
  };

  constructor(private payvueservice: PayVueApiService, private socket: SocketService) {
    this.socket.on('trans-graph-message').subscribe(data => {
      if (!data || !data.length) return
      if((!this.from || this.from == this.date)) {
        this.chartDatasets = [];
        this.time = formatDate(new Date(), 'H', 'en');
        this.time = parseInt(this.time)
        
        for(let i = 0; i < this.time; i++){
          if(data[i] == null) {
            data[i] = 0;
          }
        }
        this.chartDatasets.push({data: data.map(item => item !== null? item/100 : null), label: 'Transactions'})
        this.isData = true;
      }
     })
  }

  ngOnInit() {
    this.getTransactionTime();
    this.date = formatDate(new Date(), 'yyyy-MM-dd', 'en'); 
    this.time = formatDate(new Date(), 'H', 'en');
    this.time = parseInt(this.time)
    this.from = this.date
  }

  getTransactionTime() {
    
    this.data = [];
    this.chartDatasets = [];
    this.isData = undefined;      
    const apiURL = `transactions/time?date=${this.from}`;
      this.payvueservice.apiCall(apiURL).then(data => {
        if (data.status === 200) {
          if (data.data.length > 0) {

            for(let i = 0; i < this.time; i++){
              if(data.data[i] == null) {
                data.data[i] = 0;
              }
            }

            this.data = data.data.map(item => item !== null? item/100 : null);
            this.chartDatasets.push({ data: this.data, label: 'Transactions' });
            this.isData = true;
          } else {
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

}
