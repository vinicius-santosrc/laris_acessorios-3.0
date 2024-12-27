import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import productService from "../../services/productService";
import { Product } from "../../models/product";
import { BreadcrumbRoot, BreadcrumbLink, BreadcrumbCurrentLink } from "../../components/ui/breadcrumb";
import "../../styles/product.css"
import Footer from "../../components/geral/footer/Footer";
import RelatedProducts from "../../components/geral/product/RelatedProducts";
import SectionComponent from "../../components/geral/mainpage/SectionComponent";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';

import { Pagination } from 'swiper/modules';
import { cartService } from "../../services/cartService";

const ProductPage = () => {
    const { product_url } = useParams<string>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sizeSelected, setTamanho] = useState<any>("");
    const [sizesAvaliable, setSizes] = useState<any>(null);
    const [photosAvaliable, setPhotos] = useState<string[]>([]);
    const [countErr, setCountErrs] = useState<number>(0);

    useEffect(() => {
        if (!product_url) {
            setError("Produto não encontrado.");
            setLoading(false);
            return;
        }

        const fetchProduct = async () => {
            try {
                const fetchedProduct = await productService.getByURL(product_url);
                setProduct(fetchedProduct);
                setSizes(JSON.parse(fetchedProduct.tamanhos))
                setPhotos(JSON.parse(fetchedProduct.photoURL));
                setLoading(false);
                console.log(countErr)
            } catch (err: any) {
                setError(err.toString());
                if (countErr < 4) {
                    fetchProduct(); 
                }
                setCountErrs(countErr + 1);
                setLoading(false);
            }
        };

        fetchProduct();
    }, [product_url]);

    function addToCart() {
        if (product && sizeSelected) {
            cartService.add(product);
        }
    }

    if (loading) {
        return <div>Carregando...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!product) {
        return <div>Produto não encontrado.</div>;
    }

    return (
        <React.Fragment>
            <section className="product-page-content">
                <div className="product-page-wrapper">
                    <div className="product-page-inside">
                        <div className="product-page-photos photos-desktop">
                            {photosAvaliable.length > 1 ?
                                <div className="product-principal-pics">
                                    {photosAvaliable.map((photo: string) => {
                                        return (
                                            <div className="product-pics" key={photo}>
                                                <img src={photo} alt={product.name_product} />
                                            </div>
                                        )
                                    })}
                                </div>
                                :
                                <div className="product-one-pic">
                                    <img src={photosAvaliable[0]} alt={product.name_product} />
                                </div>
                            }
                        </div>
                        <div className="photos-mobile">
                            <Swiper
                                slidesPerView={1}
                                spaceBetween={10}
                                pagination={{
                                    clickable: true,
                                }}
                                modules={[Pagination]}
                                className="mySwiper"
                            >
                                {photosAvaliable.map((photo: string, id: number) => {
                                    return (
                                        <SwiperSlide key={id}>
                                            <div className="product-pics" key={photo}>
                                                <img src={photo} alt={product.name_product} />
                                            </div>
                                        </SwiperSlide>
                                    )
                                })}
                            </Swiper>
                        </div>
                        <div className="product-page-about">
                            <div className="route-product">
                                <BreadcrumbRoot>
                                    <BreadcrumbLink href={window.location.origin}>Home</BreadcrumbLink>
                                    <BreadcrumbLink href={window.location.origin + "/collections/" + product.tipo.toLowerCase()}>{product.tipo}</BreadcrumbLink>
                                    <BreadcrumbCurrentLink style={{ color: "black" }}>{product.name_product}</BreadcrumbCurrentLink>
                                </BreadcrumbRoot>
                            </div>
                            <div className="product-brand">
                                <span>LARIS ACESSÓRIOS</span>
                            </div>
                            <div className="product-name">
                                <span>{product.name_product}</span>
                            </div>
                            <div className="product-price-content">
                                <p id="bold">R$ {product.price.toFixed(2)}</p>
                                <p>Ou em até 2x de R$ {(product.price / 2).toFixed(2)}</p>
                            </div>
                            <div className="product-sizes-content">
                                <p>Tamanhos</p>
                                <div className="product-sizes">
                                    {sizesAvaliable.map((s: any, i: number) => {
                                        return (
                                            <div className="tamanho-option-select" key={i}>
                                                <button onClick={() => setTamanho(s)} className="button-tamanhos-wrapper" id={sizeSelected === s ? "selected" : ""}>
                                                    <span>{s}</span>
                                                </button>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className="product-actions-btn">
                                {product.disponibilidade == true ?
                                    <div className="product-buy-button">
                                        <button onClick={addToCart}>Comprar</button>
                                    </div>
                                    :
                                    <div className="product-buy-button">
                                        <button>Indisponível</button>
                                    </div>
                                }
                                <div className="product-credit-button">
                                    <button>Ver parcelas</button>
                                </div>
                            </div>
                            <div className="product-description-content">
                                <h2>Descrição e Detalhes</h2>
                                <p>Lorem ipsom Lorem ipsom Lorem ipsom Lorem ipsom Lorem ipsom Lorem ipsom Lorem ipsom Lorem ipsom Lorem ipsom Lorem ipsom Lorem ipsom Lorem ipsom Lorem ipsom Lorem ipsom Lorem ipsom.</p>
                                <div className="description-tec">
                                    <li>{product.type_full_label}</li>
                                    <li>Tamanhos: {sizesAvaliable.map((size: string) => { return <>{size} </> })}</li>
                                    <li>Desenhado para ser confortável e fácil de usar</li>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <SectionComponent
                title={"Sugestões para você"}
                description={null}
                hasDescription={false}
                component={<RelatedProducts />}
            />
            <Footer />
        </React.Fragment>
    );
};

export default ProductPage;
