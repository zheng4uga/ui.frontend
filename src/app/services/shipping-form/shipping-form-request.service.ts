import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ViewFieldResponse } from './shipping-form-model';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShippingRequestService {

  constructor(private httpClient: HttpClient) { }

  getCountryStateData():Observable<ViewFieldResponse>{
    return this.httpClient.get<ViewFieldResponse>(environment.getCountryStateUrl);
  }

}
