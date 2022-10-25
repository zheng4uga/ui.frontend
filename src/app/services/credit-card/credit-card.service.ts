import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreditCard } from '../credit-card/credit-card-model';

@Injectable({
  providedIn: 'root'
})
export class CreditCardService {
  constructor(private httpClient: HttpClient) { }
  getCreditCards(): Observable<any> {
    return this.httpClient.get<any>(environment.creditCardUrl);
  }
  addCreditCards(payload: CreditCard): Observable<any> {
    return this.httpClient.post<any>(environment.creditCardUrl, payload);
  }
  deleteCreditCard(token: any): Observable<any> {
    return this.httpClient.delete<any>(environment.creditCardUrl + '?creditCardToken=' + token);
  }
}
