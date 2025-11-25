import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateMultipleResumeFormComponent } from './candidate-multiple-resume-form.component';

describe('CandidateMultipleResumeFormComponent', () => {
  let component: CandidateMultipleResumeFormComponent;
  let fixture: ComponentFixture<CandidateMultipleResumeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidateMultipleResumeFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidateMultipleResumeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
