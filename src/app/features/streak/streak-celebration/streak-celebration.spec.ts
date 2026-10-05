import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StreakCelebration } from './streak-celebration';

describe('StreakCelebration', () => {
  let component: StreakCelebration;
  let fixture: ComponentFixture<StreakCelebration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StreakCelebration],
    }).compileComponents();

    fixture = TestBed.createComponent(StreakCelebration);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
