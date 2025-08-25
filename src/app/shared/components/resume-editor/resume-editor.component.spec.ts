import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeEditorComponent } from './resume-editor.component';

describe('ResumeEditorComponent', () => {
  let component: ResumeEditorComponent;
  let fixture: ComponentFixture<ResumeEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumeEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumeEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
