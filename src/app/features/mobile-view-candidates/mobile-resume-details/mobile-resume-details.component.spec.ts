import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileResumeDetailsComponent } from './mobile-resume-details.component';

describe('MobileResumeDetailsComponent', () => {
  let component: MobileResumeDetailsComponent;
  let fixture: ComponentFixture<MobileResumeDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileResumeDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileResumeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
