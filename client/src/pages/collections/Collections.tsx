import React, { useEffect, useState } from "react";
import Categories from "../categories/Categories";
import { CategoriesProps, defaultsCategories } from "../../lib/utils";
import { useParams } from "react-router-dom";
import Footer from "../../components/geral/footer/Footer";
import { adminService } from "../../services/adminService";

const Collections = () => {
    const { collection_name } = useParams();
    const [categorie, setCategorie] = useState<CategoriesProps>()

    useEffect(() => {
        getCollections()
    }, []);

    async function getCollections() {
        const categorys = await adminService.getAllCategoriesData();
        console.log(categorys)
        setCategorie(categorys?.find((category: CategoriesProps) => category.urlLink === collection_name))
    }

    return (
        <React.Fragment>
            <section className="collections-page-content">
                <div className="collections-page-wrapper">
                    {categorie ?
                        <Categories
                            CategoryHeaderContent={categorie}
                        />
                        :
                        <h1>Categoria não encontrada.</h1>
                    }
                </div>
            </section>
            <Footer />
        </React.Fragment>
    );
}

export default Collections;
