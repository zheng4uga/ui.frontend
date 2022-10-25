/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2020 Adobe Systems Incorporated
 ~
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~ you may not use this file except in compliance with the License.
 ~ You may obtain a copy of the License at
 ~
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ Unless required by applicable law or agreed to in writing, software
 ~ distributed under the License is distributed on an "AS IS" BASIS,
 ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 ~ See the License for the specific language governing permissions and
 ~ limitations under the License.
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ShoppingStorageService } from 'src/app/services/storage/shopping-storage.service';
import { ShoppingCartComponent } from './shopping_cart.component';

describe('ShoppingCartComponent', () => {
  let component: MockHostComponent;
  let fixture: ComponentFixture<MockHostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShoppingCartComponent,MockHostComponent],
      providers:[ShoppingStorageService],
      imports:[HttpClientTestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MockHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  afterEach(() => {
    TestBed.resetTestingModule();
});

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create headline base on inject data',()=>{
    expect(fixture.nativeElement.querySelector('h2').innerText).toEqual('awesome');
  });

  @Component({
    selector: `app-mock-host-component`,
    template: `<app-checkout json='{"productListing": {"headline":"awesome"},"paymentinformation":{},"orderreview": {},"orderconfirmation":{},"ordersummary": {}}'></app-checkout>`
  })
  class MockHostComponent{}
});
