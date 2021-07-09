import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueueListPageComponent } from './queue-list-page.component';

describe('QueueListPageComponent', () => {
  let component: QueueListPageComponent;
  let fixture: ComponentFixture<QueueListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QueueListPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QueueListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
