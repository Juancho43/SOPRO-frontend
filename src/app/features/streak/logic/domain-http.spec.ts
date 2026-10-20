import { TestBed } from '@angular/core/testing';

import { DomainHTTP } from './domain-http';

describe('DomainHTTP', () => {
  let service: DomainHTTP;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DomainHTTP);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
