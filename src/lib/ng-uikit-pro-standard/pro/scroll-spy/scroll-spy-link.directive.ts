import {
  Directive,
  OnInit,
  Input,
  HostListener,
  HostBinding,
  ChangeDetectorRef,
  Inject
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Directive({
  selector: '[mdbScrollSpyLink]'
})
export class ScrollSpyLinkDirective implements OnInit {
  section: HTMLElement;
  private _id: string;

  constructor(
    private cdRef: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: any
  ) {}

  @Input('mdbScrollSpyLink')
  get id(): string {
    return this._id;
  }
  set id(newId: string) {
    if (newId) {
      this._id = newId;
    }
  }

  @HostBinding('class.active')
  active = false;

  @HostListener('click', [])
  onClick() {
    if (this.section) {
      this.section.scrollIntoView();
    }
  }

  detectChanges() {
    this.cdRef.detectChanges();
  }

  assignSectionToId() {
    this.section = this.document.documentElement.querySelector(`#${this.id}`);
  }

  ngOnInit() {
    this.assignSectionToId();
  }
}
