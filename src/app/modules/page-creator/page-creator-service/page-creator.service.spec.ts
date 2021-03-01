import { TestBed } from '@angular/core/testing';

import { PageCreatorService } from './page-creator.service';

describe('PageCreatorService', () => {
  let service: PageCreatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PageCreatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
