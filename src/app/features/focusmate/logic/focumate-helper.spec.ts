import { TestBed } from '@angular/core/testing';

import { FocumateHelper } from './focumate-helper';

describe('FocumateHelper', () => {
  let service: FocumateHelper;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FocumateHelper);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
