'use strict'

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
}