import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorLoginPopupComponent } from './error-login-popup.component';

describe('ErrorLoginPopupComponent', () => {
  let component: ErrorLoginPopupComponent;
  let fixture: ComponentFixture<ErrorLoginPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorLoginPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErrorLoginPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
