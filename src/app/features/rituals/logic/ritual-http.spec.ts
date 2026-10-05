import { TestBed } from '@angular/core/testing';

import { RitualHttp } from './ritual-http';

describe('RitualHttp', () => {
  let service: RitualHttp;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RitualHttp);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
