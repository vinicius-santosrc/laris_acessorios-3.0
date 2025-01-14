const url = process.env.REACT_APP_API_ENDPOINT;
const secretKey = process.env.REACT_APP_API_SECRET_KEY;
const preEndpoint = process.env.REACT_APP_API_PREENDPOINT;
export class clientsService {
    static getAll = async () => {
        try {
            const response = await fetch(`${url}${preEndpoint}${secretKey}/users`);
            const data = await response.json();
            return data;
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }
}