import { TestBed } from '@angular/core/testing';

import { AuthHTTP } from './auth-http';

describe('AuthHTTP', () => {
  let service: AuthHTTP;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthHTTP);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
