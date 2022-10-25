import { Component, ComponentFactoryResolver, EventEmitter, Input, OnDestroy, OnInit, Output, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { CartRequestService } from 'src/app/services/cart/cart-request.service';
import { ShoppingStorageService } from 'src/app/services/storage/shopping-storage.service';
import { CreditCardService } from '../../../services/credit-card/credit-card.service';
import { OrderSummary, ProcceedItem, PaymentInformation } from '../model-data';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component'
import { ErrMessageService } from 'src/app/services/err_message/err-message.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-payment-information',
  templateUrl: './payment-information.component.html',
  styleUrls: ['./payment-information.component.css']
})
export class PaymentInformationComponent implements OnInit, OnDestroy {
  cardDataObj: any;
  hasSavedCards: boolean;
  subtotal: number;
  _cartSubscription$: Subscription;
  userCredDetailsSubscription: Subscription;
  _deleteCreditCardSubscription$: Subscription;
  logos = environment.creditCardLogos
  @Input()
  paymentInformation: PaymentInformation;

  @Input()
  ordersummary: OrderSummary;

  @Output()
  proceed: EventEmitter<ProcceedItem> = new EventEmitter();

  selectedCard: any;
  expdates = []
  constructor(
    private cardService: CreditCardService,
    private shoppingStorageService: ShoppingStorageService,
    private cartService: CartRequestService,
    private viewContainerRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private errMessageService: ErrMessageService
  ) { }

  ngOnInit() {
    this.getCreditCardInfo();
    this._cartSubscription$ = this.shoppingStorageService.getShoppingCart().subscribe(cartItems => {
      let calculatedSubTotal = 0;
      cartItems.forEach(cartItem => {
        calculatedSubTotal += (cartItem.unitPrice * cartItem.quantity);
      });
      this.subtotal = calculatedSubTotal;
    });
  }
  getCreditCardInfo() {
    this.userCredDetailsSubscription = this.cardService.getCreditCards().subscribe(
      (response) => {
        this.cardDataObj = response.creditCards;
        if (this.cardDataObj.length > 0) {
          this.hasSavedCards = true;
          this.markExpiredCards(this.cardDataObj)
          this.selectedCard = this.cardDataObj.find(obj => {
            if (obj.isDefault === true) {
              if (this.expdates[this.cardDataObj.map(e => e.isDefault).indexOf(true)] === false) {
                return obj
              }
            }
          }
          );
        } else {
          this.hasSavedCards = false;
        }
      },
      (error) => {
        this.hasSavedCards = false;
      }
    );
  }
  markExpiredCards(obj: any) {
    this.expdates = []
    obj.forEach((c: any) => {
      const date = new Date();
      const ToDate = String(date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2))
      const thisdate = String(c.expirationYear + '-' + ('0' + (c.expirationMonth)).slice(-2));
      if (thisdate < ToDate) {
        this.expdates.push(true)
      } else {
        this.expdates.push(false)
      }
    })
  }
  ngOnDestroy() {
    this.userCredDetailsSubscription.unsubscribe();
    this._cartSubscription$.unsubscribe();
  }
  refreshCCdetails(cc: boolean) {
    if (cc) {
      this.getCreditCardInfo()
    }
  }
  backToCart() {
    this.proceed.emit({ nextStep: 1, procceed: true });
  }
  goNext() {
    const payload = {
      orderSimRequest: {
        paymentToken: this.selectedCard.paymentToken
      }
    };
    this.cartService.finalize(payload).subscribe(resp => {
      if (resp) {
        if (resp.orderSimResponse.errors && resp.orderSimResponse.errors.length > 0) {
          this.errMessageService.setData('COM-ERR-500')
        } else {
          // need to update our cart after order simulation is completed
          this.shoppingStorageService.updateCartStorage();
          this.shoppingStorageService.setSimulationResponse(resp);
          this.shoppingStorageService.setSelectedCard(this.selectedCard);
          this.proceed.emit({ nextStep: 3, procceed: true });
        }
      } else {
        this.errMessageService.setData('COM-ERR-500')
      }
    })
    // need to decide if user is good to go to next screen
  }

  deleteCardPopup(paymentToken: any) {
    const factory = this.componentFactoryResolver.resolveComponentFactory(ConfirmationDialogComponent)
    const componentRef = this.viewContainerRef.createComponent(factory);
    componentRef.instance.ok.subscribe(() => {
      if (paymentToken) {
        this.cardService.deleteCreditCard(paymentToken).subscribe(
          (res) => {
            console.log('getting updated cards', res)
            this.getCreditCardInfo()
          },
          err => {
            console.log(err)
            err.errors[0].code ? this.errMessageService.setData(err.errors[0].code) : console.log(err)
          }
        )
      }
      componentRef.destroy();
    });
    componentRef.instance.cancel.subscribe(() => {
      componentRef.destroy();
    });
  }
  selectThis(x: number) {
    if (!this.expdates[x]) {
      const cardSelector = document.querySelectorAll('span.card-selector')
      cardSelector.forEach(p => p.classList.add('in'));
      cardSelector[x].classList.remove('in')
      this.selectedCard = this.cardDataObj[x]
      console.log(this.selectedCard)
    }
  }

  getCardData() {
    return {
      addCardButton: this.paymentInformation.addANewCreditCardButtonText,
      addCardModelTitle: this.paymentInformation.addNewCreditCardModal,
      cancelButton: this.paymentInformation.cancelButtonTextModal,
      saveButton: this.paymentInformation.saveButtonTextModal
    }
  }
}