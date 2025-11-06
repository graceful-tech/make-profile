import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCreateResumeComponent } from './new-create-resume.component';

describe('NewCreateResumeComponent', () => {
  let component: NewCreateResumeComponent;
  let fixture: ComponentFixture<NewCreateResumeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewCreateResumeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewCreateResumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
