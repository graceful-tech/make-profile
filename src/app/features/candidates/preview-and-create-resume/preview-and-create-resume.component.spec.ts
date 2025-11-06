import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewAndCreateResumeComponent } from './preview-and-create-resume.component';

describe('PreviewAndCreateResumeComponent', () => {
  let component: PreviewAndCreateResumeComponent;
  let fixture: ComponentFixture<PreviewAndCreateResumeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviewAndCreateResumeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviewAndCreateResumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
