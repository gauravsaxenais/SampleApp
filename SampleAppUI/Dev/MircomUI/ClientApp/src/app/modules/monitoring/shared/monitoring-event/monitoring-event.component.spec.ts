import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringEventComponent } from './monitoring-event.component';

describe('MonitoringEventComponent', () => {
  let component: MonitoringEventComponent;
  let fixture: ComponentFixture<MonitoringEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitoringEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoringEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
