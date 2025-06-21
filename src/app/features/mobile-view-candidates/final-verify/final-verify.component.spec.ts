import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalVerifyComponent } from './final-verify.component';

describe('FinalVerifyComponent', () => {
  let component: FinalVerifyComponent;
  let fixture: ComponentFixture<FinalVerifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinalVerifyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinalVerifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
