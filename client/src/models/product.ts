/**
 * Creation Date: 23/07/2025
 * Author: Vinícius da Silva Santos
 * Coordinator: Larissa Alves de Andrade Moreira
 * Developed by: Lari's Acessórios Team
 * Copyright 2025, LARI'S ACESSÓRIOS
 * All rights are reserved. Reproduction in whole or part is prohibited without the written consent of the copyright owner.
*/

export class ProductNew {
    productId: string;
    uid: string;
    productName: string;
    productReference: string;
    linkText: string;
    releaseDate: string;
    productAvailability: string;
    productSupplier: string;
    productType: string;
    productCollections: string[];
    productJewerlyType: string;
    productJewerlyName: string;
    productDiscount: number;
    productPrice: number;
    productExtender: string;
    productSizes: string[];
    productQuantity: number;
    productPhotoURL: string;

    constructor(init?: Partial<ProductNew>) {
        this.productId = init?.productId ?? '';
        this.uid = init?.uid ?? '';
        this.productName = init?.productName ?? '';
        this.productReference = init?.productReference ?? '';
        this.linkText = init?.linkText ?? '';
        this.releaseDate = init?.releaseDate ?? '';
        this.productAvailability = init?.productAvailability ?? '';
        this.productSupplier = init?.productSupplier ?? '';
        this.productType = init?.productType ?? '';
        this.productCollections = init?.productCollections ?? [];
        this.productJewerlyType = init?.productJewerlyType ?? '';
        this.productJewerlyName = init?.productJewerlyName ?? '';
        this.productDiscount = init?.productDiscount ?? 0;
        this.productPrice = init?.productPrice ?? 0;
        this.productExtender = init?.productExtender ?? '';
        this.productSizes = init?.productSizes ?? [];
        this.productQuantity = init?.productQuantity ?? 0;
        this.productPhotoURL = init?.productPhotoURL ?? '';
    }
}

export class Product {
    id: number;
    name_product: string;
    price: number;
    desconto: number;
    disponibilidade: 1 | 0;
    tamanhos: string;
    quantidade_disponivel: number;
    categoria: string;
    url: string;
    fornecedor: string;
    tipo: string;
    personalizavel: boolean;
    photoURL: string;
    extensor: string;
    type_full_label: string;
    categoryList: any;
    size?: any;
    description: string;
    type: "jewelry" | "perfume";
    availableForImmediateDelivery: boolean;

    constructor(init?: Partial<Product>) {
        this.id = init?.id ?? 0;
        this.name_product = init?.name_product ?? '';
        this.price = init?.price ?? 0;
        this.desconto = init?.desconto ?? 0;
        this.disponibilidade = init?.disponibilidade ?? 1;
        this.tamanhos = init?.tamanhos ?? '';
        this.quantidade_disponivel = init?.quantidade_disponivel ?? 0;
        this.categoria = init?.categoria ?? '';
        this.url = init?.url ?? '';
        this.fornecedor = init?.fornecedor ?? '';
        this.tipo = init?.tipo ?? '';
        this.personalizavel = init?.personalizavel ?? false;
        this.photoURL = init?.photoURL ?? '';
        this.extensor = init?.extensor ?? '';
        this.type_full_label = init?.type_full_label ?? '';
        this.categoryList = init?.categoryList ?? null;
        this.size = init?.size;
        this.description = init?.description ?? '';
        this.type = init?.type ?? "jewelry";
        this.availableForImmediateDelivery = init?.availableForImmediateDelivery ?? false;
    }
}
