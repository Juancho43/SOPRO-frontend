import { TestBed } from '@angular/core/testing';

import { HabitHTTP } from './habit-http';

describe('HabitHTTP', () => {
  let service: HabitHTTP;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HabitHTTP);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
