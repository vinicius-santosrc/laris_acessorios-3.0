import { HStack } from "@chakra-ui/react";
import { Radio, RadioGroup } from "../../../components/ui/radio";
import "../../../styles/categories.css";
import React, { useState } from "react";
import { Product } from "@/models/product";
import PrincipalProductCard from "../principal-product-card/PrincipalProductCard";
import { PaginationItems, PaginationNextTrigger, PaginationPrevTrigger, PaginationRoot } from "../../../components/ui/pagination";
import { Button } from "../../../components/ui/button";
import { SearchX } from "lucide-react";

const CategoryProducts: React.FC<any> = ({ products }) => {
    const validProducts = Array.isArray(products) ? products : [];
    const pageSize = 20;
    const [currentPage, setCurrentPage] = useState(1);

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentProducts = validProducts.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <section className="category-products-content">
            <div className="category-products-wrapper">
                <div className="category-products__header">
                    <div className="category-left-products">
                        <p>{validProducts.length} modelos</p>
                    </div>
                    <div className="category-right-products">
                        <RadioGroup defaultValue="1">
                            <HStack gap="6">
                                <Radio value="1">Feed</Radio>
                            </HStack>
                        </RadioGroup>
                    </div>
                </div>
                <div className="category-products__body">
                    <div className="category-products__content">
                        {currentProducts.map((product: Product) => (
                            <PrincipalProductCard product={product} key={product.id} />
                        ))}
                        {currentProducts.length < 1 &&
                            <section className="no-products">
                                <SearchX className="search-btn" />
                                <h1>NÃO FOI ENCONTRADO NENHUM PRODUTO REGISTRADO.</h1>
                                <p>Por favor, tente outros parametros de busca ou tente novamente mais tarde.</p>
                                <Button className="btnNoProducts" onClick={() => window.location.reload()}>Recarregar</Button>
                            </section>
                        }
                    </div>
                </div>
                <div className="category-products__bottom">
                    <PaginationRoot
                        count={validProducts.length}
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
