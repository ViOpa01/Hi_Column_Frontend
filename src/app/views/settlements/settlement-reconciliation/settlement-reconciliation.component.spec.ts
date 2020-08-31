import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettlementReconciliationComponent } from './settlement-reconciliation.component';

describe('SettlementReconciliationComponent', () => {
  let component: SettlementReconciliationComponent;
  let fixture: ComponentFixture<SettlementReconciliationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettlementReconciliationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettlementReconciliationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
