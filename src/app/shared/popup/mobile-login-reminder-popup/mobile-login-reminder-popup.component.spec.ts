import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileLoginReminderPopupComponent } from './mobile-login-reminder-popup.component';

describe('MobileLoginReminderPopupComponent', () => {
  let component: MobileLoginReminderPopupComponent;
  let fixture: ComponentFixture<MobileLoginReminderPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileLoginReminderPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileLoginReminderPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
