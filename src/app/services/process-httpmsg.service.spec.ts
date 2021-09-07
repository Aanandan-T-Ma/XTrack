import { TestBed } from '@angular/core/testing';

import { ProcessHttpMsgService } from './process-httpmsg.service';

describe('ProcessHttpmsgService', () => {
  let service: ProcessHttpMsgService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcessHttpMsgService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
