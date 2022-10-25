import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CartItem } from 'src/app/services/storage/shopping-cart.model';
import { ShoppingStorageService } from 'src/app/services/storage/shopping-storage.service';
import { ModelData, ProcceedItem, PaymentInformation } from './model-data';

declare var Flex: any;

@Component({
    selector: 'app-checkout',
    styleUrls: ['./shopping_cart.component.css'],
    templateUrl: './shopping_cart.component.html'
})
export class ShoppingCartComponent implements OnInit {

    data: ModelData;
    cartItems: CartItem[];

    showProductList = new BehaviorSubject<boolean>(true);
    showPayment = new BehaviorSubject<boolean>(false);
    showOrderReview = new BehaviorSubject<boolean>(false);
    showOrderConfirmation = new BehaviorSubject<boolean>(false);
    showShippingForm = new BehaviorSubject<boolean>(false);

    form: any = document.querySelector('#my-sample-form');
    payButton: any = document.querySelector('#pay-button');
    flexResponse: any = document.querySelector('#flexresponse');
    expMonth:any = document.querySelector('#expMonth');
    expYear:any = document.querySelector('#expYear');
    errorsOutput: any = document.querySelector('#errors-output');

    constructor(private shoppingStorageService: ShoppingStorageService, private httpClient: HttpClient) { }
    ngOnInit(): void {
    }
    errorData() {
        return { errors: this.data.errors }
    }
    paymentInformation() {
        return { paymentInformation: this.data.paymentInformation }
    }
    proceedToNextStep(item: ProcceedItem) {
        if (item.procceed) {
            // meaning we need to procceed to the next view
            // first we reset
            this.showProductList.next(false);
            this.showPayment.next(false);
            this.showOrderReview.next(false);
            this.showOrderConfirmation.next(false);

            switch (item.nextStep) {
                case 2:
                    this.showPayment.next(true);
                    break;
                case 3:
                    this.showOrderReview.next(true);
                    break;
                case 4:
                    this.showOrderConfirmation.next(true);
                    break;
                default:
                    this.showProductList.next(true);
                    break;
            }
        } else {
            // procceed is false we might need to throw some error
        }
    }

    // shipping data is passed back to the parent component.
    onSubmitShippingForm(event: { formInput: object; formValidated: boolean; }) {
        console.log('shipping form info in the parent component', event.formInput);
        console.log('shipping form validation in the parent component', event.formValidated);
    }

    orderReviewData() {
        const orderReviewData = this.data.orderReview;
        orderReviewData.unitPriceText = this.data.productListing.unitPriceText;
        orderReviewData.priceText = this.data.productListing.priceText;
        return orderReviewData;
    }

    @Input()
    set json(input: string) {
        if (input) {
            this.data = JSON.parse(input);
        }
    }

}