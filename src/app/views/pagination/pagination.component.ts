import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import eventsService from 'app/providers/events.service';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {
  // page: number = 1;
  @Input('event') event: any
  @Input('page')  page: number = 1;
  constructor() { }

  ngOnInit() {


  }

  changePage(events?) {
    if(events && events.key != 'Enter'){
      return;
    }
    let page = this.page < 1 ? 1 : this.page

    const event = eventsService.getEvent(this.event)
    event.emit(page);

    this.page = page
  }

}
