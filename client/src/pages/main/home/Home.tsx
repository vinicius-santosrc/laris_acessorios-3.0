import "./Main.css";
import React, { useEffect, useState } from "react";
import SubCategorys from "../../../components/geral/mainpage/SubCategorys";
import Carousel from "../../../components/geral/mainpage/Carousel";
import SectionComponent from "../../../components/geral/mainpage/SectionComponent";
import CategoryList from "../../../components/geral/category-list/CategoryList";
import ProductsMainPage from "../../../components/geral/mainpage/ProductsMainPage";
import ShowCaseCollection from "../../../components/geral/mainpage/ShowCaseCollection";
import { Facilitys } from "../../../services/facilitysService";
import PerfumeShowComponent from "../../../components/geral/mainpage/PerfumeShowComponent";
import Footer from "../../../components/geral/footer/Footer";

const Home = () => {
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [allFacilitys, setAllFacilitys] = useState<any>();

    const checkMobileView = () => {
        if (window.innerWidth <= 768) {
            setIsMobile(true);
        } else {
            setIsMobile(false);
        }
    };

    useEffect(() => {
        checkMobileView();
        getFacilitys();
        window.addEventListener("resize", checkMobileView);

        document.title = `LARIS ACESSÓRIOS - Acessórios baratos, Entrega Rápida`;
        return () => {
            window.removeEventListener("resize", checkMobileView);
        };

    }, []);

    const getFacilitys = async () => {
        try {
            const response = await Facilitys.getFacilityByPage("home");
            setAllFacilitys(response);
        }
        catch (error: any) {
            throw Error(error);
        }
    }

    return (
        <React.Fragment>
            {allFacilitys ?
                <>
                    <Carousel
                        url={isMobile ? allFacilitys["banner-principal"].dataMobile : allFacilitys["banner-principal"].data}
                        maintext={JSON.parse(allFacilitys["banner-principal-texts"].data)?.mainText}
                        description={JSON.parse(allFacilitys["banner-principal-texts"].data)?.description}
                        href={JSON.parse(allFacilitys["banner-principal-texts"].data)?.href}
                    />
                    {JSON.parse(allFacilitys["banner-secondary-texts"].data)?.hidden !== "true" &&
                        <Carousel
                            url={isMobile ? allFacilitys["banner-secondary"].dataMobile : allFacilitys["banner-secondary"].data}
                            maintext={JSON.parse(allFacilitys["banner-secondary-texts"].data)?.mainText}
                            description={JSON.parse(allFacilitys["banner-secondary-texts"].data)?.description}
                            href={JSON.parse(allFacilitys["banner-secondary-texts"].data)?.href}
                        />
                    }
                </>
                :
                <Carousel url={""} maintext={""} description={""} href={""} />
            }
            <SubCategorys />
            <SectionComponent
                title="Compre por categoria"
                description="Explore nossas categorias e encontre a joia que reflete sua essência. Cada peça é única e carrega consigo uma história especial. Descubra a sua!"
                hasDescription={true}
                component={<CategoryList />} />
            <ShowCaseCollection
                items={[
                    {
                        url: "https://i.ibb.co/tTWBKdS3/IMG-1309.jpg",
                        redirect: "/collections/pulseira",
                        title: "Pulseira de Ouro Elegante",
                        description: "Um toque de sofisticação e elegância ao seu estilo.",
                    },
                ]}
                highlight={true}
                type="Grid"
                style="alternative"
                side="left"
            />
            <SectionComponent
                title="Torne sua WishList realidade"
                description='"Encontre as peças dos seus sonhos aqui"'
                hasDescription={true}
                component={<ProductsMainPage />} />
            <ShowCaseCollection
                items={[
                    {
                        url: "https://aromedecapelin.cdn.magazord.com.br/img/2023/08/produto/3167/design-sem-nome-1.png?ims=fit-in/600x600/filters:fill(fff)",
                        redirect: "/product/sabah-al-ward-al-wataniah",
                        title: "Sabah Al Ward Al Wataniah Eau de Parfum 100ml",
                        description: "Fragrância intensa e marcante, feita para quem sabe o valor da presença.",
                    },
                ]}
                highlight={true}
                type="Grid"
                style="alternative"
                side="right"
            />
            <SectionComponent
                title="Perfumes que encantam"
                description="Descubra fragrâncias marcantes que combinam com sua personalidade. Dos clássicos aos lançamentos, encontre o perfume ideal para cada momento."
                hasDescription={true}
                component={<PerfumeShowComponent />}
            />
            <ShowCaseCollection
                items={[
                    {
                        url: "https://a-static.mlcdn.com.br/1500x1500/perfume-arabe-asad-lattafa-eau-de-parfum-100ml-masculino/belaartebelezaeacessorios/f7bd35dc6c8a11efbe9a4201ac18501b/80c7081a91c7e8c43a9762bfea51038d.jpeg",
                        redirect: "/product/lattafa-asad",
                        title: "Lattafa Asad Eau De Parfum",
                        description: "Fragrância intensa e marcante, feita para quem sabe o valor da presença.",
                    }
                ]}
                highlight={true}
                type="Grid"
                style="alternative"
                side="left"
            />
            <Footer />
        </React.Fragment>
    )
}

export default Home