import { TestBed } from '@angular/core/testing';

import { UserTypeGuardGuard } from './user-type-guard.guard';

describe('UserTypeGuardGuard', () => {
  let guard: UserTypeGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(UserTypeGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
