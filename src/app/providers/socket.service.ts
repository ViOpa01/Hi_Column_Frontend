import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as socketIo from 'socket.io-client';
import { environment } from 'environments/environment';

@Injectable({providedIn: 'root'})
export class SocketService {
    private socket;

    public constructor() {
        // this.socket = socketIo(`${environment.baseUrl}?authorization=${localStorage.getItem('itt')}`);
    }

    public on(event): Observable<any> {
        return new Observable(observer => {
            // this.socket.on(event, (data) => {
            //     const userStr = localStorage.getItem('user');
            //     let user;
            //     try {
            //       user = JSON.parse(userStr);
            //     } catch (error) {}
            //     if(user && user.role.toLowerCase() == 'merchant') return;
            //    return observer.next(data)
            // });
        });
    }
}
