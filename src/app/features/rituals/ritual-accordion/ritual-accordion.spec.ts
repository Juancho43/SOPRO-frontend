import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RitualAccordion } from './ritual-accordion';

describe('RitualAccordion', () => {
  let component: RitualAccordion;
  let fixture: ComponentFixture<RitualAccordion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RitualAccordion],
    }).compileComponents();

    fixture = TestBed.createComponent(RitualAccordion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
