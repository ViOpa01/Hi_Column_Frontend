import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantTransactionsComponent } from './merchant-transactions.component';

describe('MerchantTransactionsComponent', () => {
  let component: MerchantTransactionsComponent;
  let fixture: ComponentFixture<MerchantTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MerchantTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
