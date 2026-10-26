import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompoundTrophyForm } from './compound-trophy-form';

describe('CompoundTrophyForm', () => {
  let component: CompoundTrophyForm;
  let fixture: ComponentFixture<CompoundTrophyForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompoundTrophyForm],
    }).compileComponents();

    fixture = TestBed.createComponent(CompoundTrophyForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
