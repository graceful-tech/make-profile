import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RewardsSuccessMessageComponent } from './rewards-success-message.component';

describe('RewardsSuccessMessageComponent', () => {
  let component: RewardsSuccessMessageComponent;
  let fixture: ComponentFixture<RewardsSuccessMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RewardsSuccessMessageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RewardsSuccessMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
