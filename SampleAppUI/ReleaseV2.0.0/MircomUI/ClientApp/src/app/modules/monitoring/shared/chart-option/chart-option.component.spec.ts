import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartOptionComponent } from './chart-option.component';

describe('ChartOptionComponent', () => {
  let component: ChartOptionComponent;
  let fixture: ComponentFixture<ChartOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartOptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
