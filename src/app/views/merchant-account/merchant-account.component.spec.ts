import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantAccountComponent } from './merchant-account.component';

describe('MerchantAccountComponent', () => {
  let component: MerchantAccountComponent;
  let fixture: ComponentFixture<MerchantAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MerchantAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
