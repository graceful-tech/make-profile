import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileCandidateMultipleResumeFormComponent } from './mobile-candidate-multiple-resume-form.component';

describe('MobileCandidateMultipleResumeFormComponent', () => {
  let component: MobileCandidateMultipleResumeFormComponent;
  let fixture: ComponentFixture<MobileCandidateMultipleResumeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileCandidateMultipleResumeFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileCandidateMultipleResumeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
