import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadSettlementComponent } from './upload-settlement.component';

describe('UploadSettlementComponent', () => {
  let component: UploadSettlementComponent;
  let fixture: ComponentFixture<UploadSettlementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadSettlementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadSettlementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
