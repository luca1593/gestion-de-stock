import { TestBed } from '@angular/core/testing';

import { MvtStkService } from './mvt-stk.service';

describe('MvtStkService', () => {
  let service: MvtStkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MvtStkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
