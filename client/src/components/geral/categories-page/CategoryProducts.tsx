import { HStack } from "@chakra-ui/react";
import { Radio, RadioGroup } from "../../../components/ui/radio";
import "../../../styles/categories.css";
import React, { useState, useEffect } from "react";
import { Product } from "@/models/product";
import PrincipalProductCard from "../principal-product-card/PrincipalProductCard";
import { PaginationItems, PaginationNextTrigger, PaginationPrevTrigger, PaginationRoot } from "../../../components/ui/pagination";
import { Button } from "../../../components/ui/button";
import { SearchX } from "lucide-react";

const CategoryProducts: React.FC<any> = ({ products, priceOrder, selectedFilters }) => {
    const validProducts = Array.isArray(products) ? products : [];
    const pageSize = 20;
    const [currentPage, setCurrentPage] = useState(1);
    const [sortedProducts, setSortedProducts] = useState<Product[]>(validProducts);

    const [view, setView] = useState<any>(1);

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const filteredProducts = sortedProducts.filter((product: Product) => {
        let matchesMaterial = true;
        if (selectedFilters.Material?.length > 0) {
            const productCategoryList = JSON.parse(product.categoryList || '[]');
            matchesMaterial = selectedFilters.Material.some((material: any) =>
                productCategoryList.includes(material.value)
            );
        }
        return matchesMaterial;
    });

    useEffect(() => {
        const sorted = [...validProducts];

        // Separar produtos com e sem disponibilidade
        const availableProducts = sorted.filter(product => product.disponibilidade !== 0);
        const unavailableProducts = sorted.filter(product => product.disponibilidade === 0);

        // Ordenar produtos disponíveis por preço
        if (priceOrder === "1") {
            availableProducts.sort((a: Product, b: Product) => b.price - a.price);
            unavailableProducts.sort((a: Product, b: Product) => b.price - a.price);
        } else if (priceOrder === "2") {
            availableProducts.sort((a: Product, b: Product) => a.price - b.price);
            unavailableProducts.sort((a: Product, b: Product) => a.price - b.price);
        }

        // Concatenar produtos disponíveis e indisponíveis
        setSortedProducts([...availableProducts, ...unavailableProducts]);
    }, [priceOrder, validProducts]);

    const currentPageProducts = filteredProducts.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= Math.ceil(filteredProducts.length / pageSize)) {
            setCurrentPage(page);
        }
    };

    return (
        <section className="category-products-content">
            <div className="category-products-wrapper">
                <div className="category-products__header">
                    <div className="category-left-products">
                        <p>{filteredProducts.length} modelos</p>
                    </div>
                    <div className="category-right-products">
                        <RadioGroup onChange={(e) => setView(e.target.defaultValue)} display={"flex"} gap={4} defaultValue="1">
                            <HStack gap="6">
                                <Radio value="1">Feed</Radio>
                            </HStack>
                            <HStack gap="6">
                            <Radio value="2">Grid</Radio>
                        </HStack>
                        </RadioGroup>
                    </div>
                </div>
                <div className="category-products__body">
                    <div className="category-products__content">
                        {currentPageProducts.map((product: Product) => (
                            <PrincipalProductCard view={view} product={product} key={product.id} />
                        ))}
                        {currentPageProducts.length < 1 && (
                            <section className="no-products">
                                <SearchX className="search-btn" />
                                <h1>NÃO FOI ENCONTRADO NENHUM PRODUTO REGISTRADO.</h1>
                                <p>Por favor, tente outros parametros de busca ou tente novamente mais tarde.</p>
                                <Button className="btnNoProducts" onClick={() => window.location.reload()}>Recarregar</Button>
                            </section>
                        )}
                    </div>
                </div>
                <div className="category-products__bottom">
                    <PaginationRoot
                        count={filteredProducts.length}
                        pageSize={pageSize}
                        defaultPage={currentPage}
                        onPageChange={(e) => setCurrentPage(e.page)}
                    >
                        <HStack>
                            <PaginationPrevTrigger onClick={() => handlePageChange(currentPage - 1)} />
                            <PaginationItems />
                            <PaginationNextTrigger onClick={() => handlePageChange(currentPage + 1)} />
                        </HStack>
                    </PaginationRoot>
                </div>
            </div>
        </section>
    );
};

export default CategoryProducts;