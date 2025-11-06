import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileChangeTemplateComponent } from './mobile-change-template.component';

describe('MobileChangeTemplateComponent', () => {
  let component: MobileChangeTemplateComponent;
  let fixture: ComponentFixture<MobileChangeTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileChangeTemplateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileChangeTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
