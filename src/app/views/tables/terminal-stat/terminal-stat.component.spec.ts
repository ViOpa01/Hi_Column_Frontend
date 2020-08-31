import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalStatComponent } from './terminal-stat.component';

describe('TerminalStatComponent', () => {
  let component: TerminalStatComponent;
  let fixture: ComponentFixture<TerminalStatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerminalStatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminalStatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
