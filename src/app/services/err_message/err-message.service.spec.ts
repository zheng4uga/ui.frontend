import { TestBed } from '@angular/core/testing';

import { ErrMessageService } from './err-message.service';

describe('ErrMessageService', () => {
  let service: ErrMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
