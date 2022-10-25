import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ShoppingStorageService } from 'src/app/services/storage/shopping-storage.service';
import { take } from 'rxjs/operators';
import { ErrMessageService } from 'src/app/services/err_message/err-message.service';
interface ModelData {
    pid: string,
    btnAlignment: string,
    soldTo?: number,
    price?: number,
    buttonText?: string,
    buttonClass? : string,
    erpSystem: string,
    shoppingCartPage?: string,
    modal: {
        title: string,
        description: string,
        keepMyCartButtonText: string,
        createNewCartButtonText: string,
        icon: string
    },
    salesOrg: {
        org: string,
        division: string,
        channel: string
    },
    productIdQualifier?: string
}
@Component({
    selector: 'app-addproduct-cart',
    styleUrls: ['./addtoproduct_cart.css'],
    templateUrl: './addtoproduct_cart.html'
})
export class AddToProductCartComponent implements OnInit {
    constructor(private shoppingStorageService: ShoppingStorageService,
        private errMessageService: ErrMessageService) {
    }
    data: ModelData;
    hasErpError = false;
    modalCls = '';
    buttonAlignment = 'text-left';
    addCartSubscription$: Subscription;

    ngOnInit() {
        if (this.data.btnAlignment) {
            this.buttonAlignment = 'text-' + this.data.btnAlignment;
        }
    }

    addItemToCart() {
        if (this.data.pid || this.data.price || this.data.price > 0) {
            this.addCartSubscription$ = this.shoppingStorageService.addToCart(
                {
                    customerNumber: this.data.soldTo,
                    cartType: 'Standard',
                    salesOrg: this.data.salesOrg,
                    cartItems: [
                        {
                            productIdQualifier: this.data.productIdQualifier || 'MAT',
                            productId: this.data.pid,
                            unitPrice: this.data.price.toString(),
                            quantity: 1
                        }
                    ]
                }, this.data.erpSystem
            ).subscribe(resp => {
                if (resp && resp.errors && resp.errors.length > 0) {
                    if (resp.errors[0].code === 'COM-ERR-03') {
                        // open erp error modal
                        this.hasErpError = true;
                        this.modalCls = 'show';
                    } else {
                        resp.errors && resp.errors.code ? this.errMessageService.setData(resp.errors.code) : this.errMessageService.setData('COM-ERR-500')
                    }
                } else {
                    console.log('all success and now redirecting user to: ' + this.data.shoppingCartPage);
                    if (this.data.shoppingCartPage) {
                        window.location.href = this.data.shoppingCartPage;
                    }
                }
            }, err => {
                err.errors && err.errors.code ? this.errMessageService.setData(err.errors.code) : this.errMessageService.setData('COM-ERR-500')
            });
        } else {
            this.errMessageService.setData('COM-ERR-500')
        }
    }
    closePopup() {
        this.modalCls = ''
    }

    createNewCart() {
        this.shoppingStorageService.removeEntireCart().pipe(take(1)).subscribe(resp => {
            if (resp.status === 'success') {
                this.shoppingStorageService.updateCartStorage();
                this.addItemToCart();
                window.location.href = this.data.shoppingCartPage;
            }
        });

    }

    keepMyExistingCart() {
        if (this.data.shoppingCartPage) {
            window.location.href = this.data.shoppingCartPage;
        }
    }

    buttonClassText(){
        return this.data.buttonClass || 'b-button b-button__primary b-button__primary--primary-branding-color-reversed';
    }

    @Input()
    set json(input: string) {
        if (input) {
            this.data = JSON.parse(input);
        }
    }
}
