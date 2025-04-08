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
import axios from 'axios';

const url = process.env.REACT_APP_API_ENDPOINT;
const secretKey = process.env.REACT_APP_API_SECRET_KEY;
const preEndpoint = process.env.REACT_APP_API_PREENDPOINT;

class productService {
    private static countErr: number = 0;

    public static readonly getAll = async () => {
        try {
            const response = await axios.get(`${url}${preEndpoint}${secretKey}/products`);
            return response.data.reverse();
        } catch (err) {

            throw err;
        }
    }

    public static readonly getById = async (id: string) => {
        try {
            const response = await axios.get(`${url}${preEndpoint}${secretKey}/products`);
            const foundProduct = response.data.find((PRODUCT: any) => PRODUCT.id == id);
            return foundProduct;
        } catch (err) {
            throw err;
        }
    }

    public static readonly getByCategory = async (Category: string) => {
        try {
            const response = await axios.get(`${url}${preEndpoint}${secretKey}/products`);
            const foundProduct = response.data.filter((produto: Product) => JSON.parse(produto.categoryList).includes(Category));
            return foundProduct.reverse();
        } catch (err) {
            throw err;
        }
    }

    public static readonly getByURL = async (URL: string) => {
        try {
            const response = await axios.post(`${url}${preEndpoint}${secretKey}/products/searchbyurl`, {
                url: URL
            });
            const foundProduct = response.data;
            return foundProduct;
        } catch (err) {
            if (this.countErr < 4) {
                await productService.getByURL(URL);
            }
            this.countErr++;
            throw err;
        }
    };

    public static readonly deleteItemById = async (id: string) => {
        try {
            const response = await axios.post(`${url}${preEndpoint}${secretKey}/products/delete`, {
                id: id,
            }, {
                headers: {
                    'Content-Type': 'application/json',
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

    public static readonly deleteByList = async (array: any[]) => {
        try {
            const promises = array.map((item) => this.deleteItemById(item.toString()));
            await Promise.all(promises);
        } catch (error: any) {

            throw error;
        }
    }

    public static readonly changeVisibilityByList = async (array: any[], state: "avaliable" | "unavaliable") => {
        try {
            const promises = array.map((id) => axios.post(`${url}${preEndpoint}${secretKey}/products/changevisibility`, {
                disponibilidade: state == "avaliable" ? 1 : 0,
                id: id,
            }, {
                headers: {
                    'Content-Type': 'application/json',
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

    public static readonly updateProduct = async (product: Product) => {
        try {
            await axios.post(`${url}${preEndpoint}${secretKey}/products/edit`, product, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        } catch (error: any) {

            throw new Error(error);
        }
    }

    public static readonly createProduct = async (product: Product) => {
        try {
            await axios.post(`${url}${preEndpoint}${secretKey}/products/add`, product, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        } catch (error: any) {

            throw new Error(error);
        }
    }

    public static readonly getByRelatedCategory = async (category: string[]) => {
        try {
            const response = await axios.get(`${url}${preEndpoint}${secretKey}/products`);
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
export default productService;