import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EMPTY, Subscription } from 'rxjs';
import { ShippingRequestService } from 'src/app/services/shipping-form/shipping-form-request.service';
import jwt_decode from 'jwt-decode';
import { CreditCard, CreditCardBillingAddress } from '../../services/credit-card/credit-card-model'
import { CreditCardService } from 'src/app/services/credit-card/credit-card.service';
import { environment } from 'src/environments/environment';
import { RecaptchaComponent } from 'ng-recaptcha';
import { ErrMessageService } from 'src/app/services/err_message/err-message.service';
declare var Flex: any;

interface FormInfo {
  formInput: object,
  formValidated: boolean
}

interface ModelData {
  addCardButton: string,
  addCardModelTitle: string,
  cancelButton: string,
  saveButton: string,
  updateButton?: string,
  styleCls?: string;
}
@Component({
  selector: 'app-add-edit-credit-card',
  templateUrl: './add-edit-credit-card.component.html',
  styleUrls: ['./add-edit-credit-card.component.css']
})
export class AddEditCreditCardComponent implements OnInit, OnChanges, OnDestroy {
  paymentInfoForm: FormGroup;
  getCountryStateDataSubscription: Subscription;
  restApiResponse: any;
  countryList: any = [];
  stateList: any = [];
  submitted: boolean;
  recaptchaKey = environment.recaptchaKey

  editMode = false;
  @Output()
  afterSubmitGatherFormInfo = new EventEmitter<FormInfo>();
  @Output()
  newCardAdded = new EventEmitter();
  @Input()
  data: ModelData;
  form: any = document.querySelector('#paymentInfoForm');
  payButton: any = document.querySelector('#pay-button');
  flexResponse: any = document.querySelector('#flexresponse');
  expMonth: any = document.querySelector('#expMonth');
  expYear: any = document.querySelector('#expYear');
  errorsOutput: any = document.querySelector('#errors-output');
  myRecaptcha = new FormControl(false);
  enableSave: boolean;
  @ViewChild('captchaRef') public captchaRef: RecaptchaComponent;
  @Input() editData: CreditCard;
  constructor(
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private shippingRequestService: ShippingRequestService,
    private creditCardService: CreditCardService,
    private errMessageService: ErrMessageService
  ) {
    this.paymentInfoForm = new FormGroup({
      firstName: new FormControl(),
      lastName: new FormControl(),
      // cardNumber: new FormControl(),
      // editCreditCardNumber: new FormControl(),
      expDate: new FormControl(),
      // cvv: new FormControl(),
      countryName: new FormControl(),
      addressLineOne: new FormControl(),
      addressLineTwo: new FormControl(),
      // myRecaptcha: new FormControl(),
      cityName: new FormControl(),
      stateName: new FormControl(),
      postalCode: new FormControl(),
      makeDefault: new FormControl()
    });
  }

