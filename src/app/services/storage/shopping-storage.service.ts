import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { take } from 'rxjs/operators'
import { CartRequestService } from '../cart/cart-request.service';
import { CartItem, OrderSubmitResponse, AddCartItem } from './shopping-cart.model';
import { ErrMessageService } from '../err_message/err-message.service';
import { ViewCartResponse } from '../cart/cart-model';

@Injectable({
  providedIn: 'root'
})
export class ShoppingStorageService {
  static cartkey = 'etn-shopping-cart';

  products: BehaviorSubject<CartItem[]> = new BehaviorSubject<CartItem[]>([]);
  shippingForm: BehaviorSubject<any> = new BehaviorSubject<any>({});
  simulatedPayload: BehaviorSubject<any> = new BehaviorSubject<any>({});
  userSelectedCard: BehaviorSubject<any> = new BehaviorSubject<any>({});
  orderSubmitResponse: BehaviorSubject<OrderSubmitResponse> = new BehaviorSubject<OrderSubmitResponse>({
    orderSubmitResponse: {
      orderId: ''
    }
  });

  constructor(private cartService: CartRequestService,
    private errMessageService: ErrMessageService) {
    this.updateCartStorage();
  }

  updateCartStorage() {
    this.cartService.getCarts().pipe(take(1)).subscribe((resp) => {
      // create initial item
      this.products.next(resp.cartItems);
    }, error => {
      if (error.error.errors) {
        this.errMessageService.setData(error.error.errors[0].code)
      }
    });
  }

  setSelectedCard(card: any) {
    this.userSelectedCard.next(card);
  }

  setOrderSubmitResponse(resp: OrderSubmitResponse) {
    this.orderSubmitResponse.next(resp);
  }

  getOrderSubmitResponse(): Observable<OrderSubmitResponse> {
    return this.orderSubmitResponse.asObservable();
  }

  getSelectedCard(): Observable<any> {
    return this.userSelectedCard.asObservable();
  }

  setSimulationResponse(payload: any) {
    this.simulatedPayload.next(payload);
  }

  getSimulationResponse(): Observable<any> {
    return this.simulatedPayload.asObservable();
  }

  getShoppingCart(): Observable<CartItem[]> {
    return this.products.asObservable();
  }
  addToCart(item: AddCartItem, erpSystem: string): Observable<any> {
    return this.cartService.addToCart(item, erpSystem);
  }
  removeFromCart(seqNumber: number): void {
    this.cartService.removeItemInCart(seqNumber).pipe(take(1)).subscribe(response => {
      if (response.status === 'success') {
        // this.products.next(this.products.getValue().filter(val => val.sequenceNumber !== seqNumber));
        this.updateCartStorage();
      } else {
        // we need to handle error case
        console.log(response)
      }
    }, err => {
      console.log(err)
    });
  }
  removeEntireCart(): Observable<any> {
    return this.cartService.deleteCart();
  }
  increaseProductCount(seqNumber: number) {
    const cartProducts: CartItem[] = this.products.getValue();
    const targetProduct = cartProducts.find(item => item.sequenceNumber === seqNumber);
    if (targetProduct) {
      // found product
      const cartUpdateData = { cartItems: [{ lineItemId: seqNumber.toString(), quantity: targetProduct.quantity + 1 }] };
      this.cartService.updateCart(cartUpdateData)
        .pipe(take(1))
        .subscribe(resp => {
          if (resp.status === 'success') {
            cartProducts.map(item => {
              if (item.sequenceNumber === seqNumber) {
                item.quantity++;
              }
            });
            this.products.next(cartProducts);
          }
        });
    }
  }
  decreaseProductCount(seqNumber: number) {
    const cartProducts: CartItem[] = this.products.getValue();
    const targetProduct = cartProducts.find(item => item.sequenceNumber === seqNumber);
    if (targetProduct) {
      // found product
      if (targetProduct.quantity >= 2) {
        const cartUpdateData = { cartItems: [{ lineItemId: seqNumber.toString(), quantity: targetProduct.quantity - 1 }] };
        this.cartService.updateCart(cartUpdateData)
          .pipe(take(1))
          .subscribe(resp => {
            if (resp.status === 'success') {
              cartProducts.map(item => {
                if (item.sequenceNumber === seqNumber) {
                  if (item.quantity >= 2) {
                    item.quantity--;
                  }
                }
              });
              this.products.next(cartProducts);
            }
          });
      }
    }
  }
  changeProductCount(seqNumber: number, count: number) {
    const cartProducts: CartItem[] = this.products.getValue();
    const targetProduct = cartProducts.find(item => item.sequenceNumber === seqNumber);
    if (targetProduct) {
      // found the product
      const cartUpdateData = { cartItems: [{ lineItemId: seqNumber.toString(), quantity: count }] };
      this.cartService.updateCart(cartUpdateData)
        .pipe(take(1))
        .subscribe(resp => {
          if (resp.status === 'success') {
            cartProducts.map(item => {
              if (item.sequenceNumber === seqNumber) {
                item.quantity = count;
              }
            });
            this.products.next(cartProducts);
          }
        });
    }
  }
}
