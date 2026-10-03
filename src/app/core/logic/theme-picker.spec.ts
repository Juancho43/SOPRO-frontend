import { TestBed } from '@angular/core/testing';

import { ThemePicker } from './theme-picker';

describe('ThemePicker', () => {
  let service: ThemePicker;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemePicker);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
