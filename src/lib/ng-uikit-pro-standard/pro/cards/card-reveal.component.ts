import { Component, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { socialsState } from '../animations/animations.component';

@Component({
  selector: 'mdb-card-reveal',
  templateUrl: 'card-reveal.component.html',
  animations: [socialsState]
})

export class CardRevealComponent {
  @ViewChild('cardReveal') cardReveal: ElementRef;
  @ViewChild('cardFront') cardFront: ElementRef;
  public socials: any;
  public show: boolean;

  constructor(private _r: Renderer2) { }
  toggle() {
    this.show = !this.show;
    this.socials = (this.socials === 'active') ? 'inactive' : 'active';
    setTimeout(() => {
      try {
        const height = this.cardFront.nativeElement.offsetHeight;
        this._r.setStyle(this.cardReveal.nativeElement.firstElementChild, 'height', height + 'px');
      } catch (error) { }
    }, 0);
  }
}
