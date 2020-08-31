import { Injectable, QueryList } from '@angular/core';
import { ScrollSpyLinkDirective } from './scroll-spy-link.directive';

export interface ScrollSpy {
  id: string;
  links: QueryList<ScrollSpyLinkDirective>;
}

@Injectable()
export class ScrollSpyService {
  private scrollSpys: ScrollSpy[] = [];

  addScrollSpy(scrollSpy: ScrollSpy) {
    this.scrollSpys.push(scrollSpy);
  }

  removeScrollSpy(scrollSpyId: string) {
    const scrollSpyIndex = this.scrollSpys.findIndex( (spy) => {
      return spy.id === scrollSpyId;
    });
    this.scrollSpys.splice(scrollSpyIndex, 1);
  }

  updateActiveState(scrollSpyId: string, activeLinkId: string) {
    const scrollSpy = this.scrollSpys.find(spy => {
      return spy.id === scrollSpyId;
    });

    if (!scrollSpy) {
      return;
    }

    const activeLink = scrollSpy.links.find(link => {
      return link.id === activeLinkId;
    });

    this.removeActiveLinks(scrollSpy);
    this.setActiveLink(activeLink);
  }

  removeActiveState(scrollSpyId: string, activeLinkId: string) {
    const scrollSpy = this.scrollSpys.find(spy => {
      return spy.id === scrollSpyId;
    });

    if (!scrollSpy) {
      return;
    }

    const activeLink = scrollSpy.links.find(link => {
      return link.id === activeLinkId;
    });

    if (!activeLink) {
      return;
    }

    activeLink.active = false;
    activeLink.detectChanges();
  }

  setActiveLink(activeLink: ScrollSpyLinkDirective | any) {
    activeLink.active = true;
    activeLink.detectChanges();
  }

  removeActiveLinks(scrollSpy: ScrollSpy) {
    scrollSpy.links.forEach(link => {
      link.active = false;
      link.detectChanges();
    });
  }
}
