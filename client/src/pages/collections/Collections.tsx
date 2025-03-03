import React, { useEffect, useState } from "react";
import Categories from "../categories/Categories";
import { CategoriesProps } from "../../lib/utils";
import { useParams } from "react-router-dom";
import Footer from "../../components/geral/footer/Footer";
import { adminService } from "../../services/adminService";
import { Loader } from "../../components/ui/loader";

const Collections = () => {
    const { collection_name } = useParams();
    const [categorie, setCategorie] = useState<CategoriesProps>()
    const [categoryNull, setCategoryNull] = useState<boolean>(false);

    useEffect(() => {
        getCollections()
    }, []);

    async function getCollections() {
        const categorys = await adminService.getAllCategoriesData();
        const foundCategory = categorys?.find((category: CategoriesProps) => category.urlLink === collection_name);
        setCategorie(foundCategory);

        if (!foundCategory) {
            setCategoryNull(true);
        }
    }

    let content;

    if (categorie) {
        content = <Categories CategoryHeaderContent={categorie} />;
    } else if (categoryNull) {
        window.location.href = window.location.origin + "/404";
        content = null;
    } else {
        content = <Loader />;
    }

    return (
        <React.Fragment>
            <section className="collections-page-content">
                <div className="collections-page-wrapper">
                    {content}
                </div>
            </section>
            <Footer />
        </React.Fragment>
    );
}

export default Collections;
