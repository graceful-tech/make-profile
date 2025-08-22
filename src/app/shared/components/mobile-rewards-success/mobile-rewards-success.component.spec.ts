import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileRewardsSuccessComponent } from './mobile-rewards-success.component';

describe('MobileRewardsSuccessComponent', () => {
  let component: MobileRewardsSuccessComponent;
  let fixture: ComponentFixture<MobileRewardsSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileRewardsSuccessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileRewardsSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
