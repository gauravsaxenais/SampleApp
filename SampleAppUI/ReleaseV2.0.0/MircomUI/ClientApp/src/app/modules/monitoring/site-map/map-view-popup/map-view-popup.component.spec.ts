import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapViewPopupComponent } from './map-view-popup.component';

describe('MapViewPopupComponent', () => {
  let component: MapViewPopupComponent;
  let fixture: ComponentFixture<MapViewPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapViewPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapViewPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
