import { TestBed } from '@angular/core/testing';

import { SelectHostTouristSpotService } from './select-host-tourist-spot.service';

describe('SelectHostTouristSpotService', () => {
  let service: SelectHostTouristSpotService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectHostTouristSpotService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
