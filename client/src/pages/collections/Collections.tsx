import React from "react";
import Categories from "../categories/Categories";
import { defaultsCategories } from "../../lib/utils";
import { useParams } from "react-router-dom";
import Footer from "../../components/geral/footer/Footer";

const Collections = () => {
    const { collection_name } = useParams();
    const categorie = defaultsCategories.find((category) => category.urlLink === collection_name);

    return (
        <React.Fragment>
            <section className="collections-page-content">
                <div className="collections-page-wrapper">
                    <Categories
                        CategoryHeaderContent={categorie}
                    />
                </div>
            </section>
            <Footer />
        </React.Fragment>
    );
}

export default Collections;
