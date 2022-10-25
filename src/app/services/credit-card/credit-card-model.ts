export interface CreditCardBillingAddress {
    addressLine1?: string,
    addressLine2?: string,
    city?: string,
    state?: string,
    postalCode: number,
    country?: string
}
export interface AddCreditCard {
    firstName: string,
    lastName: string,
    expirationMonth: number,
    expirationYear: number,
    creditCardNumber: number,
    creditCardTransientToken: string,
    creditCardType: string,
    isDefault: boolean,
    creditCardBillingAddress?: CreditCardBillingAddress[]
}
export interface CreditCard {
    addCreditCard: AddCreditCard
}