import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCandidatesComponent } from './create-candidates.component';

describe('CreateCandidatesComponent', () => {
  let component: CreateCandidatesComponent;
  let fixture: ComponentFixture<CreateCandidatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateCandidatesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateCandidatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
