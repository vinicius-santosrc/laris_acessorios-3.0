import { CategoryProps, Categorys } from "../../../lib/utils";
import CategoryCard from "../category-card/CategoryCard";
import "../category-list/CategoryList.css"
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';

import { Pagination } from 'swiper/modules';
import React, { useEffect, useState } from "react";
import { Product } from "../../../models/product";
import productService from "../../../services/productService";
import PrincipalProductCard from "../principal-product-card/PrincipalProductCard";

const RelatedProducts = ({ category }: any) => {
    const [allProducts, setProducts] = useState<Product[]>([])

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const fetchedProducts: Product[] = await productService.getByRelatedCategory(category);
                setProducts(fetchedProducts);
            } catch (err: any) {
                console.error(err)
            }
        };

        fetchProduct();
    }, []);

    return (
        <React.Fragment>
            <section className="desktop-products-show">
                <div className="desktop-products-show_inside">
                    <Swiper
                        slidesPerView={4}
                        spaceBetween={10}
                        pagination={{
                            clickable: true,
                        }}
                        modules={[Pagination]}
                        className="mySwiper"
                    >
                        {allProducts.map((product, id) => (
                            <SwiperSlide key={id}>
                                <PrincipalProductCard product={product} key={product.id} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </section>
            <section className="mobile-products-show">
                <div className="mobile-products-show_inside">
                    <Swiper
                        slidesPerView={2}
                        spaceBetween={10}
                        pagination={{
                            clickable: true,
                        }}
                        modules={[Pagination]}
                        className="mySwiper"
                    >
                        {allProducts.map((product, id) => (
                            <SwiperSlide key={id}>
                                <PrincipalProductCard product={product} key={product.id} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </section>
        </React.Fragment>
    )
}

export default RelatedProducts;