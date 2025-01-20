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

const url = process.env.REACT_APP_API_ENDPOINT;
const secretKey = process.env.REACT_APP_API_SECRET_KEY;
const preEndpoint = process.env.REACT_APP_API_PREENDPOINT;
//const url = process.env.REACT_APP_API_ENDPOINT_TEST;

class productService {
    private static countErr: number = 0;
    public static readonly getAll = async () => {
        try {
            const response = await fetch(`${url}${preEndpoint}${secretKey}/products`);
            const data = await response.json() || [];
            return data.reverse();
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    public static readonly getById = async (id: string) => {
        try {
            const response = await fetch(`${url}${preEndpoint}${secretKey}/products`);
            const data = await response.json();
            const foundProduct = data.find((PRODUCT: any) => PRODUCT.id == id);
            return foundProduct;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    public static readonly getByCategory = async (Category: string) => {
        try {
            const response = await fetch(`${url}${preEndpoint}${secretKey}/products`);
            const data = await response.json();
            const foundProduct = data.filter((produto: Product) => JSON.parse(produto.categoryList).includes(Category));
            return foundProduct.reverse();
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    public static readonly getByURL = async (URL: string) => {
        try {
            const response = await fetch(`${url}${preEndpoint}${secretKey}/products`);
            const data = await response.json();
            const foundProduct = data.find((produto: Product) => produto.url == URL);
            return foundProduct;
        } catch (err) {
            console.error(err);
            if (this.countErr < 4) {
                await productService.getByURL(URL)
            }
            this.countErr++;
            throw err;
        }
    };

    public static readonly deleteItemById = async (id: string) => {
        try {
            const response = await fetch(`${url}${preEndpoint}${secretKey}/products/delete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: id,
                }),
            });

            if (!response.ok) {
                toaster.create({
                    title: "Oops...",
                    description: `Não foi possível excluir o item com id: ${id}`,
                    type: "error"
                })
                throw new Error(`Failed to delete item with ID: ${id}`);
            }
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }

    public static readonly deleteByList = async (array: any[]) => {
        try {
            const promises = array.map((item) => this.deleteItemById(item.toString()));

            await Promise.all(promises);
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }

    public static readonly changeVisibilityByList = async (array: any[], state: "avaliable" | "unavaliable") => {
        try {
            const promises = array.map((id) => fetch(`${url}${preEndpoint}${secretKey}/products/changevisibility`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    disponibilidade: state == "avaliable" ? 1 : 0,
                    id: id,
                }),
            }))

            await Promise.all(promises);
        }
        catch (error) {
            toaster.create({
                title: "Oops...",
                description: `Não foi possível alterar a visibilidade dos itens.`,
                type: "error"
            })
            console.error(error);
            throw error;
        }
    }

    public static readonly updateProduct = async(product: Product) => {
        try {
            await fetch(`${url}${preEndpoint}${secretKey}/products/edit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(product),
            })
        }
        catch (error: any) {
            console.error(error);
            throw new Error(error);
        }
    }

    public static readonly createProduct = async (product: Product) => {
        try {
            await fetch(`${url}${preEndpoint}${secretKey}/products/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(product),
            })
        }
        catch (error: any) {
            console.error(error);
            throw new Error(error);
        }
    }

}
export default productService;