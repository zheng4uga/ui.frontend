import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CartitemComponent } from './cartitem.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ShoppingStorageService } from 'src/app/services/storage/shopping-storage.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { CartItem } from 'src/app/services/storage/shopping-cart.model';
import { take,last } from 'rxjs/operators'

describe('CartitemComponent', () => {
  let component: CartitemComponent;
  let fixture: ComponentFixture<CartitemComponent>;
  let storageService: ShoppingStorageService;
  let httpMock: HttpTestingController;
  let storages$: Observable<CartItem[]>;
  const mockSuccessResponse = {
    message:'request call success',
    status:'success'
  };
  const initialMockResponse = { cartItems: [{
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
  }] };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CartitemComponent ],
      imports:[HttpClientTestingModule],
      providers:[ShoppingStorageService]
    })
    .compileComponents();
    httpMock = TestBed.inject(HttpTestingController);
    storageService = TestBed.inject(ShoppingStorageService);
    const req = httpMock.expectOne(environment.getCartUrl);
    req.flush(initialMockResponse);
    storages$ = storageService.getShoppingCart();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartitemComponent);
    component = fixture.componentInstance;
    component.cartItem = {title:'product-x',manufacturingId:'123',unitPrice:99,quantity:1,sequenceNumber:1,currency:'USD'};
    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should increase product counts',() => {
    component.increaseCount();
    const req = httpMock.expectOne(environment.updateCartUrl);
    req.flush(mockSuccessResponse);
    storages$.pipe(last()).subscribe( payload => {
      expect(payload).toBeDefined();
      expect(payload[0].quantity > 2).toBeTruthy()
    });
    httpMock.verify();
  });

  it('should decrease product counts',() => {
    component.decreaseCount();
    const req = httpMock.expectOne(environment.updateCartUrl);
    req.flush(mockSuccessResponse);
    storages$.pipe(last()).subscribe( payload => {
      expect(payload).toBeDefined();
      expect(payload[0].quantity === 1).toBeTruthy();
    });
    httpMock.verify();
  });

  it('should be able to change product counts',() => {
    component.quanityChange(10);
    const req = httpMock.expectOne(environment.updateCartUrl);
    req.flush(mockSuccessResponse);
    storages$.pipe(last()).subscribe( payload => {
      expect(payload).toBeDefined();
      expect(payload[0].quantity === 10).toBeTruthy();
    });
    httpMock.verify();
  });

});
