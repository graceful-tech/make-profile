import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonDecisionComponent } from './common-decision.component';

describe('CommonDecisionComponent', () => {
  let component: CommonDecisionComponent;
  let fixture: ComponentFixture<CommonDecisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonDecisionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonDecisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
