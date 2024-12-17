import React from "react";
import "./PrincipalProductCard.css";
import { Link } from "react-router-dom";
import { Button } from "../../ui/button";
import { Image } from "@chakra-ui/react";

const PrincipalProductCard: React.FC<any> = ({ product }) => {
    return (
        <div className="product-card-wrapper">
            <section className="product-card">
                <Link to={product.url} className="product-link">
                    <article className="product-card-article">
                        <header className="product-card-header">
                            <div className="product-image-container">
                                <Image
                                    src={product.imageUrl || ""}
                                    alt={product.description}
                                    loading="eager"
                                    className="product-image vtex-product-summary-2-x-imageNormal vtex-product-summary-2-x-image vtex-product-summary-2-x-mainImageHovered"
                                />
                                <div className="favorite-button-container">
                                    <button className="favorite-product-button">favorite product</button>
                                </div>
                            </div>
                        </header>

                        <footer className="product-card-footer">
                            <div className="product-title-container">
                                <span className="product-title">{product.title}</span>
                            </div>
                            <div className="product-price-container">
                                <span className="product-price">{product.price}</span>
                            </div>
                            <div className="product-button-container">
                                <Button className="buy-now-button">Compre agora</Button>
                            </div>
                        </footer>
                    </article>
                </Link>
            </section>
        </div>
    );
};

export default PrincipalProductCard;
