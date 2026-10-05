import { TestBed } from '@angular/core/testing';

import { RitualHelper } from './ritual-helper';

describe('RitualHelper', () => {
  let service: RitualHelper;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RitualHelper);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
