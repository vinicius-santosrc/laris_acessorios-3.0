/**
 * Creation Date: 14/01/2025
 * Author: Vinícius da Silva Santos
 * Coordinator: Larissa Alves de Andrade Moreira
 * Developed by: Lari's Acessórios Team
 * Copyright 2025, LARI'S ACESSÓRIOS
 * All rights are reserved. Reproduction in whole or part is prohibited without the written consent of the copyright owner.
 */

import api, { getUrlByAmbient } from './api';

export class ClientsRepository {
    private url: string;
    private secretKey: string;
    private preEndpoint: string;

    constructor() {
        this.url = getUrlByAmbient();
        this.secretKey = process.env.REACT_APP_API_SECRET_KEY ?? '';
        this.preEndpoint = process.env.REACT_APP_API_PREENDPOINT ?? '';
    }

    readonly getAll = async (): Promise<any> => {
        const response = await api.get(`${this.url}${this.preEndpoint}${this.secretKey}/users`);
        return response.data;
    };
}