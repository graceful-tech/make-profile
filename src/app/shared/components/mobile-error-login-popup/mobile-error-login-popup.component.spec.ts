import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileErrorLoginPopupComponent } from './mobile-error-login-popup.component';

describe('MobileErrorLoginPopupComponent', () => {
  let component: MobileErrorLoginPopupComponent;
  let fixture: ComponentFixture<MobileErrorLoginPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileErrorLoginPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileErrorLoginPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
