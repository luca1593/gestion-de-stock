import { TestBed } from '@angular/core/testing';

import { LaoderService } from './laoder.service';

describe('LaoderService', () => {
  let service: LaoderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LaoderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
