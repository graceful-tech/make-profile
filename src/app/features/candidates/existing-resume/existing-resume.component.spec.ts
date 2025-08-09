import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistingResumeComponent } from './existing-resume.component';

describe('ExistingResumeComponent', () => {
  let component: ExistingResumeComponent;
  let fixture: ComponentFixture<ExistingResumeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExistingResumeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExistingResumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
