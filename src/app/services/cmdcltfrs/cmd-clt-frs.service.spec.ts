import { TestBed } from '@angular/core/testing';

import { CmdCltFrsService } from './cmd-clt-frs.service';

describe('CmdCltFrsService', () => {
  let service: CmdCltFrsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CmdCltFrsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
