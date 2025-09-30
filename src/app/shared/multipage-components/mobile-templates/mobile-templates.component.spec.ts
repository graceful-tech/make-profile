import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileTemplatesComponent } from './mobile-templates.component';

describe('MobileTemplatesComponent', () => {
  let component: MobileTemplatesComponent;
  let fixture: ComponentFixture<MobileTemplatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileTemplatesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
