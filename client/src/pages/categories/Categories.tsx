import React, { useEffect, useState } from "react";
import CategoryHeader from "../../components/geral/categories-page/CategoryHeader";
import CategoryFilter from "../../components/geral/categories-page/CategoryFilter";
import CategoryProducts from "../../components/geral/categories-page/CategoryProducts";
import "../../styles/categories.css";
import productService from "../../services/productService";

const Categories: React.FC<any> = ({ CategoryHeaderContent }) => {
    const [categorySelected, setCategory] = useState<any>(null);

    useEffect(() => {
        const fetchCategoryData = async () => {
            try {
                const categoryData = await productService.getByCategory(CategoryHeaderContent.urlLink);
                setCategory(categoryData);
            } catch (error) {
                console.error("Failed to fetch category data:", error);
            }
        };

        fetchCategoryData();
    }, [CategoryHeaderContent.urlLink]);

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
                <CategoryFilter />
                <CategoryProducts
                    products={categorySelected ? categorySelected : []}
                />
            </section>
        </React.Fragment>
    );
};

export default Categories;
