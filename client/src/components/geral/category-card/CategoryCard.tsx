import React from "react";
import "./CategoryCard.css"
import { Image } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const CategoryCard: React.FC<{ title: string; redirect: string; photoURL: string }> = ({ title, redirect, photoURL }) => {
    return (
        <div className="category-card-wrapper">
            <div className="category-card-content">
                <Link to={window.location.origin + "/collections/" + redirect}>
                    <div className="category-card-inside">
                        <Image src={photoURL} alt="Categoria" />
                        <span>{title}</span>
                    </div>
                </Link>
            </div>
        </div>
    );
}

export default CategoryCard;
