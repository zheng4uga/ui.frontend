/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2018 Adobe Systems Incorporated
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

export const environment = {
  appRoot:
    "/content/eaton_ecommerce/us/en/home.html", // tslint:disable-line
  production: true,
  publicUrl:
    '/etc.clientlibs/eaton_ecommerce/clientlibs/clientlib-angular/resources',
  getCartUrl: '/eaton/secure/ecommerce/cart',
  addToCartUrl: '/eaton/secure/ecommerce/cart?operation=addtocart',
  updateCartUrl: '/eaton/secure/ecommerce/cart',
  removeItemCartUrl: '/eaton/secure/ecommerce/cart?operation=deletesingleitem',
  deleteCartUrl: '/eaton/secure/ecommerce/cart?operation=deleteentirecart',
  getCountryStateUrl: '/eaton/my-eaton/fields',
  oktaLoginUrl: 'https://id.eaton.com',
  creditCardUrl: '/eaton/secure/ecommerce/creditcard',
  simulationCart: '/eaton/secure/ecommerce/cart?operation=ordersimulation',
  orderSubmitUrl: '/eaton/secure/ecommerce/cart?operation=ordersubmit',
  captureContextUrl: '/eaton/secure/ecommerce/cyb/capturecontext',
  recaptchaKey: '6LesmC4UAAAAAAL6ezgqpQudfmnO1i8LHl66rip',
  creditCardLogos: {
    visa: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png?20091122143639',
    amex: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/2052px-American_Express_logo_%282018%29.svg.png',
    mc: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/999px-Mastercard-logo.svg.png'
  }
};
