import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionsAccordion } from './sessions-accordion';

describe('SessionsAccordion', () => {
  let component: SessionsAccordion;
  let fixture: ComponentFixture<SessionsAccordion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionsAccordion],
    }).compileComponents();

    fixture = TestBed.createComponent(SessionsAccordion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
