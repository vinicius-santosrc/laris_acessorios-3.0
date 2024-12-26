import { Product } from "@/models/product";

const url = process.env.REACT_APP_API_ENDPOINT;
const secretKey = process.env.REACT_APP_API_SECRET_KEY;
const preEndpoint = process.env.REACT_APP_API_PREENDPOINT;
//const url = process.env.REACT_APP_API_ENDPOINT_TEST;

class productService {
    public static readonly getAll = async () => {
        try {
            const response = await fetch(`${url}${preEndpoint}${secretKey}/products`);
            const data = await response.json() || [];
            return data.reverse();
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    public static readonly getById = async (id: string) => {
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

    public static readonly getByCategory = async (Category: string) => {
        try {
            const response = await fetch(`${url}${preEndpoint}${secretKey}/products`);
            const data = await response.json();
            const foundProduct = data.filter((produto: Product) => JSON.parse(produto.categoryList).includes(Category));
            return foundProduct.reverse();
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    public static readonly getByURL = async (URL: string) => {
        try {
            const response = await fetch(`${url}${preEndpoint}${secretKey}/products`);
            const data = await response.json();
            const foundProduct = data.find((produto: Product) => produto.url == URL);
            return foundProduct;
        } catch (err) {
            console.error(err);
            throw err;
        }
    };
}
export default productService;