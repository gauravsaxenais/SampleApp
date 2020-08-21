import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteMapViewComponent } from './site-map-view.component';

describe('SiteMapViewComponent', () => {
  let component: SiteMapViewComponent;
  let fixture: ComponentFixture<SiteMapViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteMapViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteMapViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
