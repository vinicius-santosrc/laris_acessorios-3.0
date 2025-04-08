/**
 * Creation Date: 22/02/2025
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
const authorization = localStorage.getItem("token") ?? "";

export class Facilitys {

    public static create() {
        // Implementar a lógica de criação, se necessário
    }

    public static async get(reference: string) {
        try {
            const response = await axios.get(`${url}${preEndpoint}${secretKey}/facilitys`);
            const retornData = response.data.find((item: any) => item.reference == reference);
            return retornData;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    public static async getAll() {
        try {
            const response = await axios.get(`${url}${preEndpoint}${secretKey}/facilitys`);
            return response.data;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    public static async save(item: any) {
        try {
            await axios.post(`${url}${preEndpoint}${secretKey}/facilitys/edit`, item, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        } catch (error: any) {
            throw Error(error);
        }
    }

    public static remove() {
        // Implementar a lógica de remoção, se necessário
    }
}