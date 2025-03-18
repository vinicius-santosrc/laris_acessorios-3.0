export interface Dimensions {
    height: number;
    width: number;
    length: number;
}

export interface Package {
    price: string;
    discount: string;
    format: string;
    weight: string;
    insurance_value: string;
    dimensions: Dimensions;
}

export interface DeliveryRange {
    min: number;
    max: number;
}

export interface AdditionalServices {
    receipt: boolean;
    own_hand: boolean;
    collect: boolean;
}

export interface Additional {
    unit: {
        price: number;
        delivery: number;
    };
}

export interface Company {
    id: number;
    name: string;
    picture: string;
}

export interface ShippingItem {
    id: number;
    name: string;
    price?: string;
    custom_price?: string;
    discount?: string;
    currency?: string;
    delivery_time?: number;
    delivery_range?: DeliveryRange;
    custom_delivery_time?: number;
    custom_delivery_range?: DeliveryRange;
    packages?: Package[];
    additional_services?: AdditionalServices;
    additional?: Additional;
    company: Company;
    error?: string;
}