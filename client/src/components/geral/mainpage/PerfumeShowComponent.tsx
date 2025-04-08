import React, { useEffect, useState } from "react"
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import productService from "../../../services/productService";
import { Product } from "@/models/product";
import PrincipalProductCard from "../principal-product-card/PrincipalProductCard";
import "../../../styles/categories.css";

const PerfumeShowComponent = () => {
    const [allProducts, setProducts] = useState<Product[]>([])

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const fetchedProducts: Product[] = await productService.getAll();
                const filteredProducts: any = fetchedProducts.filter((item: Product) => item.type == "perfume");
                setProducts(filteredProducts);
            } catch (err: any) {
                throw Error(err)
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

export default PerfumeShowComponent;