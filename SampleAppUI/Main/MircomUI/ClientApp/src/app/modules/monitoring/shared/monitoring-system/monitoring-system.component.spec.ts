import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringSystemComponent } from './monitoring-system.component';

describe('MonitoringSystemComponent', () => {
  let component: MonitoringSystemComponent;
  let fixture: ComponentFixture<MonitoringSystemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitoringSystemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoringSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
