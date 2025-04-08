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

const API_URL = process.env.REACT_APP_API_ENDPOINT;

export class ShippingService {
    static async getShippingOptionsByCep(cep: string): Promise<any> {
        try {
            const response = await axios.post(`${API_URL}/shipping/calculate`, {
                to: { postal_code: cep },
            }, {
                headers: {
                    "Content-Type": "application/json",
                }
            });

            const data: ShippingItem[] = response.data;
            const dataFiltered = data.filter((item: ShippingItem) =>
                item.error === undefined && (item.company.name === "Correios" || item.name === ".Package")
            );
            return dataFiltered;
        } catch (error: any) {
            console.error("Erro ao buscar opções de frete:", error);
            throw error;
        }
    }
}