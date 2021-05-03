import { TestBed } from '@angular/core/testing';

import { CreateBookingGuardGuard } from './create-booking-guard.guard';

describe('CreateBookingGuardGuard', () => {
  let guard: CreateBookingGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CreateBookingGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
