import { Image } from "@chakra-ui/react";
import React from "react";

interface CarouselProps {
    url: string
}

const Carousel: React.FC<CarouselProps> = ({ url }) => {
    return (
        <section className="carrousel carousel-wrapper">
            <div className="carrousel-item">
                <Image src={url} alt="Banner" />
            </div>
        </section>
    )
}

export default Carousel;    