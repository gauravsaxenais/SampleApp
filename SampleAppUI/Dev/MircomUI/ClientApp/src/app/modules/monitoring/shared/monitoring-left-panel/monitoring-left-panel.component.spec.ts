import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringLeftPanelComponent } from './monitoring-left-panel.component';

describe('MonitoringLeftPanelComponent', () => {
  let component: MonitoringLeftPanelComponent;
  let fixture: ComponentFixture<MonitoringLeftPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitoringLeftPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoringLeftPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
