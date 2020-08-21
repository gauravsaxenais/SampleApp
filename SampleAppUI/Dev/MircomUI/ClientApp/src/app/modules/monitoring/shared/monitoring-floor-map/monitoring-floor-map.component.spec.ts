import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringFloorMapComponent } from './monitoring-floor-map.component';

describe('MonitoringFloorMapComponent', () => {
  let component: MonitoringFloorMapComponent;
  let fixture: ComponentFixture<MonitoringFloorMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitoringFloorMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoringFloorMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
