import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ShippingRequestService } from './shipping-form-request.service';

describe('ShippingRequestService', () => {
  let service: ShippingRequestService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ShippingRequestService]
    });
    service = TestBed.inject(ShippingRequestService);
    httpMock = TestBed.inject(HttpTestingController);

  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

});
