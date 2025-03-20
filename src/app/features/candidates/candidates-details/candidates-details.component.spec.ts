import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatesDetailsComponent } from './candidates-details.component';

describe('CandidatesDetailsComponent', () => {
  let component: CandidatesDetailsComponent;
  let fixture: ComponentFixture<CandidatesDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidatesDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidatesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
