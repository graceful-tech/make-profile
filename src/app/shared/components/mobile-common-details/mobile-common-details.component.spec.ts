import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileCommonDetailsComponent } from './mobile-common-details.component';

describe('MobileCommonDetailsComponent', () => {
  let component: MobileCommonDetailsComponent;
  let fixture: ComponentFixture<MobileCommonDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileCommonDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileCommonDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
