import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileReferralComponent } from './mobile-referral.component';

describe('MobileReferralComponent', () => {
  let component: MobileReferralComponent;
  let fixture: ComponentFixture<MobileReferralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileReferralComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileReferralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
