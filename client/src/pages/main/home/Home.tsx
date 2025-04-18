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
import { useFacility } from "../../../contexts/FacilityContext";

const Home = () => {
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [allFacilitys, setAllFacilitys] = useState<any>();
    const { facility } = useFacility();

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

        document.title = `LARIS ACESSÓRIOS - Acessórios baratos, Entrega Rápida`;
        return () => {
            window.removeEventListener("resize", checkMobileView);
        };

    }, []);

    useEffect(() => {
        getFacilitys();
    }, [facility])

    const getFacilitys = async () => {
        try {
            const response = Facilitys.getFacilityByPage("home", facility);
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
            {allFacilitys &&
                <ShowCaseCollection
                    items={[
                        {
                            url: allFacilitys["showcase-inside-alternative-1"]?.data,
                            redirect: JSON.parse(allFacilitys["showcase-inside-alternative-1-text"]?.data)?.href,
                            title: JSON.parse(allFacilitys["showcase-inside-alternative-1-text"]?.data)?.mainText,
                            description: "Um toque de sofisticação e elegância ao seu estilo.",
                        },
                    ]}
                    highlight={true}
                    type="Grid"
                    style="alternative"
                    side="left"
                />
            }
            <SectionComponent
                title="Torne sua WishList realidade"
                description='"Encontre as peças dos seus sonhos aqui"'
                hasDescription={true}
                component={<ProductsMainPage />} />
            {allFacilitys &&
                <ShowCaseCollection
                    items={[
                        {
                            url: allFacilitys["showcase-inside-alternative-2"]?.data,
                            redirect: JSON.parse(allFacilitys["showcase-inside-alternative-2-text"]?.data)?.href,
                            title: JSON.parse(allFacilitys["showcase-inside-alternative-2-text"]?.data)?.mainText,
                            description: "Um toque de sofisticação e elegância ao seu estilo.",
                        },
                    ]}
                    highlight={true}
                    type="Grid"
                    style="alternative"
                    side="left"
                />
            }
            {/*
            <SectionComponent
                title="Perfumes que encantam"
                description="Descubra fragrâncias marcantes que combinam com sua personalidade. Dos clássicos aos lançamentos, encontre o perfume ideal para cada momento."
                hasDescription={true}
                component={<PerfumeShowComponent />}
            /> */}
            {allFacilitys &&
                <ShowCaseCollection
                    items={[
                        {
                            url: allFacilitys["showcase-inside-alternative-3"]?.data,
                            redirect: JSON.parse(allFacilitys["showcase-inside-alternative-3-text"]?.data)?.href,
                            title: JSON.parse(allFacilitys["showcase-inside-alternative-3-text"]?.data)?.mainText,
                            description: "Um toque de sofisticação e elegância ao seu estilo.",
                        },
                    ]}
                    highlight={true}
                    type="Grid"
                    style="alternative"
                    side="left"
                />
            }
            <Footer />
        </React.Fragment>
    )
}

export default Home