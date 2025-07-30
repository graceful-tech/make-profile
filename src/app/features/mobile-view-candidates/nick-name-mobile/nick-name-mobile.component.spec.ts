import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NickNameMobileComponent } from './nick-name-mobile.component';

describe('NickNameMobileComponent', () => {
  let component: NickNameMobileComponent;
  let fixture: ComponentFixture<NickNameMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NickNameMobileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NickNameMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
