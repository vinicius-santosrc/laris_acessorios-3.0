/**
 * Creation Date: 14/01/2025
 * Author: Vinícius da Silva Santos
 * Coordinator: Larissa Alves de Andrade Moreira
 * Developed by: Lari's Acessórios Team
 * Copyright 2025, LARI'S ACESSÓRIOS
 * All rights are reserved. Reproduction in whole or part is prohibited without the written consent of the copyright owner.
 */

import { ShippingItem } from "@/models/shipping";


const API_URL = process.env.REACT_APP_API_ENDPOINT;

export class ShippingService {
    static async getShippingOptionsByCep(cep: string): Promise<any> {
        try {
            const response = await fetch(`${API_URL}/shipping/calculate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    to: { postal_code: cep },
                })
            });

            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status}`);
            }

            const data: ShippingItem[] = await response.json();
            const dataFiltered = data.filter((item: ShippingItem) => item.name == "SEDEX" || item.name == ".Package");
            return dataFiltered;
        } catch (error) {
            console.error("Erro ao buscar opções de frete:", error);
            throw error;
        }
    }
}
