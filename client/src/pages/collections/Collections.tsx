/**
 * Creation Date: 23/07/2025
 * Author: Vinícius da Silva Santos
 * Coordinator: Larissa Alves de Andrade Moreira
 * Developed by: Lari's Acessórios Team
 * Copyright 2025, LARI'S ACESSÓRIOS
 * All rights are reserved. Reproduction in whole or part is prohibited without the written consent of the copyright owner.
*/

import React, { useEffect, useState } from "react";
import Categories from "../categories/Categories";
import { CategoriesProps } from "../../lib/utils";
import { useParams } from "react-router-dom";
import Footer from "../../components/geral/footer/Footer";
import AdminRepository from "../../repositories/admin";
import { Loader } from "../../components/ui/loader";

const Collections = () => {
    const { collection_name } = useParams();
    const [categorie, setCategorie] = useState<CategoriesProps>()
    const [categoryNull, setCategoryNull] = useState<boolean>(false);

    const adminRepo = new AdminRepository();

    useEffect(() => {
        getCollections()
    }, []);

    async function getCollections() {
        const categorys = await adminRepo.getAllCategoriesData();
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
