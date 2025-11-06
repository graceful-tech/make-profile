import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileResumePreviewComponent } from './mobile-resume-preview.component';

describe('MobileResumePreviewComponent', () => {
  let component: MobileResumePreviewComponent;
  let fixture: ComponentFixture<MobileResumePreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileResumePreviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileResumePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
