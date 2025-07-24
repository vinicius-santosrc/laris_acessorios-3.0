/**
 * Creation Date: 23/07/2025
 * Author: Vinícius da Silva Santos
 * Coordinator: Larissa Alves de Andrade Moreira
 * Developed by: Lari's Acessórios Team
 * Copyright 2025, LARI'S ACESSÓRIOS
 * All rights are reserved. Reproduction in whole or part is prohibited without the written consent of the copyright owner.
 */

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