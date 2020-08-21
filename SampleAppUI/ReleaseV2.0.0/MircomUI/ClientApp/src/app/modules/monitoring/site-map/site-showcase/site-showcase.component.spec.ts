import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteShowcaseComponent } from './site-showcase.component';

describe('SiteShowcaseComponent', () => {
  let component: SiteShowcaseComponent;
  let fixture: ComponentFixture<SiteShowcaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteShowcaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteShowcaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
