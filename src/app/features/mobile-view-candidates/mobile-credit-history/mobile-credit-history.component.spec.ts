import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileCreditHistoryComponent } from './mobile-credit-history.component';

describe('MobileCreditHistoryComponent', () => {
  let component: MobileCreditHistoryComponent;
  let fixture: ComponentFixture<MobileCreditHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileCreditHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileCreditHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
