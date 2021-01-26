import { TestBed } from '@angular/core/testing';

import { AddAccountInfoGuard } from './add-account-info.guard';

describe('AddAccountInfoGuard', () => {
  let guard: AddAccountInfoGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AddAccountInfoGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
