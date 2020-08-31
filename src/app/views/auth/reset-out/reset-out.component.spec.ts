import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetOutComponent } from './reset-out.component';

describe('ResetOutComponent', () => {
  let component: ResetOutComponent;
  let fixture: ComponentFixture<ResetOutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetOutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
