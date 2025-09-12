import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileDetailsDillDirectlyComponent } from './mobile-details-dill-directly.component';

describe('MobileDetailsDillDirectlyComponent', () => {
  let component: MobileDetailsDillDirectlyComponent;
  let fixture: ComponentFixture<MobileDetailsDillDirectlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileDetailsDillDirectlyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileDetailsDillDirectlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
