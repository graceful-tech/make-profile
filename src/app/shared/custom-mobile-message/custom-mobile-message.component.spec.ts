import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomMobileMessageComponent } from './custom-mobile-message.component';

describe('CustomMobileMessageComponent', () => {
  let component: CustomMobileMessageComponent;
  let fixture: ComponentFixture<CustomMobileMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomMobileMessageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomMobileMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
