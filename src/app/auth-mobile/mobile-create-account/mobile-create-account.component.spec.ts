import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileCreateAccountComponent } from './mobile-create-account.component';

describe('MobileCreateAccountComponent', () => {
  let component: MobileCreateAccountComponent;
  let fixture: ComponentFixture<MobileCreateAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileCreateAccountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileCreateAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
