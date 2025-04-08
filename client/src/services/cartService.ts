/**
 * Creation Date: 27/12/2024
 * Author: Vinícius da Silva Santos
 * Coordinator: Larissa Alves de Andrade Moreira
 * Developed by: Lari's Acessórios Team
 * Copyright 2025, LARI'S ACESSÓRIOS
 * All rights are reserved. Reproduction in whole or part is prohibited without the written consent of the copyright owner.
 */

import { toaster } from "../components/ui/toaster";
import { Product } from "../models/product";
import productService from "./productService";

export class cartService {
    private static updateLocalStorage(bagItems: any[]) {
        localStorage.setItem("sacola", JSON.stringify(bagItems));
    }

    public static add = async (product: Product, size: any) => {
        let bagItems = await this.get();

        const productWithSize = {
            id: product.id,
            size: size
        };

        const existingProductIndex = bagItems.findIndex((item: Product) => item.id === product.id);
        if (existingProductIndex === -1) {
            bagItems.push(productWithSize);
            toaster.create({
                title: "Produto adicionado à sacola",
                type: "info",
            });
        } else {
            toaster.create({
                title: "Produto já está na sacola",
                type: "warning",
            });
        }

        this.updateLocalStorage(bagItems);
    };

    public static remove = async (productId: any) => {
        let bagItems = await this.get();

        if (!Array.isArray(bagItems)) {
            bagItems = [];
        }

        const updatedBagItems = bagItems.filter((item: any) => item.id !== productId);

        if (updatedBagItems.length === bagItems.length) {
            toaster.create({
                title: "Item não encontrado na sacola",
                type: "error",
            });
        } else {
            toaster.create({
                title: "Item removido da sacola",
                type: "success",
            });
        }

        this.updateLocalStorage(updatedBagItems);
    };

    public static get = async (): Promise<any[]> => {
        const localStorageBag = localStorage.getItem("sacola");
        let bagItems: Product[] = localStorageBag ? JSON.parse(localStorageBag) : [];

        if (!Array.isArray(bagItems)) {
            bagItems = [];
        }

        const updatedBagItems = await Promise.all(
            bagItems.map(async (product) => {
                const currentProduct = await productService.getById(product.id.toString());
                if (currentProduct.disponibilidade > 0) {
                    return product;
                } else {
                    toaster.create({
                        title: currentProduct.name_product,
                        description: "Foi removido pois não está mais disponível",
                        type: "error"
                    });
                    return null;
                }
            })
        );

        const filteredBagItems = updatedBagItems.filter((item) => item !== null) as { id: any; size: any }[];
        this.updateLocalStorage(filteredBagItems);
        return filteredBagItems;
    };
}
