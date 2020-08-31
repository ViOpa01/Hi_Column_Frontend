import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantSettlementComponent } from './merchant-settlement.component';

describe('MerchantSettlementComponent', () => {
  let component: MerchantSettlementComponent;
  let fixture: ComponentFixture<MerchantSettlementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MerchantSettlementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantSettlementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
