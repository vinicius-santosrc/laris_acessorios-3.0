import { HStack } from "@chakra-ui/react";
import { Radio, RadioGroup } from "../../../components/ui/radio";
import "../../../styles/categories.css";
import React from "react";
import { Product } from "@/models/product";
import PrincipalProductCard from "../principal-product-card/PrincipalProductCard";

const CategoryProducts: React.FC<any> = ({ products }) => {
    const validProducts = Array.isArray(products) ? products : [];

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
                        {validProducts.map((product: Product) => {
                            return (
                                <PrincipalProductCard
                                    product={product}
                                    key={product.id}
                                />
                            );
                        })}
                    </div>
                </div>
                <div className="category-products__bottom"></div>
            </div>
        </section>
    );
};

export default CategoryProducts;
