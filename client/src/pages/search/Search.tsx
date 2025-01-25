import { useEffect, useState } from "react";
import { CategoriesProps, defaultsCategories } from "../../lib/utils";
import Categories from "../categories/Categories";
import "./Search.css";
import { adminService } from "../../services/adminService";
import { Loader } from "../../components/ui/loader";

export const SearchPage = () => {
    const [categorie, setCategorie] = useState<CategoriesProps | null>(null); // Initialize with null

    useEffect(() => {
        getCollections();
    }, []);

    async function getCollections() {
        const categorys = await adminService.getAllCategoriesData();
        setCategorie(categorys?.find((category: any) => category.urlLink === "search"));
    }

    if (!categorie) {
        return <div><Loader /></div>; // Show loading state until categorie is fetched
    }

    return (
        <Categories CategoryHeaderContent={categorie} />
    );
};
