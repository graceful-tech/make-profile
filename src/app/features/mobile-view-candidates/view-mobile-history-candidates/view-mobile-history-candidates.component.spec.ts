import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMobileHistoryCandidatesComponent } from './view-mobile-history-candidates.component';

describe('ViewMobileHistoryCandidatesComponent', () => {
  let component: ViewMobileHistoryCandidatesComponent;
  let fixture: ComponentFixture<ViewMobileHistoryCandidatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewMobileHistoryCandidatesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewMobileHistoryCandidatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
