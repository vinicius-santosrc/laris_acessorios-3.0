import React from "react";
import "./CategoryCard.css"
import { Image } from "@chakra-ui/react";

const CategoryCard: React.FC<{ title: string; photoURL: string }> = ({ title, photoURL }) => {
    return (
        <div className="category-card-wrapper">
            <div className="category-card-content">
                <div className="category-card-inside">
                    <Image src={photoURL} alt="Categoria" />
                    <span>{title}</span>
                </div>
            </div>
        </div>
    );
}

export default CategoryCard;
