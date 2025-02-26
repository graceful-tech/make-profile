import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeProfileDividerComponent } from './make-profile-divider.component';

describe('MakeProfileDividerComponent', () => {
  let component: MakeProfileDividerComponent;
  let fixture: ComponentFixture<MakeProfileDividerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MakeProfileDividerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MakeProfileDividerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
