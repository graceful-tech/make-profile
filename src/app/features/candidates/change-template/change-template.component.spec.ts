import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeTemplateComponent } from './change-template.component';

describe('ChangeTemplateComponent', () => {
  let component: ChangeTemplateComponent;
  let fixture: ComponentFixture<ChangeTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeTemplateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
