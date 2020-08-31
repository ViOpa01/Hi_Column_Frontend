import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantOnboardingComponent } from './merchant-onboarding.component';

describe('MerchantOnboardingComponent', () => {
  let component: MerchantOnboardingComponent;
  let fixture: ComponentFixture<MerchantOnboardingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MerchantOnboardingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantOnboardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
