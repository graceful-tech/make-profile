import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileAnalyseAiComponent } from './mobile-analyse-ai.component';

describe('MobileAnalyseAiComponent', () => {
  let component: MobileAnalyseAiComponent;
  let fixture: ComponentFixture<MobileAnalyseAiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileAnalyseAiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileAnalyseAiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
