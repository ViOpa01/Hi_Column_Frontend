import {Component, ElementRef, ViewChild, Input, ContentChildren, AfterContentInit, QueryList } from '@angular/core';
import { state, style, trigger, transition, animate } from '@angular/animations';
import { RouterLinkWithHref } from '@angular/router';
import { window } from '../../../free/utils/facade/browser';


@Component({
  exportAs: 'sbItemBody',
  selector: 'mdb-item-body, mdb-accordion-item-body',
  templateUrl: 'sb-item.body.html',
  animations: [
    trigger('expandBody', [
      state('collapsed', style({height: '0px', visibility: 'hidden'})),
      state('expanded', style({height: '*', visibility: 'visible'})),
      transition('expanded <=> collapsed', animate('500ms ease')),
    ])
  ]
})
export class SBItemBodyComponent implements AfterContentInit {
  @Input() customClass: string;
  @ContentChildren(RouterLinkWithHref) routerLinks: QueryList<RouterLinkWithHref>;

  public height = '0';
  expandAnimationState = 'collapsed';

  @ViewChild('body') bodyEl: ElementRef;

  constructor() {}

  toggle(collapsed: boolean) {
    setTimeout(() => {
      collapsed ? this.expandAnimationState = 'collapsed' : this.expandAnimationState = 'expanded';
    }, 0);
  }

  openSidenavOnActiveLink(activeUrl: string) {
    const activeLink = this.routerLinks.find( (link: any) => {
      return link.href === activeUrl;
    });
    if (activeLink) {
      setTimeout(() => {
        this.expandAnimationState = 'expanded';
      }, 40);
    }
  }

  ngAfterContentInit() {
    this.openSidenavOnActiveLink(window.location.pathname);
  }

}
