/**
 * Creation Date: 22/02/2025
 * Author: Vinícius da Silva Santos
 * Coordinator: Larissa Alves de Andrade Moreira
 * Developed by: Lari's Acessórios Team
 * Copyright 2025, LARI'S ACESSÓRIOS
 * All rights are reserved. Reproduction in whole or part is prohibited without the written consent of the copyright owner.
 */

import api, { getUrlByAmbient } from './api';

const url = getUrlByAmbient();
const secretKey = process.env.REACT_APP_API_SECRET_KEY;
const preEndpoint = process.env.REACT_APP_API_PREENDPOINT;
const authorization = localStorage.getItem("token") ?? "";

export class Facilitys {

    public static create() {
        // Implementar a lógica de criação, se necessário
    }

    public static async get(reference: string) {
        try {
            const response = await api.put(`${url}${preEndpoint}${secretKey}/facilitys/get`, { reference: reference });
            return response;
        } catch (err) {
            throw err;
        }
    }

    public static getByRef(reference: any, contextFacility: any[]) {
        if (contextFacility) {
            try {
                const found = contextFacility.find((item) => item.reference == reference);
                return found;
            } catch (error) {
                console.error("Erro ao buscar os dados de facility da página:", error);
                throw error;
            }
        }
    }

    public static async getAll() {
        try {
            const response = await api.get(`${url}${preEndpoint}${secretKey}/facilitys`);
            return response.data;
        } catch (err) {
            throw err;
        }
    }

    public static async save(item: any) {
        try {
            await api.post(`${url}${preEndpoint}${secretKey}/facilitys/edit`, item, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': authorization
                }
            });
        } catch (error: any) {
            throw Error(error);
        }
    }

    public static remove() {
        // Implementar a lógica de remoção, se necessário
    }

    public static getFacilityByPage(page: string, contextFacility: any[]) {
        if (page === "home" && contextFacility) {
            try {
                const references = [
                    "banner-principal",
                    "banner-principal-texts",
                    "banner-secondary",
                    "banner-secondary-texts"
                ];

                const facilityMap: Record<string, any> = {};

                references.forEach((ref) => {
                    const found = contextFacility.find((item) => item.reference == ref);
                    facilityMap[ref] = found ?? null;
                });

                return facilityMap;
            } catch (error) {
                console.error("Erro ao buscar os dados de facility da página:", error);
                throw error;
            }
        }
    }

}