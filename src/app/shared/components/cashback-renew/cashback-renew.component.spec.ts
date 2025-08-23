import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashbackRenewComponent } from './cashback-renew.component';

describe('CashbackRenewComponent', () => {
  let component: CashbackRenewComponent;
  let fixture: ComponentFixture<CashbackRenewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashbackRenewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashbackRenewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
