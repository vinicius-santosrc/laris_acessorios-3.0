/**
 * Creation Date: 19/01/2025
 * Author: Vinícius da Silva Santos
 * Coordinator: Larissa Alves de Andrade Moreira
 * Developed by: Lari's Acessórios Team
 * Copyright 2025, LARI'S ACESSÓRIOS
 * All rights are reserved. Reproduction in whole or part is prohibited without the written consent of the copyright owner.
 */

import { toaster } from "../components/ui/toaster";
import { Product } from "@/models/product";
import api, { getUrlByAmbient } from "./api";


class ProductRepository {
    private readonly url: string;
    private readonly secretKey: string;
    private readonly preEndpoint: string;
    private readonly authorization: string;
    private countErr: number = 0;

    constructor() {
        this.url = getUrlByAmbient();
        this.secretKey = process.env.REACT_APP_API_SECRET_KEY ?? "";
        this.preEndpoint = process.env.REACT_APP_API_PREENDPOINT ?? "";
        this.authorization = localStorage.getItem("token") ?? "";
    }

    public readonly getAll = async () => {
        const response = await api.get(`${this.url}${this.preEndpoint}${this.secretKey}/products`);
        return response.data.reverse();
    }

    public readonly getById = async (id: string) => {
        const response = await api.get(`${this.url}${this.preEndpoint}${this.secretKey}/products`);
        const foundProduct = response.data.find((PRODUCT: any) => PRODUCT.id == id);
        return foundProduct;
    }

    public readonly getByCategory = async (Category: string) => {
        const response = await api.get(`${this.url}${this.preEndpoint}${this.secretKey}/products`);
        const foundProduct = response.data.filter((produto: Product) => JSON.parse(produto.categoryList).includes(Category));
        return foundProduct.reverse();
    }

    public readonly getByURL = async (URL: string) => {
        try {
            const response = await api.post(`${this.url}${this.preEndpoint}${this.secretKey}/products/searchbyurl`, {
                url: URL
            });
            const foundProduct = response.data;
            return foundProduct;
        } catch (err) {
            if (this.countErr < 4) {
                await this.getByURL(URL);
            }
            this.countErr++;
            throw err;
        }
    };

    public readonly deleteItemById = async (id: string) => {
        try {
            const response = await api.post(`${this.url}${this.preEndpoint}${this.secretKey}/products/delete`, {
                id: id,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": this.authorization
                }
            });

            if (response.status !== 200) {
                toaster.create({
                    title: "Oops...",
                    description: `Não foi possível excluir o item com id: ${id}`,
                    type: "error"
                });
                throw new Error(`Failed to delete item with ID: ${id}`);
            }
        } catch (error: any) {
            throw error;
        }
    }

    public readonly deleteByList = async (array: any[]) => {
        try {
            const promises = array.map((item) => this.deleteItemById(item.toString()));
            await Promise.all(promises);
        } catch (error: any) {
            throw error;
        }
    }

    public readonly changeVisibilityByList = async (array: any[], state: "avaliable" | "unavaliable") => {
        try {
            const promises = array.map((id) => api.post(`${this.url}${this.preEndpoint}${this.secretKey}/products/changevisibility`, {
                disponibilidade: state == "avaliable" ? 1 : 0,
                id: id,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": this.authorization
                }
            }));

            await Promise.all(promises);
        } catch (error: any) {
            toaster.create({
                title: "Oops...",
                description: `Não foi possível alterar a visibilidade dos itens.`,
                type: "error"
            });
            throw error;
        }
    }

    public readonly updateProduct = async (product: Product) => {
        try {
            await api.post(`${this.url}${this.preEndpoint}${this.secretKey}/products/edit`, product, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": this.authorization
                }
            });
        } catch (error: any) {
            throw new Error(error);
        }
    }

    public readonly createProduct = async (product: Product) => {
        try {
            await api.post(`${this.url}${this.preEndpoint}${this.secretKey}/products/add`, product, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": this.authorization
                }
            });
        } catch (error: any) {
            throw new Error(error);
        }
    }

    public readonly getByRelatedCategory = async (category: string[]) => {
        try {
            const response = await api.get(`${this.url}${this.preEndpoint}${this.secretKey}/products`);
            let dataByCategory: any[] = [];
            response.data.forEach((product: Product) => {
                if (window.location.pathname === "/product/" + product.url) {
                    return;
                } else if (JSON.parse(product.categoryList).some((cat: any) => category.includes(cat))) {
                    dataByCategory.push(product);
                }
            });
            return dataByCategory.reverse();
        } catch (err) {
            throw err;
        }
    }
}
export default ProductRepository;