import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseNewTemplateComponent } from './choose-new-template.component';

describe('ChooseNewTemplateComponent', () => {
  let component: ChooseNewTemplateComponent;
  let fixture: ComponentFixture<ChooseNewTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChooseNewTemplateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChooseNewTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
