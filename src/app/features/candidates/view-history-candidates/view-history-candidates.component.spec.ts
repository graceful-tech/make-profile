import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewHistoryCandidatesComponent } from './view-history-candidates.component';

describe('ViewHistoryCandidatesComponent', () => {
  let component: ViewHistoryCandidatesComponent;
  let fixture: ComponentFixture<ViewHistoryCandidatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewHistoryCandidatesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewHistoryCandidatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
