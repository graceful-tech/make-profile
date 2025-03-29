import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTemplatesComponent } from './view-templates.component';

describe('ViewTemplatesComponent', () => {
  let component: ViewTemplatesComponent;
  let fixture: ComponentFixture<ViewTemplatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewTemplatesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
