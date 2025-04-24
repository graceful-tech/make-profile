import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileChosseTemplateComponent } from './mobile-chosse-template.component';

describe('MobileChosseTemplateComponent', () => {
  let component: MobileChosseTemplateComponent;
  let fixture: ComponentFixture<MobileChosseTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileChosseTemplateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileChosseTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
