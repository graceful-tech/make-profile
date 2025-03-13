import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LandingPageMobileComponent } from './landing-page-mobile.component';

 

describe('LandingPageMobileComponent', () => {
  let component: LandingPageMobileComponent;
  let fixture: ComponentFixture<LandingPageMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingPageMobileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandingPageMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
