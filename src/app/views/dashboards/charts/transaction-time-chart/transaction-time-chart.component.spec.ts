import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionTimeChartComponent } from './transaction-time-chart.component';

describe('TransactionTimeChartComponent', () => {
  let component: TransactionTimeChartComponent;
  let fixture: ComponentFixture<TransactionTimeChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionTimeChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionTimeChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
