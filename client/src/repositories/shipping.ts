/**
 * Creation Date: 14/01/2025
 * Author: Vinícius da Silva Santos
 * Coordinator: Larissa Alves de Andrade Moreira
 * Developed by: Lari's Acessórios Team
 * Copyright 2025, LARI'S ACESSÓRIOS
 * All rights are reserved. Reproduction in whole or part is prohibited without the written consent of the copyright owner.
 */

import axios from 'axios';
import { ShippingItem } from "@/models/shipping";
import { getUrlByAmbient } from './api';

export class ShippingRepository {
    private readonly apiUrl: string;

    constructor() {
        this.apiUrl = getUrlByAmbient();
    }

    async getShippingOptionsByCep(cep: string): Promise<ShippingItem[]> {
        try {
            const response = await axios.post(`${this.apiUrl}/shipping/calculate`, {
                to: { postal_code: cep },
            }, {
                headers: {
                    "Content-Type": "application/json",
                }
            });

            const data: ShippingItem[] = response.data;
            return data.filter((item: ShippingItem) =>
                item.error === undefined && (item.company.name === "Correios" || item.name === ".Package")
            );
        } catch (error: any) {
            console.error("Erro ao buscar opções de frete:", error);
            throw error;
        }
    }
}