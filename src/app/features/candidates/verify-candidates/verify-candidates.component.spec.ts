import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyCandidatesComponent } from './verify-candidates.component';

describe('VerifyCandidatesComponent', () => {
  let component: VerifyCandidatesComponent;
  let fixture: ComponentFixture<VerifyCandidatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifyCandidatesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyCandidatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
