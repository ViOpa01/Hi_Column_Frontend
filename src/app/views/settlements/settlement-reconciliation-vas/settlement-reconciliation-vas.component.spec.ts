import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettlementReconciliationVasComponent } from './settlement-reconciliation-vas.component';

describe('SettlementReconciliationVasComponent', () => {
  let component: SettlementReconciliationVasComponent;
  let fixture: ComponentFixture<SettlementReconciliationVasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettlementReconciliationVasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettlementReconciliationVasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
