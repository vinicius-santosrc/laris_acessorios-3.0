/**
 * Creation Date: 23/07/2025
 * Author: Vinícius da Silva Santos
 * Coordinator: Larissa Alves de Andrade Moreira
 * Developed by: Lari's Acessórios Team
 * Copyright 2025, LARI'S ACESSÓRIOS
 * All rights are reserved. Reproduction in whole or part is prohibited without the written consent of the copyright owner.
*/

import { Image } from "@chakra-ui/react";
import { ArrowRight } from "../../icons/icons";
import { Button } from "../../ui/button";
import "./SubcategoryCard.css";
import React from "react";
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
