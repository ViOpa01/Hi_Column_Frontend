import {Component, Input} from '@angular/core';
import {SBItemComponent} from './sb-item';

@Component({
  exportAs: 'sbItemHead',
  selector: 'mdb-item-head, mdb-accordion-item-head',
  templateUrl: 'sb-item.head.html'
})
export class SBItemHeadComponent {
  @Input() isDisabled = false;
  @Input() customClass: string;
  @Input() indicator = true;

  constructor(private sbItem: SBItemComponent) {}

  toggleClick(event: any) {
    event.preventDefault();
    if (!this.isDisabled) {
      this.sbItem.collapsed = !this.sbItem.collapsed;
      this.sbItem.toggle(this.sbItem.collapsed);
    }
  }
}
