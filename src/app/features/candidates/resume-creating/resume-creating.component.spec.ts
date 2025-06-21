import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeCreatingComponent } from './resume-creating.component';

describe('ResumeCreatingComponent', () => {
  let component: ResumeCreatingComponent;
  let fixture: ComponentFixture<ResumeCreatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumeCreatingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumeCreatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
