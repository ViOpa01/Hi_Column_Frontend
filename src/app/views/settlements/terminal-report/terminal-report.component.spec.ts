import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalReportComponent } from './terminal-report.component';

describe('TerminalReportComponent', () => {
  let component: TerminalReportComponent;
  let fixture: ComponentFixture<TerminalReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerminalReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminalReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
