import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringLayoutComponent } from './monitoring-layout.component';

describe('MonitoringLayoutComponent', () => {
  let component: MonitoringLayoutComponent;
  let fixture: ComponentFixture<MonitoringLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitoringLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoringLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
