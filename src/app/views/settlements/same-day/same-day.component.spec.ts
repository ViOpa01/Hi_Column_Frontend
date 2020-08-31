import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SameDayComponent } from './same-day.component';

describe('SameDayComponent', () => {
  let component: SameDayComponent;
  let fixture: ComponentFixture<SameDayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SameDayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SameDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
