import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateResumeCommonDetailsComponent } from './create-resume-common-details.component';

describe('CreateResumeCommonDetailsComponent', () => {
  let component: CreateResumeCommonDetailsComponent;
  let fixture: ComponentFixture<CreateResumeCommonDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateResumeCommonDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateResumeCommonDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
