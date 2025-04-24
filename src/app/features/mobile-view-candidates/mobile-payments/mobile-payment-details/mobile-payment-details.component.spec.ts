import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobilePaymentDetailsComponent } from './mobile-payment-details.component';

describe('MobilePaymentDetailsComponent', () => {
  let component: MobilePaymentDetailsComponent;
  let fixture: ComponentFixture<MobilePaymentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobilePaymentDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobilePaymentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
