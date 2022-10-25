import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FIELD_LISTS } from 'src/constants/url.constants';

@Injectable({
  providedIn: 'root'
})

export class RestApiService {
  private fieldListRestApi = FIELD_LISTS;
  constructor(private httpClient: HttpClient) {}

  public getCountryStateData() {
    return this.httpClient.get(`${this.fieldListRestApi}`);
  }
}