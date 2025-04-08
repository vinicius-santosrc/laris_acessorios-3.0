/**
 * Creation Date: 14/01/2025
 * Author: Vinícius da Silva Santos
 * Coordinator: Larissa Alves de Andrade Moreira
 * Developed by: Lari's Acessórios Team
 * Copyright 2025, LARI'S ACESSÓRIOS
 * All rights are reserved. Reproduction in whole or part is prohibited without the written consent of the copyright owner.
 */

import axios from 'axios';

const url = process.env.REACT_APP_API_ENDPOINT;
//const url = process.env.REACT_APP_API_ENDPOINT_TEST;
const secretKey = process.env.REACT_APP_API_SECRET_KEY;
const preEndpoint = process.env.REACT_APP_API_PREENDPOINT;

export class clientsService {
    static getAll = async () => {
        try {
            const response = await axios.get(`${url}${preEndpoint}${secretKey}/users`);
            return response.data;
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }
}