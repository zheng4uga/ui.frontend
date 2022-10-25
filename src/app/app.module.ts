import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';
import { ReactiveFormsModule, FormBuilder, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ShippingFormComponent } from './components/shipping_form/shipping_form.component';
import { ShoppingCartComponent } from './components/shopping_cart/shopping_cart.component';
import { AddToProductCartComponent } from './components/addtoproduct_cart/addtoproduct_cart';
import { CartitemComponent } from './components/shopping_cart/cartitem/cartitem.component';
import { ProductListViewComponent } from './components/shopping_cart/views/product-list-view/product-list-view.component';
import { ErrMessageComponent } from './components/shopping_cart/err-message/err-message.component';
import { OrderReviewComponent } from './components/shopping_cart/views/order-review/order-review.component';
import { OrderConfirmationComponent } from './components/shopping_cart/views/order-confirmation/order-confirmation.component';
import { PaymentInformationComponent } from './components/shopping_cart/payment-information/payment-information.component';
import { SavedCreditCardsComponent } from './components/saved-credit-cards/saved-credit-cards.component';
import { AddEditCreditCardComponent } from './components/add-edit-credit-card/add-edit-credit-card.component';
import { RECAPTCHA_SETTINGS, RecaptchaModule, RecaptchaSettings } from 'ng-recaptcha';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SpinnerInterceptor } from './interceptors/spinner.interceptor';
import { environment } from 'src/environments/environment';
import { ProductInformationComponent } from './components/product-information/product-information.component';

const globalSettings: RecaptchaSettings = { siteKey: environment.recaptchaKey };

@NgModule({
  imports: [BrowserModule, ReactiveFormsModule, HttpClientModule, FormsModule, RecaptchaModule, NgxSpinnerModule, BrowserAnimationsModule],
  providers: [FormBuilder, {
    provide: HTTP_INTERCEPTORS,
    useClass: SpinnerInterceptor,
    multi: true
  }, {
      provide: RECAPTCHA_SETTINGS,
      useValue: globalSettings,
    }],
  declarations: [ShoppingCartComponent, AddToProductCartComponent, ErrMessageComponent,
    CartitemComponent, ProductListViewComponent, ShippingFormComponent,
    PaymentInformationComponent, ErrMessageComponent,
    OrderConfirmationComponent, SavedCreditCardsComponent, AddEditCreditCardComponent,
    OrderReviewComponent, ConfirmationDialogComponent, ProductInformationComponent]
})
export class AppModule {
  constructor(private injector: Injector) {
    const shoppingCartComponent = createCustomElement(ShoppingCartComponent, { injector: this.injector });
    const addToProductCart = createCustomElement(AddToProductCartComponent, { injector: this.injector });
    customElements.define('etn-shopping_cart', shoppingCartComponent);
    const shippingFormComponent = createCustomElement(ShippingFormComponent, { injector: this.injector });
    customElements.define('etn-shipping_form', shippingFormComponent);
    customElements.define('etn-add-product-to_cart', addToProductCart);
    const productInformation = createCustomElement(ProductInformationComponent, { injector: this.injector });
    customElements.define('etn-product_information', productInformation);
    const savedCreditCardsComponent = createCustomElement(SavedCreditCardsComponent, { injector: this.injector });
    customElements.define('etn-saved-credit-card', savedCreditCardsComponent);
  }
  ngDoBootstrap() {
  }
}
