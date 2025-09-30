import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiPageFormsComponent } from './multi-page-forms.component';

describe('MultiPageFormsComponent', () => {
  let component: MultiPageFormsComponent;
  let fixture: ComponentFixture<MultiPageFormsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiPageFormsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiPageFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
