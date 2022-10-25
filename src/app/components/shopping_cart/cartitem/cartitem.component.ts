import { Component, Input, OnInit } from '@angular/core';
import { CartItem } from 'src/app/services/storage/shopping-cart.model';
import { ShoppingStorageService } from 'src/app/services/storage/shopping-storage.service';
import { ProductListing } from '../model-data';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-cartitem',
  templateUrl: './cartitem.component.html',
  styleUrls: ['./cartitem.component.css']
})
export class CartitemComponent implements OnInit {

  @Input()
  cartItem: CartItem;

  @Input()
  data: ProductListing;

  constructor(private storageService: ShoppingStorageService) { }

  ngOnInit(): void {
  }

  increaseCount() {
    this.storageService.increaseProductCount(this.cartItem.sequenceNumber);
  }
  decreaseCount() {
    this.storageService.decreaseProductCount(this.cartItem.sequenceNumber);
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  quanityChange(target) {
    const quantity = target.value
    if (quantity > 0 && !isNaN(quantity) && quantity % 1 === 0) {
      target.classList.remove('ok')
      this.storageService.changeProductCount(this.cartItem.sequenceNumber, quantity);
    } else {
      target.classList.add('ok')
    }
  }

  hasProductPath(){
    if(this.cartItem.productPath){
      return true;
    }
    return false;
  }

  removeItem() {
    const cartIconCount: HTMLElement = document.getElementById('carticon__count');
    const carticon : HTMLElement = document.getElementById('carticon');
    this.storageService.removeFromCart(this.cartItem.sequenceNumber);
    if(cartIconCount){
      this.storageService.getShoppingCart().pipe(take(1))
      .subscribe((cartItems) => {
        if(cartItems ){
          const cartLength = cartItems.length;
          if(cartLength === 1){
            // we need to remove the cartIcon
            if(carticon){
              carticon.remove();
            }
          }else {
            cartIconCount.innerHTML = '('+(cartLength - 1)+')';
          }
        }
      });
    }
  }

}
