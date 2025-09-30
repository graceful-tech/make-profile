import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileMultiPageFormsComponent } from './mobile-multi-page-forms.component';

describe('MobileMultiPageFormsComponent', () => {
  let component: MobileMultiPageFormsComponent;
  let fixture: ComponentFixture<MobileMultiPageFormsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileMultiPageFormsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileMultiPageFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
