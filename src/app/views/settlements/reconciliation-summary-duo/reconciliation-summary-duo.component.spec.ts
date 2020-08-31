import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReconciliationSummaryDuoComponent } from './reconciliation-summary-duo.component';

describe('ReconciliationSummaryDuoComponent', () => {
  let component: ReconciliationSummaryDuoComponent;
  let fixture: ComponentFixture<ReconciliationSummaryDuoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReconciliationSummaryDuoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReconciliationSummaryDuoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
