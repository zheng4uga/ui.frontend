import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ShippingRequestService } from '../../services/shipping-form/shipping-form-request.service';

interface FormInfo {
  formInput: object,
  formValidated: boolean
}

@Component({
  selector: 'app-shipping-form',
  styleUrls: ['./shipping_form.component.css'],
  templateUrl: './shipping_form.component.html'
})

export class ShippingFormComponent implements OnInit, OnDestroy {
  restApiResponse: any = [];
  getCountryStateDataSubscription: Subscription;
  shippingForm: FormGroup;
  countryList: any = [];
  stateList: any = [];
  submitted = false;

  @Output()
  afterSubmitGatherFormInfo = new EventEmitter<FormInfo>();

  constructor(
    private formBuilder: FormBuilder,
    private shippingRequestService: ShippingRequestService
  ) { }

  ngOnInit() {
    this.shippingForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.maxLength(40)]],
      lastName: ['', [Validators.required, Validators.maxLength(40)]],
      companyName: ['', [Validators.required, Validators.maxLength(30)]],
      countryName: ['', [Validators.required]],
      addressLineOne: ['', [Validators.required, Validators.maxLength(100)]],
      addressLineTwo: ['', [Validators.maxLength(100)]],
      stateName: ['', [Validators.required]],
      cityName: ['', [Validators.required, Validators.maxLength(100)]],
      postalCode: ['', [Validators.required, Validators.maxLength(15)]]
    });

    this.getCountryStateDataSubscription = this.shippingRequestService.getCountryStateData().subscribe((data) => {
      this.restApiResponse = data;
      // country list must be in alphabetical order
      this.countryList = data && this.restApiResponse && this.restApiResponse.validCountries ? this.restApiResponse.validCountries
        .sort((a: { countryName: string; }, b: { countryName: string; }) => a.countryName.localeCompare(b.countryName)) : [];
    });
  }

  changeCountry(selectedCountryId: any) {
    const correspondingStates = this.restApiResponse.validStates.filter(
      (state: { countryId: any; }) => Number(state.countryId) === Number(selectedCountryId)
    );
    // state list must be in alphabetical order
    this.stateList = correspondingStates ? correspondingStates
      .sort((a: { stateName: string; }, b: { stateName: string; }) => a.stateName.localeCompare(b.stateName)) : [];
  }

  // getter to get easy access to the form controls on the HTML form
  get formControls() {
    return this.shippingForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    // stop here if form is invalid
    if (this.shippingForm.invalid) {
      this.afterSubmitGatherFormInfo.emit({ formInput: {}, formValidated: false });
      return;
    } else {
      this.onReset();
    }
  }

  onReset() {
    this.afterSubmitGatherFormInfo.emit({ formInput: this.shippingForm.value, formValidated: true });
    this.submitted = false;
    this.shippingForm.reset();
  }

  ngOnDestroy() {
    this.getCountryStateDataSubscription.unsubscribe();
  }
}
