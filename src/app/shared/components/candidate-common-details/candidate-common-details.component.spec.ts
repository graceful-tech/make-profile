import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateCommonDetailsComponent } from './candidate-common-details.component';

describe('CandidateCommonDetailsComponent', () => {
  let component: CandidateCommonDetailsComponent;
  let fixture: ComponentFixture<CandidateCommonDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidateCommonDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidateCommonDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
