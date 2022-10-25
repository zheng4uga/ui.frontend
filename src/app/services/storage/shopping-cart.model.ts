
export interface CartItem {
    image?: string;
    title: string;
    developer?: string;
    manufacturingId: string;
    unitPrice: number;
    price?: number;
    quantity:number;
    dataLocation?: string;
    sequenceNumber: number;
    currency: string;
    catalogNumber?: string;
    productPath?: string;
}

export interface AddCartItem {
    customerNumber: number;
    cartType: string,
    salesOrg?:{
        org: string,
        division:string,
        channel:string
    },
    cartItems:[
        {
            productIdQualifier: string,
            productId:string
            unitPrice:string,
            quantity:number
        }
    ]
}

export interface PaymentInformation {
    token: string
}

export interface ShoppingCart {
    cartItems: CartItem[],
    shippingForm: any,
    paymentInformation?: PaymentInformation
}

export interface OrderSubmitResponse{
    orderSubmitResponse:{
        orderId: string
    }
}