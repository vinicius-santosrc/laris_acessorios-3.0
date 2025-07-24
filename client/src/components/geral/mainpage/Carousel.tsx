/**
 * Creation Date: 23/07/2025
 * Author: Vinícius da Silva Santos
 * Coordinator: Larissa Alves de Andrade Moreira
 * Developed by: Lari's Acessórios Team
 * Copyright 2025, LARI'S ACESSÓRIOS
 * All rights are reserved. Reproduction in whole or part is prohibited without the written consent of the copyright owner.
*/

import { Button, Image } from "@chakra-ui/react";
import React from "react";

interface CarouselProps {
    url: string,
    maintext: string,
    description: string,
    href: string
}

const Carousel: React.FC<CarouselProps> = ({ url, maintext, description, href }) => {
    return (
        <section className="carrousel carousel-wrapper">
            <div className="carrousel-item">
                <Image src={url} alt="Banner" />
            </div>
            <div className="carrousel-text">
                <h1>{maintext}</h1>
                <p>{description}</p>
                <Button onClick={() => window.location.href = window.location.origin + href}>VER MAIS</Button>
            </div>
        </section>
    )
}

export default Carousel;    