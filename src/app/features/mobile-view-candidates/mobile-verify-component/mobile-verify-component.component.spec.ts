import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileVerifyComponentComponent } from './mobile-verify-component.component';

describe('MobileVerifyComponentComponent', () => {
  let component: MobileVerifyComponentComponent;
  let fixture: ComponentFixture<MobileVerifyComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileVerifyComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileVerifyComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
