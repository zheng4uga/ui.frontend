import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PaymentInformationComponent } from './payment-information.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RestApiService } from '../../../../services/rest_api.service';
import { RecaptchaModule } from 'angular-google-recaptcha';

describe('PaymentInformationComponent', () => {
  let component: PaymentInformationComponent;
  let fixture: ComponentFixture<PaymentInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentInformationComponent],
      imports: [ReactiveFormsModule, HttpClientModule, RecaptchaModule.forRoot({
        siteKey: '6LesmC4UAAAAAAL6ezgqpQudfmnO1i8LHl66rip',
      })],
      providers: [{ provide: RestApiService }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});