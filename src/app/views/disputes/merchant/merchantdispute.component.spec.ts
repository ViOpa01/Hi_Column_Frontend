import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantDisputeComponent } from './merchantdispute.component';

describe('MerchantDisputeComponent', () => {
  let component: MerchantDisputeComponent;
  let fixture: ComponentFixture<MerchantDisputeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MerchantDisputeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantDisputeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
