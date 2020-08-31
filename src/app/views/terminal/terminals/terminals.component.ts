import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-terminals',
  templateUrl: './terminals.component.html',
  styleUrls: ['./terminals.component.scss']
})
export class TerminalsComponent implements OnInit  {
  constructor() { }

  ngOnInit() {
  }

  @Input() shadows = false;



}