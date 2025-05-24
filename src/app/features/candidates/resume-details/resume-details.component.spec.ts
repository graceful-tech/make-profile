import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeDetailsComponent } from './resume-details.component';

describe('ResumeDetailsComponent', () => {
  let component: ResumeDetailsComponent;
  let fixture: ComponentFixture<ResumeDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumeDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
