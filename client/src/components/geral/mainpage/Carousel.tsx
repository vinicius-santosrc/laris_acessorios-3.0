import { Button, Image } from "@chakra-ui/react";
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
            <div className="carrousel-text">
                <h1>COLAR FITA LAMINADA</h1>
                <p>Sofisticada e delicada, com design elegante e acabamento banhado a ouro.</p>
                <Button onClick={() => window.location.href = window.location.origin + "/product/colar-fita-laminada"}>VER MAIS</Button>
            </div>
        </section>
    )
}

export default Carousel;    