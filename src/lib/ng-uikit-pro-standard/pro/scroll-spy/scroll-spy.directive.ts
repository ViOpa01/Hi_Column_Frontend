import {
  Directive,
  ContentChildren,
  AfterViewInit,
  QueryList,
  Input,
  OnDestroy
} from '@angular/core';
import { ScrollSpyLinkDirective } from './scroll-spy-link.directive';
import { ScrollSpyService } from './scroll-spy.service';

@Directive({
  selector: '[mdbScrollSpy]'
})
export class ScrollSpyDirective implements AfterViewInit, OnDestroy {
  @ContentChildren(ScrollSpyLinkDirective)
  links: QueryList<ScrollSpyLinkDirective>;

  @Input('mdbScrollSpy')
  get id(): string {
    return this._id;
  }
  set id(newId: string) {
    if (newId) {
      this._id = newId;
    }
  }
  private _id: string;

  constructor(private scrollSpyService: ScrollSpyService) {}

  ngAfterViewInit() {
    this.scrollSpyService.addScrollSpy({ id: this.id, links: this.links });
  }

  ngOnDestroy() {
    this.scrollSpyService.removeScrollSpy(this.id);
  }
}
