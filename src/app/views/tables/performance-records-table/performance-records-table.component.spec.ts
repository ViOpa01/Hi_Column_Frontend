import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformanceRecordsTableComponent } from './performance-records-table.component';

describe('PerformanceRecordsTableComponent', () => {
  let component: PerformanceRecordsTableComponent;
  let fixture: ComponentFixture<PerformanceRecordsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerformanceRecordsTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerformanceRecordsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
