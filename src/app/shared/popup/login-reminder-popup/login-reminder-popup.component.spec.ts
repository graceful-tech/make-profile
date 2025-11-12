import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginReminderPopupComponent } from './login-reminder-popup.component';

describe('LoginReminderPopupComponent', () => {
  let component: LoginReminderPopupComponent;
  let fixture: ComponentFixture<LoginReminderPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginReminderPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginReminderPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
