import "./Main.css"
import React, { useEffect, useState } from "react"
import SubCategorys from "../../../components/geral/mainpage/SubCategorys"
import Carousel from "../../../components/geral/mainpage/Carousel"
import SectionComponent from "../../../components/geral/mainpage/SectionComponent"
import CategoryList from "../../../components/geral/category-list/CategoryList"
import Footer from "../../../components/geral/footer/Footer"
import ProductsMainPage from "../../../components/geral/mainpage/ProductsMainPage"

const Home = () => {
    const [isMobile, setIsMobile] = useState(false);

    const checkMobileView = () => {
        if (window.innerWidth <= 768) {
            setIsMobile(true);
        } else {
            setIsMobile(false);
        }
    };

    useEffect(() => {
        checkMobileView();
        window.addEventListener("resize", checkMobileView);

        return () => {
            window.removeEventListener("resize", checkMobileView);
        };
    }, []);
    
    return (
        <React.Fragment>
            <Carousel
                url={isMobile ? "https://uploaddeimagens.com.br/images/004/878/193/full/WhatsApp_Image_2024-12-26_at_11.01.30.jpeg?1735260472" : "https://uploaddeimagens.com.br/images/004/878/192/full/WhatsApp_Image_2024-12-26_at_10.49.53.jpeg?1735260341"}
            />
            <SubCategorys />
            <SectionComponent
                title="Compre por categoria"
                description="Explore nossas categorias e encontre a joia que reflete sua essência. Cada peça é única e carrega consigo uma história especial. Descubra a sua!"
                hasDescription={true}
                component={<CategoryList />} />
            <SectionComponent
                title="Torne sua WishList realidade"
                description='"Encontre as peças dos seus sonhos aqui"'
                hasDescription={true}
                component={<ProductsMainPage />} />
            <Footer />
        </React.Fragment>
    )
}

export default Home