import { Product } from "@/models/product";

const url = process.env.REACT_APP_API_ENDPOINT;
const secretKey = process.env.REACT_APP_API_SECRET_KEY;
const preEndpoint = process.env.REACT_APP_API_PREENDPOINT;
//const url = process.env.REACT_APP_API_ENDPOINT_TEST;

class productService {
    constructor(

    ) { }

    static getAll = async () => {
        try {
            const response = await fetch(`${url}${preEndpoint}${secretKey}/products`);
            const data = await response.json() || [];
            return data.reverse();
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    static getById = async (id: string) => {
        try {
            const response = await fetch(`${url}${preEndpoint}${secretKey}/products`);
            const data = await response.json();
            const foundProduct = data.find((PRODUCT: any) => PRODUCT.id == id);
            return foundProduct;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    static getByURL = async (URL: any) => {
        try {
            const response = await fetch(`${url}${preEndpoint}${secretKey}/products`);
            const data = await response.json();

            const foundProduct = data.find((produto: any) => produto.url == URL);
            return foundProduct;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    static getByCategory = async (Category: string) => {
        try {
            const response = await fetch(`${url}${preEndpoint}${secretKey}/products`);
            const data = await response.json();
            const foundProduct = data.filter((produto: Product) => produto.tipo.toLowerCase() == Category);
            return foundProduct.reverse();
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}
export default productService;