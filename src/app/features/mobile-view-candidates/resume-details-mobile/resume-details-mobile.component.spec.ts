import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeDetailsMobileComponent } from './resume-details-mobile.component';

describe('ResumeDetailsMobileComponent', () => {
  let component: ResumeDetailsMobileComponent;
  let fixture: ComponentFixture<ResumeDetailsMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumeDetailsMobileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumeDetailsMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
