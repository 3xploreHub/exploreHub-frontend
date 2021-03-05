import { TestBed } from '@angular/core/testing';

import { PageCreatorRouteManagerGuard } from './page-creator-route-manager.guard';

describe('PageCreatorRouteManagerGuard', () => {
  let guard: PageCreatorRouteManagerGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PageCreatorRouteManagerGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
