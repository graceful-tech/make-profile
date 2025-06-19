import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileForgotComponent } from './mobile-forgot.component';

describe('MobileForgotComponent', () => {
  let component: MobileForgotComponent;
  let fixture: ComponentFixture<MobileForgotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileForgotComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileForgotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
