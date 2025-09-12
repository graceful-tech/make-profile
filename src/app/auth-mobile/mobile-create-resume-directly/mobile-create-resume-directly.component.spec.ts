import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileCreateResumeDirectlyComponent } from './mobile-create-resume-directly.component';

describe('MobileCreateResumeDirectlyComponent', () => {
  let component: MobileCreateResumeDirectlyComponent;
  let fixture: ComponentFixture<MobileCreateResumeDirectlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileCreateResumeDirectlyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileCreateResumeDirectlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
