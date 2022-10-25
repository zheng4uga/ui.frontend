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

import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ShippingRequestService } from 'src/app/services/shipping-form/shipping-form-request.service';
import { ShippingFormComponent } from './shipping_form.component';

describe('ShippingFormComponent', () => {
  let component: ShippingFormComponent;
  let fixture: ComponentFixture<ShippingFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShippingFormComponent],
      imports: [ReactiveFormsModule, HttpClientModule],
      providers: [{ provide: ShippingRequestService }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShippingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form invalid when empty', () => {
    component.shippingForm.controls.firstName.setValue('');
    component.shippingForm.controls.lastName.setValue('');
    component.shippingForm.controls.companyName.setValue('');
    component.shippingForm.controls.countryName.setValue('');
    component.shippingForm.controls.addressLineOne.setValue('');
    component.shippingForm.controls.stateName.setValue('');
    component.shippingForm.controls.cityName.setValue('');
    component.shippingForm.controls.postalCode.setValue('');
    expect(component.shippingForm.valid).toBeFalsy();
  });

  it('form should be valid', () => {
    component.shippingForm.controls.firstName.setValue('Jane');
    component.shippingForm.controls.lastName.setValue('Doe');
    component.shippingForm.controls.companyName.setValue('Test Company');
    component.shippingForm.controls.countryName.setValue('Test Country');
    component.shippingForm.controls.addressLineOne.setValue('Test Address Line One');
    component.shippingForm.controls.stateName.setValue('Test State');
    component.shippingForm.controls.cityName.setValue('Test City');
    component.shippingForm.controls.postalCode.setValue('123456789123456');
    expect(component.shippingForm.valid).toBeTruthy();
  });
});
