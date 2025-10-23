import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrapAndDropSectionComponent } from './drap-and-drop-section.component';

describe('DrapAndDropSectionComponent', () => {
  let component: DrapAndDropSectionComponent;
  let fixture: ComponentFixture<DrapAndDropSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrapAndDropSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrapAndDropSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
