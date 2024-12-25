import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import productService from "../../services/productService";
import { Product } from "../../models/product";

const ProductPage = () => {
    const { product_url } = useParams<string>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
                setLoading(false);
            } catch (err) {
                setError("Produto não encontrado ou erro na requisição");
                setLoading(false);
            }
        };

        fetchProduct();
    }, [product_url]);

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
        <>
            <h1>{product.name_product}</h1>
            <p>{product.categoria}</p>
        </>
    );
};

export default ProductPage;
