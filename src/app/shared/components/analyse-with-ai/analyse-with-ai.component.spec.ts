import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyseWithAiComponent } from './analyse-with-ai.component';

describe('AnalyseWithAiComponent', () => {
  let component: AnalyseWithAiComponent;
  let fixture: ComponentFixture<AnalyseWithAiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalyseWithAiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalyseWithAiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
