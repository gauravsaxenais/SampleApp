import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringFooterComponent } from './monitoring-footer.component';

describe('MonitoringFooterComponent', () => {
  let component: MonitoringFooterComponent;
  let fixture: ComponentFixture<MonitoringFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitoringFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoringFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
