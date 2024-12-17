import { Image } from "@chakra-ui/react";
import { ArrowRight } from "../../icons/icons";
import { Button } from "../../ui/button";
import "./SubcategoryCard.css";
import React from "react";

// Destructure props properly
interface SubCategoryCardProps {
    title: string;
    photoURL: string;
}

const SubCategoryCard: React.FC<SubCategoryCardProps> = ({ title, photoURL }) => {
    return (
        <div className="subcategory-card-wrapper">
            <div className="subcategory-content-card">
                <article className="subcategory-card">
                    <div className="subcategory-top-card">
                        <Image src={photoURL} alt={title} />
                    </div>
                    <div className="subcategory-middle-card">
                        <span>{title}</span>
                    </div>
                    <div className="subcategory-bottom-card">
                        <Button className="subcategory-actionbtn">
                            Compre agora <ArrowRight />
                        </Button>
                    </div>
                </article>
            </div>
        </div>
    );
};

export default SubCategoryCard;
