import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FresherFormPageComponent } from './fresher-form-page.component';

describe('FresherFormPageComponent', () => {
  let component: FresherFormPageComponent;
  let fixture: ComponentFixture<FresherFormPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FresherFormPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FresherFormPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
