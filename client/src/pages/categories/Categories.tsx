/**
 * Creation Date: 23/07/2025
 * Author: Vinícius da Silva Santos
 * Coordinator: Larissa Alves de Andrade Moreira
 * Developed by: Lari's Acessórios Team
 * Copyright 2025, LARI'S ACESSÓRIOS
 * All rights are reserved. Reproduction in whole or part is prohibited without the written consent of the copyright owner.
 */

import React, { useEffect, useState } from "react";
import CategoryHeader from "../../components/geral/categories-page/CategoryHeader";
import CategoryFilter from "../../components/geral/categories-page/CategoryFilter";
import CategoryProducts from "../../components/geral/categories-page/CategoryProducts";
import "../../styles/categories.css";
import ProductRepository from "../../repositories/product";
import { useParams } from "react-router-dom";
import { Product } from "@/models/product";
import { whiteListCategories } from "../../lib/utils";

const Categories: React.FC<any> = ({ CategoryHeaderContent }) => {
    const [categorySelected, setCategory] = useState<any>(null);
    const [priceOrder, setPriceOrder] = useState(null);
    const [selectedFilters, setSelectedFilters] = useState<any>({});
    const { search } = useParams();

    const productRepo = new ProductRepository();

    const fetchCategoryData = async () => {
        try {
            const searchedProducts: any = await productRepo.getAll();
            let categoryData;
            if (CategoryHeaderContent.urlLink.includes(whiteListCategories))
                categoryData = await productRepo.getAll();
            else
                categoryData = await productRepo.getByCategory(CategoryHeaderContent.urlLink);

            if (searchedProducts && search && window.location.href.includes("search")) {
                setCategory(searchedProducts.filter((product: Product) => product.name_product.toLowerCase().includes(search?.toLocaleLowerCase())));
            } else {
                setCategory(categoryData);
            }
        } catch (error: any) {
            console.error("Failed to fetch category data:", error);
        }
    };

    useEffect(() => {
        fetchCategoryData();
    }, [CategoryHeaderContent.urlLink]);

    const handlePriceChange = (value: any) => {
        setPriceOrder(value);
    };

    const handleFilterChange = (category: any, option: any) => {
        setSelectedFilters((prevFilters: any) => {
            const newFilters = { ...prevFilters };
            if (!newFilters[category]) {
                newFilters[category] = [];
            }

            if (newFilters[category].includes(option)) {
                newFilters[category] = newFilters[category].filter((item: any) => item !== option);
            } else {
                newFilters[category].push(option);
            }
            return newFilters;
        });
    };

    return (
        <React.Fragment>
            <CategoryHeader
                highlightText={CategoryHeaderContent.highlightText}
                highlightDescription={CategoryHeaderContent.highlightDescription}
                highlightImage={CategoryHeaderContent.highlightImage}
                products={categorySelected ? categorySelected.products : []}
                urlLink={CategoryHeaderContent.urlLink}
            />
            <section className="category-body-content">
                <CategoryFilter
                    onPriceChange={handlePriceChange}
                    onFilterChange={handleFilterChange}
                    selectedFilters={selectedFilters}
                />
                <CategoryProducts
                    products={categorySelected ? categorySelected : []}
                    priceOrder={priceOrder}
                    selectedFilters={selectedFilters}
                />
            </section>
        </React.Fragment>
    );
};

export default Categories;
