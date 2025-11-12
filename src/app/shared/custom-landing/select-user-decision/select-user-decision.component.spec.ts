import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectUserDecisionComponent } from './select-user-decision.component';

describe('SelectUserDecisionComponent', () => {
  let component: SelectUserDecisionComponent;
  let fixture: ComponentFixture<SelectUserDecisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectUserDecisionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectUserDecisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
