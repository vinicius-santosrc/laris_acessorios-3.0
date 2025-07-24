/**
 * Creation Date: 22/02/2025
 * Author: Vinícius da Silva Santos
 * Coordinator: Larissa Alves de Andrade Moreira
 * Developed by: Lari's Acessórios Team
 * Copyright 2025, LARI'S ACESSÓRIOS
 * All rights are reserved. Reproduction in whole or part is prohibited without the written consent of the copyright owner.
 */

import api, { getUrlByAmbient } from './api';

export class FacilitysRepository {
    private readonly url: string;
    private readonly secretKey: string;
    private readonly preEndpoint: string;
    private readonly authorization: string;

    constructor() {
        this.url = getUrlByAmbient();
        this.secretKey = process.env.REACT_APP_API_SECRET_KEY ?? "";
        this.preEndpoint = process.env.REACT_APP_API_PREENDPOINT ?? "";
        this.authorization = localStorage.getItem("token") ?? "";
    }

    public create() {
        // Implementar a lógica de criação, se necessário
    }

    public async get(reference: string) {
        const response = await api.put(`${this.url}${this.preEndpoint}${this.secretKey}/facilitys/get`, { reference });
        return response;
    }

    public getByRef(reference: any, contextFacility: any[]) {
        if (contextFacility) {
            return contextFacility.find((item) => item.reference == reference);
        }
    }

    public async getAll() {
        const response = await api.get(`${this.url}${this.preEndpoint}${this.secretKey}/facilitys`);
        return response.data;
    }

    public async save(item: any) {
        await api.post(`${this.url}${this.preEndpoint}${this.secretKey}/facilitys/edit`, item, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this.authorization
            }
        });
    }

    public remove() {
        // Implementar a lógica de remoção, se necessário
    }

    public getFacilityByPage(page: string, contextFacility: any[]) {
        if (page === "home" && contextFacility) {
            const references = [
                "banner-principal",
                "banner-principal-texts",
                "banner-secondary",
                "banner-secondary-texts",
                'showcase-inside-alternative-1',
                "showcase-inside-alternative-1-text",
                'showcase-inside-alternative-2',
                "showcase-inside-alternative-2-text",
                'showcase-inside-alternative-3',
                "showcase-inside-alternative-3-text"
            ];

            const facilityMap: Record<string, any> = {};

            references.forEach((ref) => {
                const found = contextFacility.find((item) => item.reference == ref);
                facilityMap[ref] = found ?? null;
            });

            return facilityMap;
        }
    }
}