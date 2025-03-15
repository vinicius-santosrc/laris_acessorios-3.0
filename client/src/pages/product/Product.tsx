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
import { CloseIcon } from "../../components/icons/icons";

const ProductPage = () => {
    const { product_url } = useParams<string>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sizeSelected, setTamanho] = useState<any>("");
    const [sizesAvaliable, setSizes] = useState<any>(null);
    const [photosAvaliable, setPhotos] = useState<string[]>([]);

    const [isPhotoShowing, setPhotoShowing] = useState<boolean>(false);
    const [photoShowingContent, setPhotoShowingContent] = useState<string>("");

    useEffect(() => {
        if (!product_url) {
            setError("Produto não encontrado.");
            setLoading(false);
            return;
        }

        const fetchProduct = async () => {
            try {
                const fetchedProduct: Product = await productService.getByURL(product_url);
                setProduct(fetchedProduct);
                setSizes(JSON.parse(fetchedProduct.tamanhos))
                setPhotos(JSON.parse(fetchedProduct.photoURL));
                setLoading(false);

                document.title = `${fetchedProduct.name_product} - LARIS ACESSÓRIOS`
            } catch (err: any) {
                setError(err.toString());
                setLoading(false);
            }
        };

        fetchProduct();
    }, [product_url]);

    function addToCart() {
        if (product && sizeSelected) {
            cartService.add(product, sizeSelected);
        }
    }

    function setPhotoSelected(photo: string) {
        setPhotoShowing(true);
        setPhotoShowingContent(photo)
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
            {isPhotoShowing &&
                <React.Fragment>
                    <section className="photoFullScreenBackground"></section>
                    <section className="photoFullScreen">
                        <div className="btn-close">
                            <button onClick={() => setPhotoShowing(false)}><CloseIcon /></button>
                        </div>
                        <div className="photoContent">
                            <img src={photoShowingContent} alt="photoFullScreen" />
                        </div>
                    </section>
                </React.Fragment>
            }
            <section className="product-page-content">
                <div className="product-page-wrapper">
                    <div className="product-page-inside">
                        <div className="product-page-photos photos-desktop">
                            {photosAvaliable.length > 1 ?
                                <div className="product-principal-pics">
                                    {photosAvaliable.map((photo: string) => {
                                        return (
                                            <div onClick={() => setPhotoSelected(photo)} className="product-pics" key={photo}>
                                                <img src={photo} alt={product.name_product} />
                                            </div>
                                        )
                                    })}
                                </div>
                                :
                                <div onClick={() => setPhotoSelected(photosAvaliable[0])} className="product-one-pic">
                                    <img id="uniquephoto" src={photosAvaliable[0]} alt={product.name_product} />
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
                                            <div onClick={() => setPhotoSelected(photo)} className="product-pics" key={photo}>
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
                                {product.desconto > 0 ?
                                    <p id="bold"><s style={{fontWeight: 400}}>R$ {product.price.toFixed(2)}</s> R$ {(product.price - product.desconto).toFixed(2)}</p>
                                    :
                                    <p id="bold">R$ {product.price.toFixed(2)}</p>}
                                <p>Compre pelo cartão de crédito</p>
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
                                <p>{product.description }</p>
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
                component={<RelatedProducts category={JSON.parse(product.categoryList)} />}
            />
            <Footer />
        </React.Fragment>
    );
};

export default ProductPage;
