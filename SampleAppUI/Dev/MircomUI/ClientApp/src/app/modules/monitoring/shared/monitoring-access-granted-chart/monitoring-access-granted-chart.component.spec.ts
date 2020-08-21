import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringAccessGrantedChartComponent } from './monitoring-access-granted-chart.component';

describe('MonitoringAccessGrantedChartComponent', () => {
  let component: MonitoringAccessGrantedChartComponent;
  let fixture: ComponentFixture<MonitoringAccessGrantedChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitoringAccessGrantedChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoringAccessGrantedChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
