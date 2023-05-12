import { TestBed } from '@angular/core/testing';

import { ArtcleService } from './artcle.service';

describe('ArtcleService', () => {
  let service: ArtcleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArtcleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
