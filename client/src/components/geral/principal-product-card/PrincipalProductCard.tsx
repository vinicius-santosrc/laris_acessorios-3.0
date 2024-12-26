import { useState } from "react";
import "./PrincipalProductCard.css";
import { Link } from "react-router-dom";
import { Image } from "@chakra-ui/react";
import { FavoritesIcon } from "../../../components/icons/icons";
import { Product } from "@/models/product";

const PrincipalProductCard = ({ product }: { product: Product }) => {
    const [isHover, setHover] = useState<boolean>(false);

    if (!product) {
        return null;
    }

    const Images = JSON.parse(product.photoURL);

    return (
        <div className="product-card-wrapper">
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
                                <span className="product-price">R$ {product.price.toFixed(2)}</span>
                            </div>
                        </footer>
                    </article>
                </Link>
            </section>
        </div>
    );
};

export default PrincipalProductCard;
