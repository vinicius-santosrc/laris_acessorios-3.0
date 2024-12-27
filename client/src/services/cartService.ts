import { toaster } from "../components/ui/toaster";
import { Product } from "../models/product";

export class cartService {
    private static updateLocalStorage(bagItems: Product[]) {
        localStorage.setItem("sacola", JSON.stringify(bagItems));
    }

    public static add = async (product: Product, size: any) => {
        let bagItems = this.get();
        const productWithSize = { ...product, size };

        const existingProductIndex = bagItems.findIndex((item: Product) => item.id === product.id);
        if (existingProductIndex === -1) {
            bagItems.push(productWithSize);
            toaster.create({
                title: "Item adicionado à sacola",
                type: "info",
            });
        } else {
            toaster.create({
                title: "Item já está na sacola",
                type: "warning",
            });
        }

        this.updateLocalStorage(bagItems);
    };

    public static remove = (productId: any) => {
        let bagItems = this.get();

        const updatedBagItems = bagItems.filter((item: any) => item.id !== productId);

        if (updatedBagItems.length === bagItems.length) {
            toaster.create({
                title: "Item não encontrado na sacola",
                type: "error",
            });
        } else {
            toaster.create({
                title: "Item removido da sacola",
                type: "success",
            });
        }

        this.updateLocalStorage(updatedBagItems);
    };

    public static get = (): Product[] => {
        const localStorageBag = localStorage.getItem("sacola");
        return localStorageBag ? JSON.parse(localStorageBag) : [];
    };
}
