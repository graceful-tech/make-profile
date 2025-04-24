import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileEditCandidatesComponent } from './mobile-edit-candidates.component';

describe('MobileEditCandidatesComponent', () => {
  let component: MobileEditCandidatesComponent;
  let fixture: ComponentFixture<MobileEditCandidatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileEditCandidatesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileEditCandidatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
