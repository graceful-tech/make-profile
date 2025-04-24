import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobilePaymentOptionComponent } from './mobile-payment-option.component';

describe('MobilePaymentOptionComponent', () => {
  let component: MobilePaymentOptionComponent;
  let fixture: ComponentFixture<MobilePaymentOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobilePaymentOptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobilePaymentOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
