import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { CartRequestService } from 'src/app/services/cart/cart-request.service';
import { CartItem } from 'src/app/services/storage/shopping-cart.model';
import { ShoppingStorageService } from 'src/app/services/storage/shopping-storage.service';
import { OrderReview, OrderSummary, ProcceedItem } from '../../model-data';
import { ErrMessageService } from 'src/app/services/err_message/err-message.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-order-review',
  templateUrl: './order-review.component.html',
  styleUrls: ['./order-review.component.css']
})
export class OrderReviewComponent implements OnInit, OnDestroy {
  usedCard: any;
  cartItems: CartItem[];
  logos = environment.creditCardLogos

  @Input()
  data: OrderReview;

  @Output()
  proceed: EventEmitter<ProcceedItem> = new EventEmitter();

  @Input()
  ordersummary: OrderSummary;

  _cartSubscription$: Subscription;
  _simulationSubcription$: Subscription;

  subtotal = 0;
  agreementChecked = false;
  estimatetotal = 0;
  tcText: any;
  simulationPayload: any;
  constructor(private shoppingStorageService: ShoppingStorageService,
    private sanitized: DomSanitizer,
    private cartService: CartRequestService,
    private errMessageService: ErrMessageService) {
  }
  ngOnDestroy(): void {
    if (this._cartSubscription$ && this._simulationSubcription$) {
      this._cartSubscription$.unsubscribe();
      this._simulationSubcription$.unsubscribe();
    }
  }
  ngOnInit(): void {
    this._cartSubscription$ = this.shoppingStorageService.getShoppingCart().subscribe(cartItems => this.cartItems = cartItems);
    const html = this.data.termsAndConditionsCheckboxText.replace('${tctext}', '<a data-target="#tcModal" data-toggle="modal" href="#tcModal">Terms & Conditions</a>');
    this.tcText = this.sanitized.bypassSecurityTrustHtml(html);
    this._simulationSubcription$ = this.shoppingStorageService.getSimulationResponse().pipe(take(1))
      .subscribe(payload => this.simulationPayload = payload);
    this.shoppingStorageService.getSelectedCard().pipe(take(1)).subscribe(card => this.usedCard = card);
  }
  goNext() {
    // if no error is thrown we will emit back next step
    this.cartService.orderSubmit({ orderSubmitRequest: { paymentToken: this.usedCard.paymentToken } })
      .pipe(take(1))
      .subscribe(resp => {
        if (resp.errors) {
          this.errMessageService.setData(resp.errors[0].code)
        } else {
          this.shoppingStorageService.setOrderSubmitResponse(resp);
          this.proceed.emit({ nextStep: 4, procceed: true });
        }
      }, err => {
        if (err.errors) {
          this.errMessageService.setData(err.errors[0].code)
        }
      });
  }
  backToPayment() {
    this.proceed.emit({ nextStep: 2, procceed: true });
  }

  getAllTaxes() {
    let taxes = 0;
    this.simulationPayload.orderSimResponse.orderSimCharges.forEach(item => {
      if(item.chargeType && item.chargeType.toLowerCase() !=='zmov') {
      taxes += parseFloat(item.chargeValue);
      }
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



