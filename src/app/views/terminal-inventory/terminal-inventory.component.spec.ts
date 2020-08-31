import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalInventoryComponent } from './terminal-inventory.component';

describe('TerminalInventoryComponent', () => {
  let component: TerminalInventoryComponent;
  let fixture: ComponentFixture<TerminalInventoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerminalInventoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminalInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
