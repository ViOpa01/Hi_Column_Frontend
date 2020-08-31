import { Component, ContentChild, Input, AfterContentInit, AfterViewInit } from '@angular/core';
import { SBItemBodyComponent } from './sb-item.body';
import { sbConfig } from './sb.config';

@Component({
  exportAs: 'sbItem',
  selector: 'mdb-item, mdb-accordion-item',
  templateUrl: 'sb-item.html'
})
export class SBItemComponent implements AfterViewInit, AfterContentInit {

  private squeezebox: any;

  @Input() public collapsed = true;
  @Input() customClass: string;

  @ContentChild(SBItemBodyComponent) body: SBItemBodyComponent;

  constructor() {
    this.squeezebox = sbConfig.serviceInstance;
  }

  ngAfterViewInit() {
    if (this.body !== undefined) {
      setTimeout(() => {
        this.collapsed ? this.body.expandAnimationState = 'collapsed' : this.body.expandAnimationState = 'expanded';
      }, 0);
      this.body.toggle(this.collapsed);
    }
  }

  ngAfterContentInit() {
    setTimeout(() => {
      if (this.body.expandAnimationState === 'expanded') {
        this.collapsed = false;
      }
    }, 40);
  }

  toggle(collapsed: boolean) {
    this.squeezebox.didItemToggled(this);
    this.applyToggle(collapsed);
  }

  applyToggle(collapsed: boolean) {
    if (this.body !== undefined) {
      this.collapsed = collapsed;
      this.body.toggle(collapsed);
    }
  }
}
