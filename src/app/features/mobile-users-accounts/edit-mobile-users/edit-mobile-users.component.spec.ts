import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMobileUsersComponent } from './edit-mobile-users.component';

describe('EditMobileUsersComponent', () => {
  let component: EditMobileUsersComponent;
  let fixture: ComponentFixture<EditMobileUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditMobileUsersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditMobileUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
