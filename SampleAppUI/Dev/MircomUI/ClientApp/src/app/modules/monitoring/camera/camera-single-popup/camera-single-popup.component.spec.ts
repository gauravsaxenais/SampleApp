import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CameraSinglePopupComponent } from './camera-single-popup.component';

describe('CameraSinglePopupComponent', () => {
  let component: CameraSinglePopupComponent;
  let fixture: ComponentFixture<CameraSinglePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CameraSinglePopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CameraSinglePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
