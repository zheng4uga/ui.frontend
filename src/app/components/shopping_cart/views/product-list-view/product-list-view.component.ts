import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { CartItem } from 'src/app/services/storage/shopping-cart.model';
import { ShoppingStorageService } from 'src/app/services/storage/shopping-storage.service';
import { OrderSummary, ProcceedItem, ProductListing } from '../../model-data';

@Component({
  selector: 'app-product-list-view',
  templateUrl: './product-list-view.component.html',
  styleUrls: ['./product-list-view.component.css']
})
export class ProductListViewComponent implements OnInit {

  cartItems: CartItem[];

  @Input()
  data: ProductListing;

  @Output()
  proceed: EventEmitter<ProcceedItem> = new EventEmitter();

  @Input()
  ordersummary: OrderSummary;

  _cartSubscription$: Subscription;
  subtotal = 0;

  constructor(private shoppingStorageService: ShoppingStorageService) { }

  ngOnInit(): void {
    this._cartSubscription$ = this.shoppingStorageService.getShoppingCart().subscribe(cartItems => {
      this.cartItems = cartItems;
      let calculatedSubTotal = 0;
      this.cartItems.forEach(cartItem => {
        calculatedSubTotal += (cartItem.unitPrice * cartItem.quantity);
      });
      this.subtotal = calculatedSubTotal;
    });
  }

  goNext() {
    // if no error is thrown we will emit back next step
    if(this.cartItems.length > 0){
      this.proceed.emit({ nextStep: 2, procceed: true });
    }
  }
}
