import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrophyForm } from './trophy-form';

describe('TrophyForm', () => {
  let component: TrophyForm;
  let fixture: ComponentFixture<TrophyForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrophyForm],
    }).compileComponents();

    fixture = TestBed.createComponent(TrophyForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
