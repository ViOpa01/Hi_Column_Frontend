import { Component, OnInit, Input } from '@angular/core';
import { PayVueApiService } from 'app/providers/payvue-api.service';
import eventsService from 'app/providers/events.service';
import { ToastService } from 'ng-uikit-pro-standard';

@Component({
  selector: 'app-terminal-stat',
  templateUrl: './terminal-stat.component.html',
  styleUrls: ['./terminal-stat.component.scss']
})
export class TerminalStatComponent implements OnInit {

  @Input('merchant') merchant: string = "";
  @Input() shadows = true;
  @Input('show') show = true;

  maxSize = 10;
  rotate = false;
  stat: any[] = [];
  worldStat: any[] = [];
  search: string = '';
  terminal: string = '';
  // terminal: string = '';
  isData: boolean;
  isData2: boolean;
  isData3: boolean;
  isSending: boolean;
  date: string;

  details: any;
  zoom: number = 6;
  lat: number = 8.776237494488235
  lng: number = 10.159012144824432
  marker: boolean = false

  levels: any[] = [];

  page = 1;
  limit = 10;
  serial = 0;
  itemCount: number;
  
  bLess: number = 0;
  bMore: number = 0;
  nLess: number = 0;
  nMore: number = 0;

  infoWindowOpened = null
  previous_info_window = null
  private sorted = false;

  note: any;

  merchantU: boolean

  public chartType = 'bar';

  public chartDatasets: Array<any> = [];

  public chart1Labels: Array<any> = [];

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
        },
        barThickness: 30,
        maxBarThickness: 30,
      }]
    }
  };

  // public map: any = { lat: 51.678418, lng: 7.809007 };

  constructor(private payvueservice: PayVueApiService, private toast: ToastService,) { }

  ngOnInit() {
    this.getTerminalStat();
    this.getTerminalCount();
    this.worldMap();
    this.figures();

    this.merchantU = false;
    
    const userStr = localStorage.getItem('user');

    const u = JSON.parse(userStr);
    if (u && u.role.toLowerCase() == 'merchant') {

      this.merchantU = true;
    }

    eventsService.getEvent('TerminalStat').subscribe(page => {
      this.page = page;
      this.getTerminalStat();
    })
  }

  sendSupport(message, terminal, modal) {
    this.isSending = true;
    const apiURL = ` /terminals/support`;
    this.payvueservice.apiCall(apiURL, 'post', {message, terminal}).then(data => {
      if (data.status == 200) {
        this.toast.success(data.data.message)
        this.isSending = false;
        this.note = '';
        modal.hide()
    }
  }).catch(error => {
    console.log(error);
    let errorBody;
    if(error._body) {
      errorBody = JSON.parse(error._body)
      if(errorBody.fields) {
        this.toast.error((errorBody.fields.message && errorBody.fields.terminal ? errorBody.fiels.message + ", " + errorBody.fields.terminal : errorBody.fields.message || errorBody.fields.terminal), errorBody.error)
        this.isSending = undefined;
      }
      else {
        this.toast.error(errorBody.error)
        this.isSending = undefined;
      }
    }
    else {
      this.toast.error(error.message)
        this.isSending = undefined; 
    }
    
  })

}

  worldMap() {
    this.isData2 = undefined;
    const apiURL = `terminals/geolocation`;
    this.payvueservice.apiCall(apiURL).then(data => {
      if(data.data){
        this.worldStat = data.data
        this.isData2 = true;
      }
    }).catch(error => {
      this.isData2 = false;
      console.log(error);
    })
  }

  figures() {
    this.isData3 = undefined;
    const apiURL = `terminals/chart`;
    this.payvueservice.apiCall(apiURL).then(data => {
      if(!this.isEmpty(data.data)){
        this.isData3 = true;
        this.chart1Labels = [`<= ${data.data.low_battery_level}% Battery`, `> ${(100 - data.data.low_battery_level)}% Battery`, `<= ${data.data.low_network_level}% Network`, `> ${(100 - data.data.low_network_level)}% Network`,'Inactive', 'Active'];

        this.chartDatasets = [{data: [data.data.battery_low, data.data.battery_high,data.data.network_low, data.data.network_high,data.data.terminal_inactive,data.data.terminal_active], label: 'POS Analysis'}];
      }
      else {
        this.isData3 = false;
      }
    }).catch(error => {
      this.isData3 = false;
      console.log(error);
    })
  }


  markerClick(map: any, marker: any, infoWindow: any) {
    this.marker = true


    this.lat = Number(marker.lat)
    this.lng = Number(marker.lon)

    if (this.previous_info_window == null)
      this.previous_info_window = infoWindow;
    else {
      this.infoWindowOpened = infoWindow
      this.previous_info_window.close()

    }
    this.previous_info_window = infoWindow

    this.reSize(map);
  }

  zoomChange(map: any) {
    this.zoom = map.zoom
    if (this.previous_info_window) this.previous_info_window.close();
  }

  reSize(map: any) {
    if (this.marker == true) {
      this.zoom = 15
    }
    this.marker = false;
  }

  setDetails(row: any) {
    this.details = row;
  }

  getTerminalCount() {
    this.itemCount = NaN;
    const apiURL = `terminals/count?search=${this.search}&merchant=${this.merchant}`;
    this.payvueservice.apiCall(apiURL).then(data => {
      this.itemCount = data.data.itemCount;
    })
  }

  getTerminalStat() {
    this.isData = undefined;
    this.stat = [];
    const apiURL = `terminals?search=${this.search}&merchant=${this.merchant}&page=${this.page}&limit=${this.limit}`;
    this.payvueservice.apiCall(apiURL).then(data => {
      if (data.data.length > 0) {
        // this.itemCount = data.itemCount;
        this.serial = 1 + (this.page - 1) * this.limit;
        this.stat = data.data
        this.isData = true;

        this.stat = this.stat.map(item => {
          item.battery_level = parseInt(item.battery_level) || 0
          item.signal = parseInt(item.signal) || 0

          if (item.battery_level > 50) {
            item.bat_color = '#78C000'
          }
          else if (item.battery_level <= 50 && item.battery_level >= 30) {
            item.bat_color = '#13ada1'
          }
          else if (item.battery_level < 30) {
            item.bat_color = '#d60f26'
          }
          else {

            item.bat_color = '#d60f26'
          }

          if (item.signal > 50) {
            item.sig_color = '#78C000';
          }
          else if (item.signal <= 50 && item.signal >= 30) {
            item.sig_color = '#13ada1';

          }
          else if (item.signal < 30) {
            item.sig_color = '#d60f26'

          }
          else {
            item.sig_color = '#d60f26'
          }

          return item;
        })
        //   this.stat.forEach(id => {

        //   dis.levels.push({ battery: id.battery_level.toString(), network_level: id.network_level.toString() })
        //   console.log( dis.levels, 'hello');
        // })
      }
      else {
        this.isData = false;
        // this.itemCount = 1;
      }
    }).catch(error => {
      console.log(error)
      this.isData = false;
      // this.itemCount = 1;
    })
  }

  pageChanged(event: any): void {
    this.page = event.page;
    this.getTerminalStat();
  }

  sortBy(by: string | any): void {

    this.stat.sort((a: any, b: any) => {
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

  setLimit(event: any) {
    this.limit = event.target.value;
  }

  setPage() {
    this.page = 1;
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
