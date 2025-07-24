import { useEffect, useState } from "react";
import { CategoriesProps } from "../../lib/utils";
import Categories from "../categories/Categories";
import "./Search.css";
import AdminRepository from "../../repositories/admin";
import { Loader } from "../../components/ui/loader";

export const SearchPage = () => {
    const [categorie, setCategorie] = useState<CategoriesProps | null>(null);
    const adminRepo = new AdminRepository();
    useEffect(() => {
        getCollections();
    }, []);

    async function getCollections() {
        const categorys = await adminRepo.getAllCategoriesData();
        setCategorie(categorys?.find((category: any) => category.urlLink === "search"));
    }

    if (!categorie) {
        return <div><Loader /></div>;
    }

    return (
        <Categories CategoryHeaderContent={categorie} />
    );
};
