import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresencePickerComponent } from './presence-picker.component';

describe('PresencePickerComponent', () => {
  let component: PresencePickerComponent;
  let fixture: ComponentFixture<PresencePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PresencePickerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PresencePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
