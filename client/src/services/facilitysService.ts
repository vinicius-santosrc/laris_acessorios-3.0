/**
 * Creation Date: 22/02/2025
 * Author: Vinícius da Silva Santos
 * Coordinator: Larissa Alves de Andrade Moreira
 * Developed by: Lari's Acessórios Team
 * Copyright 2025, LARI'S ACESSÓRIOS
 * All rights are reserved. Reproduction in whole or part is prohibited without the written consent of the copyright owner.
 */


const url = process.env.REACT_APP_API_ENDPOINT;
const endpoint = process.env.REACT_APP_API_ENDPOINT;
//const endpoint = process.env.REACT_APP_API_ENDPOINT_TEST;
const secretKey = process.env.REACT_APP_API_SECRET_KEY;
const preEndpoint = process.env.REACT_APP_API_PREENDPOINT;

export class Facilitys {
    
    public static create() {
        
    }
    public static async get(reference: string) {
        try {
            const response = await fetch(`${url}${preEndpoint}${secretKey}/facilitys`);
            const data = await response.json();
            const retornData = data.find((item: any) => item.reference == reference);
            return retornData;
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }

    public static async getAll() {
        try {
            const response = await fetch(`${url}${preEndpoint}${secretKey}/facilitys`);
            const data = await response.json();
            return data;
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }

    public static async save(item: any) {
        try {
            await fetch(`${url}${preEndpoint}${secretKey}/facilitys/edit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(item)
            })
        }
        catch (error) {
            console.error(error);
        }
    }

    public static remvoe() {

    }
}