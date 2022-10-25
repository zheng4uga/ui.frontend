import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CartUpdatePayload, OrderSubmitPayload, SimulatedPayload, StatusResponse, ViewCartResponse } from './cart-model';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { AddCartItem } from '../storage/shopping-cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartRequestService {

  constructor(private httpClient: HttpClient) { }

  getCarts():Observable<ViewCartResponse>{
    return this.httpClient.get<ViewCartResponse>(environment.getCartUrl);
  }
  removeItemInCart(seqNumber: number):Observable<StatusResponse>{
    const apiUrl = environment.removeItemCartUrl + '&items='+seqNumber;
    return this.httpClient.delete<StatusResponse>(apiUrl);
  }
  deleteCart(): Observable<StatusResponse> {
    return this.httpClient.delete<StatusResponse>(environment.deleteCartUrl);
  }
  updateCart(bodyPayload: CartUpdatePayload): Observable<StatusResponse> {
    return this.httpClient.put<StatusResponse>(environment.updateCartUrl,bodyPayload);
  }
  addToCart(payload: AddCartItem,erpSystem: string): Observable<any> {
    // TODO: need to add the erpSystem into query params as this header value is blcoked
    const apiEndpoint = environment.addToCartUrl + '&erpSystem='+erpSystem;
    const headerVals = new HttpHeaders().set('x-data-location-id',erpSystem);
    return this.httpClient.post<StatusResponse>(apiEndpoint,payload,{headers:headerVals});
  }
  finalize(payload: SimulatedPayload):Observable<any>{
    return this.httpClient.post<any>(environment.simulationCart,payload);
  }
  orderSubmit(payload: OrderSubmitPayload): Observable<any>{
    return this.httpClient.post<any>(environment.orderSubmitUrl,payload);
  }
}
