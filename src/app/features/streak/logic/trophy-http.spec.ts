import { TestBed } from '@angular/core/testing';

import { TrophyHTTP } from './trophy-http';

describe('TrophyHTTP', () => {
  let service: TrophyHTTP;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrophyHTTP);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
