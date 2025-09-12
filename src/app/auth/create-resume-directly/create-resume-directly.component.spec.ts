import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateResumeDirectlyComponent } from './create-resume-directly.component';

describe('CreateResumeDirectlyComponent', () => {
  let component: CreateResumeDirectlyComponent;
  let fixture: ComponentFixture<CreateResumeDirectlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateResumeDirectlyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateResumeDirectlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
