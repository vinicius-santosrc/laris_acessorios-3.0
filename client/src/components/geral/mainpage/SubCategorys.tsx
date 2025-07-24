/**
 * Creation Date: 23/07/2025
 * Author: Vinícius da Silva Santos
 * Coordinator: Larissa Alves de Andrade Moreira
 * Developed by: Lari's Acessórios Team
 * Copyright 2025, LARI'S ACESSÓRIOS
 * All rights are reserved. Reproduction in whole or part is prohibited without the written consent of the copyright owner.
*/

import { Link } from "react-router-dom";
import SubCategoryCard from "../subcategory-card/SubcategoryCard";
import "./SubCategory.css";
import { useEffect, useState } from "react";
import { Loader } from "../../../components/ui/loader";
import AdminRepository from "../../../repositories/admin";
import { FacilitysRepository } from "../../../repositories/facilitys";
import { useFacility } from "../../../contexts/FacilityContext";

interface SubCategoryProps {
    title: string;
    photoURL: string;
    redirect: string;
}

const SubCategories = () => {
    const [lastCategory, setLastCategory] = useState<any>();
    const [subCategoryImages, setSubCategoryImages] = useState<{ [key: string]: string }>({});
    const { facility } = useFacility();

    const adminRepo = new AdminRepository();
    const facilityRepo = new FacilitysRepository();

    useEffect(() => {
        getLastCategories();
        subCategories.forEach((item) => {
            getSubCategoryImage(item.photoURL);
        });
    }, [facility]);

    const getLastCategories = async () => {
        try {
            const categories: any[] = await adminRepo.getAllCategoriesData();
            if (categories.length > 0) {
                setLastCategory(categories[categories.length - 1]);
            }
        } catch (error: any) {
            throw error;
        }
    };

    const getSubCategoryImage = async (photoURL: string) => {
        if (facility) {
            try {
                const response = facilityRepo.getByRef(photoURL, facility);
                setSubCategoryImages((prev) => ({
                    ...prev,
                    [photoURL]: response.data,
                }));
            } catch (error: any) {
                throw error;
            }
        }
    };

    const subCategories: SubCategoryProps[] = [
        {
            title: "Presentes para ela",
            redirect: "/para-ela",
            photoURL: "presentes-para-ela-minibanner",
        },
        {
            title: "Lançamentos",
            redirect: "/lancamentos",
            photoURL: "lancamentos-minibanner",
        },
        {
            title: "Banhado a ouro",
            redirect: "/banhados-a-ouro",
            photoURL: "banhados-a-ouro-minibanner",
        },
        {
            title: "Pratas Brilhantes",
            redirect: "/pratas",
            photoURL: "pratas-brilhantes-minibanner",
        },
    ];

    return (
        <section className="subcategorys-section-wrapper">
            <div className="subcategory-section-content">
                {lastCategory ? (
                    subCategories.map((item) => (
                        <Link key={item.title} to={`${window.location.origin}/collections${item.redirect}`}>
                            <SubCategoryCard title={item.title} photoURL={subCategoryImages[item.photoURL] || item.photoURL} />
                        </Link>
                    ))
                ) : (
                    <Loader />
                )}
            </div>
        </section>
    );
};

export default SubCategories;
