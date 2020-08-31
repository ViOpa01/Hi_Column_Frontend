import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalPerformanceComponent } from './terminal-performance.component';

describe('TerminalPerformanceComponent', () => {
  let component: TerminalPerformanceComponent;
  let fixture: ComponentFixture<TerminalPerformanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerminalPerformanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminalPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
