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

const url = process.env.REACT_APP_API_ENDPOINT;
const secretKey = process.env.REACT_APP_API_SECRET_KEY;
const preEndpoint = process.env.REACT_APP_API_PREENDPOINT;

export class adminService {

    //** PLANNING */
    // functions to planning //

    static getPlanning = async () => {
        try {
            const response = await fetch(`${url}${preEndpoint}${secretKey}/planejamentos`);
            const data = await response.json();
            return data;
        } catch (err) {
            throw err;
        }
    }

    static planningDeleteById = async (id: string) => {
        fetch(`${url}${preEndpoint}${secretKey}/planejamentos/delete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: id,
            })
        })
    }

    static addNewPlanningCard = async (name_card: string) => {
        fetch(`${url}${preEndpoint}${secretKey}/planejamentos/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name_card: name_card
            }),
        })
    }

    static updatedCard = async (list: any, id: any) => {
        fetch(`${url}${preEndpoint}${secretKey}/planejamentos/update`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: id,
                list: list
            }),

        })
    }

    //** SHEETS */
    // functions to sheets //

    static getSheet = async (sheet_name: string) => {
        try {
            const response = await fetch(`${url}${preEndpoint}${secretKey}/${sheet_name}`);
            const data = await response.json();
            return data.reverse();
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    static deleteSheetById = async (sheet: string, item: any) => {
        try {
            await fetch(`${url}${preEndpoint}${secretKey}/${sheet}/delete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: item,
            })
        }
        catch (error) {
            console.error(error);
        }
    }

    static editSheetById = async (sheet: string, item: any) => {
        try {
            fetch(`${url}${preEndpoint}${secretKey}/${sheet}/edit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: item,
            })
        }
        catch (error) {
            console.error(error);
        }
    }

    static addSheetById = async (sheet: string, item: any) => {
        try {
            fetch(`${url}${preEndpoint}${secretKey}/${sheet}/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: item,
            })
        }
        catch (error) {
            console.error(error);
        }
    }

    // ** CATEGORYS ** //
    static getCategorys = async () => {
        try {
            const response = await fetch(`${url}${preEndpoint}${secretKey}/categories`);
            const data = await response.json();
            return data.reverse();
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    static addNewCategory = async (item: any, itemData: any) => {
        try {
            await fetch(`${url}${preEndpoint}${secretKey}/categories/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: item,
            })
        }
        catch (error) {
            console.error(error);
        }
    }

    static getAllCategoriesData = async () => {
        try {
            const response = await fetch(`${url}${preEndpoint}${secretKey}/categoriesData`);
            const data = await response.json();
            return data.reverse();
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    static updateByCategory = async (category: CategoriesProps) => {
        await fetch(`${url}${preEndpoint}${secretKey}/categories/edit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(category)
        })
    }

    static upload = async (event: any): Promise<string | null> => {
        const file = event.target.files[0];
        if (file) {
            return new Promise<string | null>((resolve, reject) => {
                new Compressor(file, {
                    success(result: any) {
                        const formData = new FormData();
                        formData.append('image', result, result.name);
                        formData.append('key', 'f559d2e043626a1955fb14d57caec1e2');

                        // Fazendo a requisição POST
                        fetch('https://api.imgbb.com/1/upload', {
                            method: 'POST',
                            body: formData,
                        })
                            .then((response) => response.json())
                            .then((response) => {
                                if (response.success) {
                                    console.log('Upload successful:', response.data.url);
                                    resolve(response.data.url); // Resolva a promessa com a URL
                                } else {
                                    console.error('Upload failed:', response.error.message);
                                    resolve(null); // Resolve com null se falhar
                                }
                            })
                            .catch((error) => {
                                console.error('Error during upload:', error);
                                resolve(null); // Resolve com null em caso de erro
                            });
                    },
                    error(err: any) {
                        console.error('Error during image compression:', err.message);
                        resolve(null); // Resolve com null se houver erro de compressão
                    },
                });
            });
        }

        return null; // Caso não haja arquivo
    };


    static getMenuItems = async () => {
        try {
            const response = await fetch(`${url}${preEndpoint}${secretKey}/menuItems`);
            let data = await response.json();
            let newData: any = [];
            data.map((categoria: any) => {
                newData.push({
                    ...categoria,
                    subItems: JSON.parse(categoria.sub_items),
                })
            })

            return newData;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

}