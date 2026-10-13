import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FocusLayout } from './focus-layout';

describe('FocusLayout', () => {
  let component: FocusLayout;
  let fixture: ComponentFixture<FocusLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FocusLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(FocusLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
