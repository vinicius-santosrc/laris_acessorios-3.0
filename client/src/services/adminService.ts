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
import axios from 'axios';
import api from "./api";
import { toaster } from "../components/ui/toaster";

const url = process.env.REACT_APP_API_ENDPOINT;
const secretKey = process.env.REACT_APP_API_SECRET_KEY;
const preEndpoint = process.env.REACT_APP_API_PREENDPOINT;
const authorization = localStorage.getItem("token") ?? "";
const keyUpload = process.env.REACT_APP_API_UPLOAD_KEY ?? "";
const urlUpload = process.env.REACT_APP_API_UPLOAD_URL ?? "";

export class adminService {

    //** PLANNING */
    // functions to planning //

    static getPlanning = async () => {
        try {
            const response = await api.get(`${url}${preEndpoint}${secretKey}/planejamentos`, {
                headers: {
                    "Authorization": authorization
                }
            });
            return response.data;
        } catch (err) {
            throw err;
        }
    }

    static planningDeleteById = async (id: string) => {
        await api.post(`${url}${preEndpoint}${secretKey}/planejamentos/delete`, {
            id: id,
        }, {
            headers: {
                "Authorization": authorization
            }
        });
    }

    static addNewPlanningCard = async (name_card: string) => {
        await api.post(`${url}${preEndpoint}${secretKey}/planejamentos/add`, {
            name_card: name_card
        }, {
            headers: {
                "Authorization": authorization
            }
        });
    }

    static updatedCard = async (list: any, id: any) => {
        await api.post(`${url}${preEndpoint}${secretKey}/planejamentos/update`, {
            id: id,
            list: list
        }, {
            headers: {
                "Authorization": authorization
            }
        });
    }

    //** SHEETS */
    // functions to sheets //

    static getSheet = async (sheet_name: string) => {
        try {
            const response = await api.get(`${url}${preEndpoint}${secretKey}/${sheet_name}`, {
                headers: {
                    "Authorization": authorization
                }
            });
            return response.data.reverse();
        } catch (err) {
            throw err;
        }
    }

    static deleteSheetById = async (sheet: string, item: any) => {
        try {
            await api.post(`${url}${preEndpoint}${secretKey}/${sheet}/delete`, item, {
                headers: {
                    "Authorization": authorization
                }
            });
        } catch (error: any) {
            throw Error(error);
        }
    }

    static editSheetById = async (sheet: string, item: any) => {
        try {
            await api.post(`${url}${preEndpoint}${secretKey}/${sheet}/edit`, item, {
                headers: {
                    "Authorization": authorization
                }
            });
        } catch (error: any) {
            throw Error(error);
        }
    }

    static addSheetById = async (sheet: string, item: any) => {
        try {
            await api.post(`${url}${preEndpoint}${secretKey}/${sheet}/add`, item, {
                headers: {
                    "Authorization": authorization
                }
            });
        } catch (error: any) {
            throw Error(error);
        }
    }

    // ** CATEGORYS ** //
    static getCategorys = async () => {
        try {
            const response = await api.get(`${url}${preEndpoint}${secretKey}/categories`, {
                headers: {
                    "Authorization": authorization
                }
            });
            return response.data.reverse();
        } catch (err) {
            throw err;
        }
    }

    static addNewCategory = async (item: any, itemData: any) => {
        try {
            await api.post(`${url}${preEndpoint}${secretKey}/categories/add`, item, {
                headers: {
                    "Authorization": authorization
                }
            });
        } catch (error: any) {
            throw Error(error);
        }
    }

    static getAllCategoriesData = async () => {
        try {
            const response = await api.get(`${url}${preEndpoint}${secretKey}/categoriesData`, {
                headers: {
                    "Authorization": authorization
                }
            });
            return response.data.reverse();
        } catch (err) {
            throw err;
        }
    }

    static updateByCategory = async (category: CategoriesProps) => {
        await api.post(`${url}${preEndpoint}${secretKey}/categories/edit`, category, {
            headers: {
                "Authorization": authorization
            }
        });
    }

    static upload = async (event: any): Promise<string | null> => {
        const file = event.target.files[0];
        if (file) {
            return new Promise<string | null>((resolve, reject) => {
                new Compressor(file, {
                    success(result: any) {
                        const formData = new FormData();
                        formData.append('image', result, result.name);
                        formData.append('key', keyUpload);

                        // Making the POST request
                        api.post(urlUpload, formData)
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
                    error(err: any) {
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
    };

    static getMenuItems = async () => {
        try {
            const response = await api.get(`${url}${preEndpoint}${secretKey}/menuItems`, {
                headers: {
                    "Authorization": authorization
                }
            });
            let data = response.data;
            let newData: any = [];
            data.map((categoria: any) => {
                newData.push({
                    ...categoria,
                    subItems: JSON.parse(categoria.sub_items),
                });
            });

            return newData;
        } catch (err) {
            throw err;
        }
    }
}