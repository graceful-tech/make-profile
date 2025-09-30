import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelLoginPopupComponent } from './model-login-popup.component';

describe('ModelLoginPopupComponent', () => {
  let component: ModelLoginPopupComponent;
  let fixture: ComponentFixture<ModelLoginPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModelLoginPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModelLoginPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
