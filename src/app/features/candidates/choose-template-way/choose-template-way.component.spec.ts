import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseTemplateWayComponent } from './choose-template-way.component';

describe('ChooseTemplateWayComponent', () => {
  let component: ChooseTemplateWayComponent;
  let fixture: ComponentFixture<ChooseTemplateWayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChooseTemplateWayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChooseTemplateWayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
