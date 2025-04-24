import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileCandidatesDetailsComponent } from './mobile-candidates-details.component';

describe('MobileCandidatesDetailsComponent', () => {
  let component: MobileCandidatesDetailsComponent;
  let fixture: ComponentFixture<MobileCandidatesDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileCandidatesDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileCandidatesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
