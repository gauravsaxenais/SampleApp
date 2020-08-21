import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringAccessPointComponent } from './monitoring-access-point.component';

describe('MonitoringAccessPointComponent', () => {
  let component: MonitoringAccessPointComponent;
  let fixture: ComponentFixture<MonitoringAccessPointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitoringAccessPointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoringAccessPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
