import { TestBed } from '@angular/core/testing';

import { PageGuardGuard } from './page-guard.guard';

describe('PageGuardGuard', () => {
  let guard: PageGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PageGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
