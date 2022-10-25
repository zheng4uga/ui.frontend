import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CartItem, OrderSubmitResponse } from 'src/app/services/storage/shopping-cart.model';
import { ShoppingStorageService } from 'src/app/services/storage/shopping-storage.service';
import { OrderConfirmation, OrderSummary } from '../../model-data';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.css']
})

export class OrderConfirmationComponent implements OnInit, OnDestroy {
  logos = environment.creditCardLogos
  confirmed = true;
  currentDate = new Date();
  @Input()
  ordersummary: OrderSummary;
  @Input()
  data: OrderConfirmation;
  _cartSubscription$: Subscription;
  _orderSubscriptions$: Subscription;
  _simulationSubcription$: Subscription;
  cartItems: CartItem[];
  orderSubmitResponse: OrderSubmitResponse;
  subtotal = 0;
  total = 0;
  usedCard: any;
  simulationPayload: any;

  constructor(private shoppingStorageService: ShoppingStorageService) { }

  ngOnDestroy(): void {
    if (this._cartSubscription$) {
      this._cartSubscription$.unsubscribe();
    }
    if (this._orderSubscriptions$) {
      this._orderSubscriptions$.unsubscribe();
    }
    if (this._simulationSubcription$) {
      this._simulationSubcription$.unsubscribe();
    }
  }

  ngOnInit(): void {
    this._cartSubscription$ = this.shoppingStorageService.getShoppingCart().subscribe(cartItems => {
      // since we are in the final stage and we got here because we have successfully order submit so we are removing the cart count
      const carticon : HTMLElement = document.getElementById('carticon');
      if(carticon){
        carticon.remove();
      }
      this.cartItems = cartItems;
      let calculatedSubTotal = 0;
      this.cartItems.forEach(cartItem => {
        calculatedSubTotal += (cartItem.unitPrice * cartItem.quantity);
      });
      this.subtotal = calculatedSubTotal;
    });
    this.total = this.subtotal;
    this._cartSubscription$ = this.shoppingStorageService.getSelectedCard().pipe(take(1)).subscribe(card => this.usedCard = card);
    this._orderSubscriptions$ = this.shoppingStorageService.getOrderSubmitResponse().subscribe(resp => this.orderSubmitResponse = resp);
    this._simulationSubcription$ = this.shoppingStorageService.getSimulationResponse().pipe(take(1))
      .subscribe(payload => this.simulationPayload = payload);

  }
  getAllTaxes() {
    let taxes = 0;
    this.simulationPayload.orderSimResponse.orderSimCharges.forEach(item => {
      taxes += parseFloat(item.chargeValue);
    });
    return taxes;
  }

  getMaskCardNumber() {
    let cardNumber = '';
    if (this.usedCard.creditCardType) {
      const cardType = this.usedCard.creditCardType.toLowerCase();
      if (cardType === 'amex') {
        cardNumber = '**********';
      } else {
        cardNumber = '**************';
      }
      cardNumber += this.usedCard.creditCardNumber;
    }
    return cardNumber;
  }
}
