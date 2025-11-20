import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileConfirmationPopupComponent } from './mobile-confirmation-popup.component';

describe('MobileConfirmationPopupComponent', () => {
  let component: MobileConfirmationPopupComponent;
  let fixture: ComponentFixture<MobileConfirmationPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileConfirmationPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileConfirmationPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
