import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReconciliationMerchantComponent } from './reconciliation-merchant.component';

describe('ReconciliationMerchantComponent', () => {
  let component: ReconciliationMerchantComponent;
  let fixture: ComponentFixture<ReconciliationMerchantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReconciliationMerchantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReconciliationMerchantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
