import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';

import { CartRequestService } from './cart-request.service';

describe('CartRequestService', () => {
  let service: CartRequestService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
      providers:[CartRequestService]
    });
    service = TestBed.inject(CartRequestService);
    httpMock = TestBed.inject(HttpTestingController);

  });

  afterEach(() => {
    TestBed.resetTestingModule();
});

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should response with result on view cart',()=> {
    const mockResponse = {cartItems: [{
      image: 'image',
      title: 'title',
      developer: 'Eaton',
      manufacturingId: 'abc-123',
      unitPrice: 99,
      price: 189,
      quantity:2,
      dataLocation: 'VISTA',
      sequenceNumber:1,
      currency: 'USD',
      catalogNumber: '1'
    }]};
    service.getCarts().subscribe(payload =>{
      expect(payload).toBeDefined();
      expect(payload.cartItems.length >0).toBeTruthy();
      expect(payload.cartItems[0].title === mockResponse.cartItems[0].title).toBeTruthy();
    })
    const req = httpMock.expectOne(environment.getCartUrl);
    expect(req.request.method).toEqual('GET');
    req.flush(mockResponse)
    httpMock.verify()
  });

  it('should be able to remove item from cart',()=>{
    service.removeItemInCart(1).subscribe(payload=>{
      expect(payload).toBeDefined();
      expect(payload.status === 'success').toBeTruthy();
    });
    const mockSuccessResponse = {
      message:'request is success',
      status:'success'
    };
    const req = httpMock.expectOne(environment.removeItemCartUrl + '&items='+1);
    expect(req.request.method).toEqual('DELETE');
    httpMock.verify();
  });

  it('should be able to delete cart',()=>{
    service.deleteCart().subscribe(payload=>{
      expect(payload).toBeDefined();
      expect(payload.status === 'success').toBeTruthy();
    });
    const mockSuccessResponse = {
      message:'request is success',
      status:'success'
    };
    const req = httpMock.expectOne(environment.deleteCartUrl);
    expect(req.request.method).toEqual('DELETE');
    httpMock.verify();
  });

  it('should be able to update cart',()=>{
    const updatePayload = {
      cartItems:[
        {
          lineItemId: '1',
          quantity: 2
        }
      ]
    }
    service.updateCart(updatePayload).subscribe(payload=>{
      expect(payload).toBeDefined();
      expect(payload.status === 'success').toBeTruthy();
    });
    const mockSuccessResponse = {
      message:'request is success',
      status:'success'
    };
    const req = httpMock.expectOne(environment.updateCartUrl);
    expect(req.request.method).toEqual('PUT');
    httpMock.verify();
  });
});
