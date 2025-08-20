import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeAnimationComponent } from './resume-animation.component';

describe('ResumeAnimationComponent', () => {
  let component: ResumeAnimationComponent;
  let fixture: ComponentFixture<ResumeAnimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumeAnimationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumeAnimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
