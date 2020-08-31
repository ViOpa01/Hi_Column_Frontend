import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { SocketService } from './providers/socket.service';
import { ToastService } from 'ng-uikit-pro-standard';
import eventsService from 'app/providers/events.service';




@Component({
  selector: 'mdb-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']

})

export class AppComponent implements OnInit {
  values: string[] = ['Tag 1', 'Tag 2', 'Tag 4'];

  specialPage: boolean=false;

  private specialPages: any[] = [
    '/login', '/auth/verify', '/auth/reset',
  ];

  toastAlert: any

  constructor(
    private router: Router,
    private location: Location,
    private socket: SocketService,
    private toast: ToastService,
  ) { 

    eventsService.getEvent('upload-processing').subscribe(data => {
      if(!data) return
      this.toastAlert = this.toast.info('Processing', '', {
        tapToDismiss: false,
        closeButton: false,
        timeOut: 60 * 1000,
      })
    
      this.toastAlert = this.toastAlert.toastId;
      
    })
    // this.payvueservice.uploadStatus();
    // this.payvueservice.testCon();
    this.socket.on('settlement-upload-message').subscribe(data =>{
      if (!data) return
      // this.toast.clear(this.toastAlert);
      let message = `${data.filename} for ${data.processor} processed: ${data.count} items uploaded`;
      if (data.failed_insert) message += `, ${data.failed_insert} already exists.`
      this.toast.info(message, "", {
        tapToDismiss:true,
        closeButton:true,
        timeOut:60000
      });
    })

    this.socket.on('dispute-notify-message').subscribe(data =>{
      if (!data) return
      this.toast.success(`${data.message}`);
    }) 

    this.socket.on('dispute-upload-message').subscribe(data =>{
      if (!data) return
      let message = `${data.filename} for ${data.processor} processed: ${data.count} items uploaded`;
      if (data.failed_insert) message += `, ${data.failed_insert} already exists.`
      this.toast.info(message, "", {
        tapToDismiss:true,
        closeButton:true,
        timeOut:60000
      });
    })

    this.socket.on('settlement-dload-message').subscribe(data =>{
      if (!data) return
      let message = `${data.message} <a target="_blank" class="btn btn-sm btn-warning" href='${data.link}'>Click here to download</a>`
      this.toast.info(message, "", {
        enableHtml: true,
        tapToDismiss:true,
        closeButton:true,
        timeOut:60000

      })
     })

    //  this.socket.on('settlement-upload-progress-message').subscribe(data =>{
    //   if (!data) return
    //   this.toast.info(data.message, "", {
    //     enableHtml: true,
    //     tapToDismiss:true,
    //     closeButton:true,
    //     timeOut:60000

    //   })
    //  })

     this.socket.on('settlement-upload-error-message').subscribe(data =>{
      if (!data) return
      this.toast.error(data.message, "", {
        enableHtml: true,
        tapToDismiss:true,
        closeButton:true,
        timeOut:60000

      })
     })

  }

  isSpecialPage(): boolean {
    const currentUrl = `${this.router.url || '/'}`.split('?')[0];
    return this.specialPages.includes(currentUrl);
  }

  ngOnInit(): void {
    localStorage.removeItem('xfile');
  }

  goBack(): void {
    this.location.back();
  }
}
