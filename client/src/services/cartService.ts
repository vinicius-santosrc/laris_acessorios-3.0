import { toaster } from "../components/ui/toaster";
import { Product } from "../models/product";

export class cartService {
    public static readonly add = async (product: Product) => {
        toaster.create({
            title: "Item adicionado a sacola",
            type: "info"
        })
    }
}