import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileResumeCommonDetailsComponent } from './mobile-resume-common-details.component';

describe('MobileResumeCommonDetailsComponent', () => {
  let component: MobileResumeCommonDetailsComponent;
  let fixture: ComponentFixture<MobileResumeCommonDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileResumeCommonDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileResumeCommonDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
