/**
 * Creation Date: 14/01/2025
 * Author: Vinícius da Silva Santos
 * Coordinator: Larissa Alves de Andrade Moreira
 * Developed by: Lari's Acessórios Team
 * Copyright 2025, LARI'S ACESSÓRIOS
 * All rights are reserved. Reproduction in whole or part is prohibited without the written consent of the copyright owner.
 */

'use strict'

import { CategoriesProps } from "@/lib/utils";
import Compressor from "compressorjs";
import api, { getUrlByAmbient } from "./api";
import { toaster } from "../components/ui/toaster";


export default class AdminRepository {
    private readonly authorization: string;
    private readonly url: string;
    private readonly secretKey: string;
    private readonly preEndpoint: string;
    private readonly keyUpload: string;
    private readonly urlUpload: string;

    constructor() {
        this.authorization = localStorage.getItem("token") ?? "";
        this.url = getUrlByAmbient();
        this.secretKey = process.env.REACT_APP_API_SECRET_KEY ?? "";
        this.preEndpoint = process.env.REACT_APP_API_PREENDPOINT ?? "";
        this.keyUpload = process.env.REACT_APP_API_UPLOAD_KEY ?? "";
        this.urlUpload = process.env.REACT_APP_API_UPLOAD_URL ?? "";
    }

    //** PLANNING */
    // functions to planning //

    async getPlanning() {
        const response = await api.get(`${this.url}${this.preEndpoint}${this.secretKey}/planejamentos`, {
            headers: {
                "Authorization": this.authorization
            }
        });
        return response.data;
    }

    async planningDeleteById(id: string) {
        await api.post(`${this.url}${this.preEndpoint}${this.secretKey}/planejamentos/delete`, {
            id: id,
        }, {
            headers: {
                'Content-Type': 'application/json',
                "Authorization": this.authorization
            }
        });
    }

    async addNewPlanningCard(name_card: string) {
        await api.post(`${this.url}${this.preEndpoint}${this.secretKey}/planejamentos/add`, {
            name_card: name_card
        }, {
            headers: {
                'Content-Type': 'application/json',
                "Authorization": this.authorization
            }
        });
    }

    async updatedCard(list: any, id: any) {
        await api.post(`${this.url}${this.preEndpoint}${this.secretKey}/planejamentos/update`, {
            id: id,
            list: list
        }, {
            headers: {
                'Content-Type': 'application/json',
                "Authorization": this.authorization
            }
        });
    }

    //** SHEETS */
    // functions to sheets //

    async getSheet(sheet_name: string) {
        const response = await api.get(`${this.url}${this.preEndpoint}${this.secretKey}/${sheet_name}`, {
            headers: {
                "Authorization": this.authorization
            }
        });
        return response.data.reverse();
    }

    async deleteSheetById(sheet: string, item: any) {
        await api.delete(`${this.url}${this.preEndpoint}${this.secretKey}/${sheet}/delete`, item);
    }

    async editSheetById(sheet: string, item: any) {
        await api.post(`${this.url}${this.preEndpoint}${this.secretKey}/${sheet}/edit`, item, {
            headers: {
                'Content-Type': 'application/json',
                "Authorization": this.authorization
            }
        });
    }

    async addSheetById(sheet: string, item: any) {
        try {
            await api.post(`${this.url}${this.preEndpoint}${this.secretKey}/${sheet}/add`, item, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": this.authorization
                }
            });
        } catch (error: any) {
            throw Error(error);
        }
    }

    // ** CATEGORYS ** //
    async getCategorys() {
        const response = await api.get(`${this.url}${this.preEndpoint}${this.secretKey}/categories`, {
            headers: {
                "Authorization": this.authorization
            }
        });
        return response.data.reverse();
    }

    async addNewCategory(item: any, itemData: any) {
        await api.post(`${this.url}${this.preEndpoint}${this.secretKey}/categories/add`, item, {
            headers: {
                'Content-Type': 'application/json',
                "Authorization": this.authorization
            }
        });
    }

    async getAllCategoriesData() {
        const response = await api.get(`${this.url}${this.preEndpoint}${this.secretKey}/categoriesData`, {
            headers: {
                "Authorization": this.authorization
            }
        });
        return response.data.reverse();
    }

    async updateByCategory(category: CategoriesProps) {
        await api.post(`${this.url}${this.preEndpoint}${this.secretKey}/categories/edit`, category, {
            headers: {
                'Content-Type': 'application/json',
                "Authorization": this.authorization
            }
        });
    }

    async upload(event: any): Promise<string | null> {
        const file = event.target.files[0];
        if (file) {
            return new Promise<string | null>((resolve, reject) => {
                new Compressor(file, {
                    success: (result: any) => {
                        const formData = new FormData();
                        formData.append('image', result, result.name);
                        formData.append('key', this.keyUpload);

                        // Making the POST request
                        api.post(this.urlUpload, formData)
                            .then((response) => {
                                if (response.data.success) {
                                    resolve(response.data.data.url); // Resolve the promise with the URL
                                } else {
                                    console.error('Upload failed:', response.data.error.message);
                                    resolve(null); // Resolve with null if it fails
                                }
                            })
                            .catch((error) => {
                                console.error('Error during upload:', error);
                                toaster.create({
                                    type: "error",
                                    title: "Erro no upload",
                                    description: "Erro ao enviar imagem no banco de imagens"
                                })
                                resolve(null); // Resolve with null in case of error
                            });
                    },
                    error: (err: any) => {
                        console.error('Error during image compression:', err.message);
                        toaster.create({
                            type: "error",
                            title: "Erro no upload",
                            description: "Erro ao enviar imagem no banco de imagens"
                        })
                        resolve(null); // Resolve with null if there is a compression error
                    },
                });
            });
        }

        return null; // If there is no file
    }

    async getMenuItems() {
        const response = await api.get(`${this.url}${this.preEndpoint}${this.secretKey}/menuItems`);
        let data = response.data;
        let newData: any = [];
        data.map((categoria: any) => {
            newData.push({
                ...categoria,
                subItems: JSON.parse(categoria.sub_items),
            });
        });

        return newData;
    }
}