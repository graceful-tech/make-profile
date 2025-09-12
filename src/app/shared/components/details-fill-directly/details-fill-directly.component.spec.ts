import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsFillDirectlyComponent } from './details-fill-directly.component';

describe('DetailsFillDirectlyComponent', () => {
  let component: DetailsFillDirectlyComponent;
  let fixture: ComponentFixture<DetailsFillDirectlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsFillDirectlyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsFillDirectlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
