
export interface ModelData {
    productListing?: ProductListing;
    paymentInformation?: PaymentInformation;
    orderReview?: OrderReview;
    orderConfirmation?: OrderConfirmation;
    orderSummary?: OrderSummary;
    errors: []
}

export interface ProductListing {
    headline?: string;
    removeLinkText: string;
    priceText: string;
    unitPriceText: string;
    categoryText: string;
}

export interface PaymentInformation {
    paymentInformationHeader: string;
    addANewCreditCardButtonText: string;
    defaultCreditCardText: string;
    updateCardButtonText: string;
    defaultCardButtonText: string;
    noCardOnFileTitle: string;
    noCardOnFileDescription: string;
    orderReviewButtonText: string;
    backToCartButtonText: string;
    addNewCreditCardModal: string
    saveButtonTextModal: string;
    cancelButtonTextModal: string;
    editCardDetailText: string;
    editCardDetailDescriptionText: string;
}

export interface OrderReview {
    termsAndConditionsCheckboxText: string;
    placeOrderButtonText: string;
    backToPaymentLinkText: string;
    unitPriceText?: string;
    priceText?: string;
}

export interface OrderConfirmation {
    orderHeader: string;
    orderText: string;
    orderNumber: string;
    orderDate: string;
}

export interface OrderSummary {
    orderSummaryText: string;
    subtotalText: string;
    orderDiscountText: string;
    estimatedTotalText: string;
    salesTotalText: string;
    orderTotalText: string;
    continueShoppingText: string;
    continueShoppingLink: string;
    continueToOrderReviewText: string;
    backToCartText: string;
    backToPaymentText: string;
    continueToPaymentText: string;
    placeOrderText: string;
    marketingAndCommunicationsText: string;
    modal?: any;
}

export interface ProcceedItem {
    nextStep: number;
    procceed: boolean;
    error?: string;
    retPayload?: any;
}