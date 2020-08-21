import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringHeaderComponent } from './monitoring-header.component';

describe('MonitoringHeaderComponent', () => {
  let component: MonitoringHeaderComponent;
  let fixture: ComponentFixture<MonitoringHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitoringHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoringHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