  ngOnInit(): void {
    this.paymentInfoForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.maxLength(40)]],
      lastName: ['', [Validators.required, Validators.maxLength(40)]],
      // cardNumber: ['', [Validators.required, Validators.minLength(15), Validators.maxLength(16)]],
      // editCreditCardNumber: ['', [Validators.required]],
      expDate: ['', [Validators.required, Validators.maxLength(40)]],
      // cvv: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
      countryName: ['', [Validators.required]],
      addressLineOne: ['', [Validators.required, Validators.maxLength(40)]],
      addressLineTwo: [''],
      cityName: ['', [Validators.required, Validators.maxLength(40)]],
      stateName: ['', [Validators.required]],
      postalCode: ['', [Validators.required, Validators.maxLength(40)]],
      makeDefault: [''],
    });
    const dt = new Date();
    const dtt = String(dt.getFullYear() + '-' + ('0' + (dt.getMonth() + 1)).slice(-2));
    (document.getElementById('expDate') as HTMLInputElement).min = dtt;
    this.getCountryStateDataSubscription = this.shippingRequestService.getCountryStateData().subscribe((data) => {
      this.restApiResponse = data;
      // country list must be in alphabetical order
      this.countryList = data && this.restApiResponse && this.restApiResponse.validCountries ? this.restApiResponse.validCountries
        .sort((a: { countryName: string; }, b: { countryName: string; }) => a.countryName.localeCompare(b.countryName)) : [];
    });
    // this.initializeFlex()
  }
  // getter to get easy access to the form controls on the HTML form
  get formControls() {
    return this.paymentInfoForm.controls;
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.editData) {
      if (this.editData != null) {
        this.paymentInfoForm.reset();
        this.editMode = true
        this.initializeFlex()
        this.paymentInfoForm = this.createFormGroup(this.editData);
      }
    } else {
      this.editMode = false
      this.editData = null
    }
  }
  initializeFlex() {
    this.paymentInfoForm.reset();
    this.afterSubmitGatherFormInfo.emit({ formInput: this.paymentInfoForm.value, formValidated: true });
    this.onReset();
    this.captchaRef.reset();
    this.httpClient.get(environment.captureContextUrl).subscribe((resp: any) => {
      const captureContext = resp.keyId;
      const myStyles = {
        input: {
          'font-size': '16px',
          'font-family': 'helvetica, tahoma, calibri, sans-serif',
          color: '#555'
        },
        ':focus': { color: 'blue' },
        ':disabled': { cursor: 'not-allowed' },
        valid: { color: '#3c763d' },
        invalid: { color: '#a94442' }
      };
      const flex = new Flex(captureContext);
      const microform = flex.microform({ styles: myStyles });
      const cNumber = microform.createField('number', { placeholder: '' });
      const securityCode = microform.createField('securityCode', { placeholder: '•••' });
      let ccBrand: any;
      cNumber.load('#number-container');
      securityCode.load('#securityCode-container');
      cNumber.on('change', (data: any) => {
        if (data.card.length > 0) {
          ccBrand = data.card[0].brandedName
        }
      });
      document.querySelector('#getTransient').addEventListener('click', () => {
        const options = {
          expirationMonth: (document.querySelector('#expDate') as HTMLDataElement).value.split('-')[1],
          expirationYear: (document.querySelector('#expDate') as HTMLDataElement).value.split('-')[0]
        };
        microform.createToken(options, (err, token) => {
          if (err) {
            this.errMessageService.setData('COM-ERR-500')
          } else {
            let TransientToken = JSON.stringify(token);
            TransientToken = jwt_decode(TransientToken);
            this.onSubmit(TransientToken, ccBrand)
          }
        });
      });
    }, err => {
      this.errMessageService.setData('COM-ERR-500')
    })
  }
  changeCountry(selectedCountryId: any) {
    const correspondingStates = this.restApiResponse.validStates.filter(
      (state: { countryId: any; }) => Number(state.countryId) === Number(selectedCountryId)
    );
    // state list must be in alphabetical order
    this.stateList = correspondingStates ? correspondingStates
      .sort((a: { stateName: string; }, b: { stateName: string; }) => a.stateName.localeCompare(b.stateName)) : [];
  }
  createFormGroup(obj: any): FormGroup {
    let selectedcountry = this.countryList
    selectedcountry = selectedcountry.length > 0 ?
      selectedcountry.find(c => c.countryCode === obj.creditCardBillingAddress.country.trim()).countryId :
      console.log('err');
    selectedcountry ? this.changeCountry(selectedcountry) : console.warn(Error);

    let selectedstate = this.stateList
    selectedstate = selectedstate.length > 0 ?
      selectedstate.find(o => o.stateCode === obj.creditCardBillingAddress.state.trim()).stateId : EMPTY;
    let maskers: string;
    if (obj.creditCardType.toLowerCase() === 'amex') {
      maskers = 'xxxxx-xxxxx-'
    } else {
      maskers = 'xxxx-xxxx-xxxx-'
    }
    // (document.querySelector('#number') as HTMLInputElement).value = maskers + obj.creditCardNumber;
    // (document.querySelector('#number') as HTMLInputElement).disabled = true;
    return new FormGroup({
      firstName: new FormControl(obj.firstName),
      lastName: new FormControl(obj.lastName),
      addressLineOne: new FormControl(obj.creditCardBillingAddress.addressLine1),
      expDate: new FormControl(String(obj.expirationYear + '-' + ('0' + (obj.expirationMonth)).slice(-2))),
      countryName: new FormControl(selectedcountry),
      addressLineTwo: new FormControl(obj.creditCardBillingAddress.addressLine2),
      cityName: new FormControl(obj.creditCardBillingAddress.city),
      stateName: new FormControl(selectedstate),
      postalCode: new FormControl(obj.creditCardBillingAddress.postalCode),
      makeDefault: new FormControl(obj.isDefault)
    });
  }
  resolved(captchaResponse: any) {
    if (captchaResponse) {
      this.enableSave = true;
    } else {
      this.enableSave = false;
    }
  }
  onSubmit(token, ccBrand) {
    this.submitted = true;
    // stop here if form is invalid
    if (this.paymentInfoForm.invalid) {
      this.afterSubmitGatherFormInfo.emit({ formInput: {}, formValidated: false });
      return;
    } else {
      const addr: CreditCardBillingAddress = {
        addressLine1: this.paymentInfoForm.get('addressLineOne').value as string,
        addressLine2: this.paymentInfoForm.get('addressLineTwo').value as string,
        city: this.paymentInfoForm.get('cityName').value as string,
        state: this.stateList.find(s => {
          return s.stateId === this.paymentInfoForm.get('stateName').value as any
        }).stateCode as string,
        postalCode: this.paymentInfoForm.get('postalCode').value as number,
        country: document.querySelector('#countryName option[value="' + (document.querySelector('#countryName') as HTMLDataElement).value + '"]').getAttribute('data-country-code')
      }
      const paymentInfoFormSubmit: CreditCard = {
        addCreditCard: {
          firstName: this.paymentInfoForm.get('firstName').value as string,
          lastName: this.paymentInfoForm.get('lastName').value as string,
          expirationMonth: this.paymentInfoForm.get('expDate').value.split('-')[1] as number,
          expirationYear: this.paymentInfoForm.get('expDate').value.split('-')[0] as number,
          creditCardNumber: token.content.paymentInformation.card.number.maskedValue.slice(-4) as number,
          creditCardTransientToken: token.jti as string,
          creditCardType: ccBrand as string,
          creditCardBillingAddress: addr as any,
          isDefault: this.paymentInfoForm.get('makeDefault').value as boolean
        }
      };
      this.creditCardService.addCreditCards(paymentInfoFormSubmit).subscribe(res => {
        console.log(res.status)
        if (res.errors) {
          console.log(res.errors[0].code, res.errors[0].message)
        } else {
          this.onReset();
          (document.querySelector('.payment-info-modal .modal-header [data-dismiss="modal"]') as HTMLElement).click()
          this.newCardAdded.emit(true);
        }
      }, error => {
        console.error(error);
      })
    }
  }
  onReset() {
    this.afterSubmitGatherFormInfo.emit({ formInput: this.paymentInfoForm.value, formValidated: true });
    this.submitted = false;
    this.paymentInfoForm.reset();
  }

  onUpdate() {
    // empty method for now. Will implement after cybersource masked creditcard token is working
  }
  ngOnDestroy() {
    this.getCountryStateDataSubscription.unsubscribe();
  }
}