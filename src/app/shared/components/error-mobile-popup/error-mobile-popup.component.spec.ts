import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorMobilePopupComponent } from './error-mobile-popup.component';

describe('ErrorMobilePopupComponent', () => {
  let component: ErrorMobilePopupComponent;
  let fixture: ComponentFixture<ErrorMobilePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorMobilePopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErrorMobilePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
