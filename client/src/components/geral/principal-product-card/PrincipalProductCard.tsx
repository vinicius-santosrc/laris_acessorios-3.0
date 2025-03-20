import { useEffect, useState } from "react";
import "./PrincipalProductCard.css";
import { Link } from "react-router-dom";
import { Image } from "@chakra-ui/react";
import { FavoritesIcon } from "../../../components/icons/icons";
import { Product } from "@/models/product";
import { cartService } from "../../../services/cartService";

const PrincipalProductCard = ({ product }: { product: Product }) => {
    const [isHover, setHover] = useState<boolean>(false);
    const [productMouseIn, setProductMouseIn] = useState<boolean>(false);
    const [isBuying, setIsBuying] = useState<boolean>(false);
    const [tamanhoSelected, setTamanhoSelect] = useState<any>();
    const tamanhos = product.tamanhos ? JSON.parse(product.tamanhos) : [];
    const Images = product.photoURL ? JSON.parse(product.photoURL) : [];


    useEffect(() => {
        if (tamanhos && tamanhos.length > 0) {
            setTamanhoSelect(tamanhos[0]);
        }
    }, [tamanhos]);
    if (!product) {
        return null;
    }

    return (
        <div className="product-card-wrapper" style={productMouseIn ? { border: "1px solid lightgray" } : { border: "1px solid white" }} onMouseEnter={() => setProductMouseIn(true)} onMouseLeave={() => setProductMouseIn(false)}>
            <section className="product-card">
                <Link to={window.location.origin + "/product/" + product.url} className="product-link">
                    <article className="product-card-article">
                        <header className="product-card-header">
                            <div className="favorite-button-container">
                                <button className="favorite-product-button"><FavoritesIcon /></button>
                            </div>
                            <div className="product-image-container">
                                <Image
                                    src={Images.length > 1 ? isHover ? Images[1] : Images[0] : Images}
                                    alt={product.name_product}
                                    loading="eager"
                                    className="product-image vtex-product-summary-2-x-imageNormal vtex-product-summary-2-x-image vtex-product-summary-2-x-mainImageHovered"

                                />
                            </div>
                        </header>

                        <footer className="product-card-footer">
                            <div className="product-title-container">
                                <span className="product-title">{product.name_product.toUpperCase()}</span>
                            </div>
                            <div className="product-subtitle-container">
                                <li className="product-subtitle">{product.type_full_label}</li>
                            </div>
                            <div className="product-price-container">
                                {product.desconto > 0 ?
                                    <span className="product-price"><s>R$ {product.price.toFixed(2)}</s> R$ {(product.price - product.desconto).toFixed(2)}</span>
                                    :
                                    <span className="product-price">R$ {product.price.toFixed(2)}</span>
                                }
                            </div>
                            <div className="btnSection" onClick={(e) => e.preventDefault()}>
                                {isBuying ? (
                                    <>
                                        <select
                                            title="TAMANHO"
                                            value={tamanhoSelected || tamanhos?.[0] || ""}
                                            onChange={(e) => setTamanhoSelect(e.target.value)}
                                        >
                                            {tamanhos?.map((item: string, index: number) => {
                                                return (
                                                    <option key={index} value={item}>
                                                        {item}
                                                    </option>
                                                )
                                            })}
                                        </select>
                                        <button onClick={() => tamanhoSelected != "" && cartService.add(product, tamanhoSelected)}>
                                            ADICIONAR A SACOLA
                                        </button>
                                    </>
                                ) : (
                                    <>
                                            {product?.disponibilidade != 0 ? <button
                                                onClick={() => setIsBuying(true)}
                                                style={{ display: productMouseIn ? "block" : "none" }}
                                            >
                                                COMPRAR
                                            </button>
                                                :
                                                <button
                                                    disabled={true}
                                                    style={{ display: productMouseIn ? "block" : "none" }}
                                                >
                                                    INDISPONÍVEL
                                                </button>
                                            }
                                    </>

                                )}
                            </div>

                        </footer>
                    </article>
                </Link>
            </section>
        </div>
    );
};

export default PrincipalProductCard;
