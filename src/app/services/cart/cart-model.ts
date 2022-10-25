import { CartItem } from '../storage/shopping-cart.model';

export interface ViewCartResponse {
    cartItems: CartItem[];
}

export interface CartUpdatePayload {
    customerNumber?:string,
    cartItems: UpdateCart[]
}

export interface UpdateCart {
    lineItemId: string,
    quantity?: number,
    licenseFileId?: string
}

export interface StatusResponse {
    message: string,
    status: string,
    code?:string
}

export interface SimulatedPayload{
    orderSimRequest:{
        paymentToken: string
    }
}

export interface OrderSubmitPayload{
    orderSubmitRequest:{
        paymentToken: string
    }
}

