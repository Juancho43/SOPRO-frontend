import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HabitsView } from './habits-view';

describe('HabitsView', () => {
  let component: HabitsView;
  let fixture: ComponentFixture<HabitsView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HabitsView],
    }).compileComponents();

    fixture = TestBed.createComponent(HabitsView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
