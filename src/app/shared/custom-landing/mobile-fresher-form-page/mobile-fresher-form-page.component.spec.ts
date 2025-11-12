import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileFresherFormPageComponent } from './mobile-fresher-form-page.component';

describe('MobileFresherFormPageComponent', () => {
  let component: MobileFresherFormPageComponent;
  let fixture: ComponentFixture<MobileFresherFormPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileFresherFormPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileFresherFormPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
