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