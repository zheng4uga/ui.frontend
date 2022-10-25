import { HttpClient } from '@angular/common/http';
import { Component, ComponentFactoryResolver, EventEmitter, Input, OnInit, Output, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CreditCardService } from '../../services/credit-card/credit-card.service'
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component'
import { ErrMessageService } from 'src/app/services/err_message/err-message.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-saved-credit-cards',
  templateUrl: './saved-credit-cards.component.html',
  styleUrls: ['./saved-credit-cards.component.css']
})
export class SavedCreditCardsComponent implements OnInit {
  credetails: Observable<any>;
  expdates = []
  showModal: boolean;
  @Output()
  proceed: EventEmitter<any> = new EventEmitter();
  editThisCreditCard: any;
  data: any;
  logos = environment.creditCardLogos
  constructor(private httpClient: HttpClient,
    private creditCardService: CreditCardService,
    private viewContainerRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private errMessageService: ErrMessageService) { }

  ngOnInit(): void {
    this.getter()
  }
  getter() {
    this.creditCardService.getCreditCards().subscribe(res => {
      this.credetails = res.creditCards;
      this.markExpiredCards(this.credetails)
    }, error => {
      console.log(error)
    });
  }
  refreshCCdetails(cc: boolean) {
    if (cc) {
      this.getter()
    }
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
    console.log(this.expdates)
  }
  makeDefault(i: any, z: any) {
    if (i.target.value !== 'default') {
      console.log(i.target.id);
      console.log(this.credetails[z])
      // call update api
      // call get card api
    }
  }
  deleteCardPopup(i: any) {
    const factory = this.componentFactoryResolver.resolveComponentFactory(ConfirmationDialogComponent)
    const componentRef = this.viewContainerRef.createComponent(factory);
    componentRef.instance.ok.subscribe(() => {
      if (this.credetails[i].paymentToken) {
        this.creditCardService.deleteCreditCard(this.credetails[i].paymentToken).subscribe(
          res => {
            this.getter()
          },
          err => {
            console.log(err);
            if (err.errors[0].code) {
              this.errMessageService.setData(err.errors[0].code)
            }
          }
        )
      }
      componentRef.destroy();
    });
    componentRef.instance.cancel.subscribe(() => {
      componentRef.destroy();
    });
  }
  editData(i: any) {
    this.editThisCreditCard = this.credetails[i];
  }
  creditCardFormData() {
    const creditCardFormData = this.data;
    creditCardFormData.defaultText = this.data.defaultText;
    creditCardFormData.crediCardDetailsText = this.data.crediCardDetailsText;
    creditCardFormData.expirationDateText = this.data.expirationDateText;
    creditCardFormData.deleteCardText = this.data.deleteCardText;
    creditCardFormData.editText = this.data.editText;
    creditCardFormData.messageText = this.data.messageText;
    creditCardFormData.addCreditCardButtonText = this.data.addCreditCardButtonText;
    creditCardFormData.paymentFormModalButtonText = this.data.paymentFormModalButtonText;
    creditCardFormData.addCreditCardTitleText = this.data.addCreditCardTitleText;
    creditCardFormData.editCreditCardTitleText = this.data.editCreditCardTitleText;
    creditCardFormData.firstNameInputLabel = this.data.firstNameInputLabel;
    creditCardFormData.lastNameInputLabel = this.data.lastNameInputLabel;
    creditCardFormData.creditCardInputLabel = this.data.creditCardInputLabel;
    creditCardFormData.expiryDateInputLabel = this.data.expiryDateInputLabel;
    creditCardFormData.securityCodeInputLabel = this.data.securityCodeInputLabel;
    creditCardFormData.countryInputLabel = this.data.countryInputLabel;
    creditCardFormData.billingAddressInputLabel = this.data.billingAddressInputLabel;
    creditCardFormData.cityInputLabel = this.data.cityInputLabel;
    creditCardFormData.stateNameInputLabel = this.data.stateNameInputLabel;
    creditCardFormData.postalCodeInputLabel = this.data.postalCodeInputLabel;
    creditCardFormData.makeDefaultCardCheckboxLabel = this.data.makeDefaultCardCheckboxLabel;
    creditCardFormData.saveButtonLabel = this.data.saveButtonLabel;
    creditCardFormData.editButtonLabel = this.data.editButtonLabel;
    creditCardFormData.cancelButtonLabel = this.data.cancelButtonLabel;
    creditCardFormData.firstNameRequiredLabel = this.data.firstNameRequiredLabel;
    creditCardFormData.lastNameRequiredLabel = this.data.lastNameRequiredLabel;
    creditCardFormData.creditCardRequiredLabel = this.data.creditCardRequiredLabel;
    creditCardFormData.expiryDateRequiredLabel = this.data.expiryDateRequiredLabel;
    creditCardFormData.securityCodeRequiredLabel = this.data.securityCodeRequiredLabel;
    creditCardFormData.countryRequiredLabel = this.data.countryRequiredLabel;
    creditCardFormData.billingAddressRequiredLabel = this.data.billingAddressRequiredLabel;
    creditCardFormData.cityRequiredLabel = this.data.cityRequiredLabel;
    creditCardFormData.cityRequiredLabel = this.data.cityRequiredLabel;
    creditCardFormData.postalCodeRequiredLabel = this.data.postalCodeRequiredLabel;
    creditCardFormData.styleCls = 'b-button__tertiary b-button__tertiary--light';
    return creditCardFormData;
  }
  @Input()
  set json(input: string) {
    if (input) {
      this.data = JSON.parse(input);
    }
  }
}
