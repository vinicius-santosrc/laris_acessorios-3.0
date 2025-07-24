/**
 * Creation Date: 24/07/2025
 * Author: Vinícius da Silva Santos
 * Coordinator: Larissa Alves de Andrade Moreira
 * Developed by: Lari's Acessórios Team
 * Copyright 2025, LARI'S ACESSÓRIOS
 * All rights are reserved. Reproduction in whole or part is prohibited without the written consent of the copyright owner.
*/

import "./Main.css";
import React, { useEffect, useState } from "react";
import SubCategorys from "../../../components/geral/mainpage/SubCategorys";
import Carousel from "../../../components/geral/mainpage/Carousel";
import SectionComponent from "../../../components/geral/mainpage/SectionComponent";
import CategoryList from "../../../components/geral/category-list/CategoryList";
import ProductsMainPage from "../../../components/geral/mainpage/ProductsMainPage";
import ShowCaseCollection from "../../../components/geral/mainpage/ShowCaseCollection";
import { FacilitysRepository } from "../../../repositories/facilitys";
import PerfumeShowComponent from "../../../components/geral/mainpage/PerfumeShowComponent";
import Footer from "../../../components/geral/footer/Footer";
import { useFacility } from "../../../contexts/FacilityContext";
import carrouselShowcase from "../../../images/carousel_showcase.mp4";

const Home = () => {
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [allFacilitys, setAllFacilitys] = useState<any>();
    const { facility } = useFacility();
    const facilitysRepo = new FacilitysRepository();

    const checkMobileView = () => {
        setIsMobile(window.innerWidth <= 768);
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
        fetchFacilitys();
    }, [facility]);

    const fetchFacilitys = async () => {
        try {
            const response = facilitysRepo.getFacilityByPage("home", facility);
            setAllFacilitys(response);
        } catch (error: any) {
            throw new Error(error);
        }
    };

    const renderMainCarousel = () => {
        const bannerText = JSON.parse(allFacilitys['video–showcase-texts'].data);
        return (
            <Carousel
                url={carrouselShowcase}
                maintext={bannerText.mainText}
                description={bannerText.description}
                href={bannerText.href}
                type={"video"}
                height={700}
            />
        );
    };

    const renderSecondaryCarousel = () => {
        const banner = allFacilitys["banner-principal"];
        const bannerText = JSON.parse(allFacilitys["banner-principal-texts"].data);
        return (
            <Carousel
                url={isMobile ? banner.dataMobile : banner.data}
                maintext={bannerText.mainText}
                description={bannerText.description}
                href={bannerText.href}
                height={700}
            />
        );
    };

    const renderThridCarousel = () => {
        const bannerText = JSON.parse(allFacilitys["banner-secondary-texts"].data);
        if (bannerText.hidden === "true") return null;
        const banner = allFacilitys["banner-secondary"];
        return (
            <Carousel
                url={isMobile ? banner.dataMobile : banner.data}
                maintext={bannerText.mainText}
                description={bannerText.description}
                href={bannerText.href}
            />
        );
    };

    const renderShowcase = (key: string) => {
        const textData = JSON.parse(allFacilitys[`${key}-text`]?.data);
        if (textData?.hidden === "true") return null;
        return (
            <ShowCaseCollection
                items={[
                    {
                        url: allFacilitys[key]?.data,
                        redirect: textData?.href,
                        title: textData?.mainText,
                        description: "Um toque de sofisticação e elegância ao seu estilo.",
                    },
                ]}
                highlight={textData?.isNew === "true"}
                type="Grid"
                style="alternative"
                side="left"
            />
        );
    };

    return (
        <React.Fragment>
            {allFacilitys ? (
                <>
                    {renderMainCarousel()}
                    {renderSecondaryCarousel()}
                </>
            ) : (
                <Carousel url={""} maintext={""} description={""} href={""} />
            )}

            <SubCategorys />

            <SectionComponent
                title="Compre por categoria"
                description="Explore nossas categorias e encontre a joia que reflete sua essência. Cada peça é única e carrega consigo uma história especial. Descubra a sua!"
                hasDescription={true}
                component={<CategoryList />}
            />

            {allFacilitys && renderShowcase("showcase-inside-alternative-1")}

            <SectionComponent
                title="Torne sua WishList realidade"
                description='"Encontre as peças dos seus sonhos aqui"'
                hasDescription={true}
                component={<ProductsMainPage />}
            />

            {allFacilitys && renderShowcase("showcase-inside-alternative-2")}

            <SectionComponent
                title="Perfumes que encantam"
                description="Descubra fragrâncias marcantes que combinam com sua personalidade. Dos clássicos aos lançamentos, encontre o perfume ideal para cada momento."
                hasDescription={true}
                component={<PerfumeShowComponent />}
            />

            {allFacilitys && renderShowcase("showcase-inside-alternative-3")}

            <Footer />
        </React.Fragment>
    );
};

export default Home;