import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileLoaderComponent } from './mobile-loader.component';

describe('MobileLoaderComponent', () => {
  let component: MobileLoaderComponent;
  let fixture: ComponentFixture<MobileLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileLoaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
