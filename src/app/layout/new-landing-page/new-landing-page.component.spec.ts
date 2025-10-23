import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLandingPageComponent } from './new-landing-page.component';

describe('NewLandingPageComponent', () => {
  let component: NewLandingPageComponent;
  let fixture: ComponentFixture<NewLandingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewLandingPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
