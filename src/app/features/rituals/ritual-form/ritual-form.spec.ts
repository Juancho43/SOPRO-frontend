import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RitualForm } from './ritual-form';

describe('RitualForm', () => {
  let component: RitualForm;
  let fixture: ComponentFixture<RitualForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RitualForm],
    }).compileComponents();

    fixture = TestBed.createComponent(RitualForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
