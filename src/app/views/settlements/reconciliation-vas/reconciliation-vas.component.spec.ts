import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReconciliationVasComponent } from './reconciliation-vas.component';

describe('ReconciliationVasComponent', () => {
  let component: ReconciliationVasComponent;
  let fixture: ComponentFixture<ReconciliationVasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReconciliationVasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReconciliationVasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
