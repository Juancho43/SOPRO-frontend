import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompoundTrophiesView } from './compound-trophies-view';

describe('CompoundTrophiesView', () => {
  let component: CompoundTrophiesView;
  let fixture: ComponentFixture<CompoundTrophiesView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompoundTrophiesView],
    }).compileComponents();

    fixture = TestBed.createComponent(CompoundTrophiesView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
