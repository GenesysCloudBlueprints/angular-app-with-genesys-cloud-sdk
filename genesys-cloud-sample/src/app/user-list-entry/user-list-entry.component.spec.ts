import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserListEntryComponent } from './user-list-entry.component';

describe('UserListEntryComponent', () => {
  let component: UserListEntryComponent;
  let fixture: ComponentFixture<UserListEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserListEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserListEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
