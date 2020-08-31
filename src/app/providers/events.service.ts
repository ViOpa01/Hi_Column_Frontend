import { EventEmitter } from '@angular/core';

class EventService {

    events: any[] = [];

    getEvent(key): EventEmitter<any> {
        if(this.events[key]) {
            return this.events[key]
        }
        this.events[key] = new EventEmitter();
        return this.events[key];
    }

}

export default new EventService()