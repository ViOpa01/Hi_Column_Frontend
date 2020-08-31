import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReconciliationSummaryVasComponent } from './reconciliation-summary-vas.component';

describe('ReconciliationSummaryVasComponent', () => {
  let component: ReconciliationSummaryVasComponent;
  let fixture: ComponentFixture<ReconciliationSummaryVasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReconciliationSummaryVasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReconciliationSummaryVasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
