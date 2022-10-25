import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { last } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { ShoppingStorageService } from './shopping-storage.service';

describe('ShoppingStorageService', () => {
  let service: ShoppingStorageService;
  let httpMock: HttpTestingController;
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
  const mockSuccessResponse = {
    message:'request call success',
    status:'success',
    code:'1001'
  };
  const mockErrorResponse = {
    message:'request call error',
    status:'error',
    code:'1002'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[ShoppingStorageService],
      imports:[HttpClientTestingModule]
    });
    service = TestBed.inject(ShoppingStorageService);
    httpMock = TestBed.inject(HttpTestingController);
      const req = httpMock.expectOne(environment.getCartUrl);
      req.flush(mockResponse);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
});

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return with storage',()=> {
    service.getShoppingCart().subscribe(payload =>{
        expect(payload).toBeDefined();
        expect(payload).toEqual(mockResponse.cartItems);
    });
    httpMock.verify();
  });

  it('should add item into storage',()=> {
    const cartItem = {
      image: 'image2',
      title: 'title2',
      developer: 'Eaton2',
      manufacturingId: 'abc-123',
      unitPrice: 99,
      price: 189,
      quantity:2,
      dataLocation: 'VISTA',
      sequenceNumber: 1,
      currency: 'USD',
      catalogNumber: '1'
    }

    service.addToCart(cartItem);
    service.getShoppingCart().pipe(last()).subscribe(payload => {
      expect(payload).toBeDefined();
      expect(payload.length === 0).toBeTruthy();
    });
    const req = httpMock.expectOne(environment.addToCartUrl);
    expect(req.request.method).toEqual('POST');
    req.flush(mockSuccessResponse);
  });
  it('should remove item from the storage',()=>{
    service.removeFromCart(1);
    service.getShoppingCart().pipe(last()).subscribe(payload => {
      expect(payload).toBeDefined();
      expect(payload.length === 0).toBeTruthy();
    });
    const req = httpMock.expectOne(environment.removeItemCartUrl + '&items='+1);
    expect(req.request.method).toEqual('DELETE');
    req.flush(mockSuccessResponse);
  });

  it('should increase product count',()=>{
    service.increaseProductCount(1);
    service.getShoppingCart().pipe(last()).subscribe(payload =>{
      expect(payload).toBeDefined();
      expect(payload[0].quantity === 2);
    });
    const req = httpMock.expectOne(environment.updateCartUrl);
    expect(req.request.method).toEqual('PUT');
    req.flush(mockSuccessResponse);

  });

  it('should decrease product count',()=>{
    service.decreaseProductCount(1);
    service.getShoppingCart().pipe(last()).subscribe(payload =>{
      expect(payload).toBeDefined();
      expect(payload[0].quantity === 0);
    });
    const req = httpMock.expectOne(environment.updateCartUrl);
    expect(req.request.method).toEqual('PUT');
    req.flush(mockSuccessResponse);
  });

  it('should change product count when call',()=>{
    service.changeProductCount(1,10);
    service.getShoppingCart().pipe(last()).subscribe(payload=>{
      expect(payload).toBeDefined();
      expect(payload[0].quantity === 10);
    });
    const req = httpMock.expectOne(environment.updateCartUrl);
    expect(req.request.method).toEqual('PUT');
    req.flush(mockSuccessResponse);
  });
 });
