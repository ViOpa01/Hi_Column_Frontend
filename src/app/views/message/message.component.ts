import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { MessageModel } from 'app/Models/message.model';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  @Input('messageRowData') messageRowData
  messageData: MessageModel

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges (changes: SimpleChanges) {
    this.setData(changes.messageRowData.currentValue)
  }

  setData(array) {
    if(array) {
      this.messageData = array
    }
  }

}
