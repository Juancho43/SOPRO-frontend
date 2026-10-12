import { TestBed } from '@angular/core/testing';

import { FocusmateHTTP } from './focusmate-http';

describe('FocusmateHTTP', () => {
  let service: FocusmateHTTP;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FocusmateHTTP);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
