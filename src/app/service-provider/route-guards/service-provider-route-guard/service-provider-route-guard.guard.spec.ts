import { TestBed } from '@angular/core/testing';

import { ServiceProviderRouteGuardGuard } from './service-provider-route-guard.guard';

describe('ServiceProviderRouteGuardGuard', () => {
  let guard: ServiceProviderRouteGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ServiceProviderRouteGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
