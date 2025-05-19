import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobViewAccountComponent } from './mob-view-account.component';

describe('MobViewAccountComponent', () => {
  let component: MobViewAccountComponent;
  let fixture: ComponentFixture<MobViewAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobViewAccountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobViewAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
