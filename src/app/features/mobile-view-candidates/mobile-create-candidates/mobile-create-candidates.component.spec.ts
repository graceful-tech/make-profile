import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileCreateCandidatesComponent } from './mobile-create-candidates.component';

describe('MobileCreateCandidatesComponent', () => {
  let component: MobileCreateCandidatesComponent;
  let fixture: ComponentFixture<MobileCreateCandidatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileCreateCandidatesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileCreateCandidatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
