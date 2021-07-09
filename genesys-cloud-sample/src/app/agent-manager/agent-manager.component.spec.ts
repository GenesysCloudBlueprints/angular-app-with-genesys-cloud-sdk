import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentManagerComponent } from './agent-manager.component';

describe('AgentManagerComponent', () => {
  let component: AgentManagerComponent;
  let fixture: ComponentFixture<AgentManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgentManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
