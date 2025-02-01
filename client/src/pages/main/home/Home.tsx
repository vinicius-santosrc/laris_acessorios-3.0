import "./Main.css"
import React, { useEffect, useState } from "react"
import SubCategorys from "../../../components/geral/mainpage/SubCategorys"
import Carousel from "../../../components/geral/mainpage/Carousel"
import SectionComponent from "../../../components/geral/mainpage/SectionComponent"
import CategoryList from "../../../components/geral/category-list/CategoryList"
import Footer from "../../../components/geral/footer/Footer"
import ProductsMainPage from "../../../components/geral/mainpage/ProductsMainPage"
import ShowCaseCollection from "../../../components/geral/mainpage/ShowCaseCollection"

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
                url={isMobile ? "https://i.ibb.co/10XNSy5/Whats-App-Image-2024-12-26-at-11-01-30.jpg" : "https://i.ibb.co/VqYVzsr/Whats-App-Image-2024-12-26-at-10-49-53.jpg"}
            />
            <SubCategorys />
            <SectionComponent
                title="Compre por categoria"
                description="Explore nossas categorias e encontre a joia que reflete sua essência. Cada peça é única e carrega consigo uma história especial. Descubra a sua!"
                hasDescription={true}
                component={<CategoryList />} />
            {/*
            <ShowCaseCollection
                items={[
                    {
                        url: "https://cartier.vteximg.com.br/arquivos/banneresquerdahome.jpg?v=638714397670800000",
                        redirect: "/redirect1",
                        title: "Título 1",
                        description: "Descrição 1",
                    },
                    {
                        url: "https://pandorajoias.vtexassets.com/assets/vtex.file-manager-graphql/images/187a102f-c3a3-472f-ace3-71efc3ad91c3___4d78bf766f80c77e48bee99b655f4474.jpg",
                        redirect: "/redirect2",
                        title: "Título 2",
                        description: "Descrição 2",
                    },
                ]}
                type="Grid"
            />
            */}
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