import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrophiesView } from './trophies-view';

describe('TrophiesView', () => {
  let component: TrophiesView;
  let fixture: ComponentFixture<TrophiesView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrophiesView],
    }).compileComponents();

    fixture = TestBed.createComponent(TrophiesView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
