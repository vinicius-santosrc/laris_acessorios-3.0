import "./Main.css";
import React, { useEffect, useState } from "react";
import SubCategorys from "../../../components/geral/mainpage/SubCategorys";
import Carousel from "../../../components/geral/mainpage/Carousel";
import SectionComponent from "../../../components/geral/mainpage/SectionComponent";
import CategoryList from "../../../components/geral/category-list/CategoryList";
import Footer from "../../../components/geral/footer/Footer";
import ProductsMainPage from "../../../components/geral/mainpage/ProductsMainPage";
import ShowCaseCollection from "../../../components/geral/mainpage/ShowCaseCollection";
import { Facilitys } from "../../../services/facilitysService";

const Home = () => {
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [banner, setBanner] = useState<any>();
    const [bannerInfos, setBannerInfos] = useState<any>();

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
            const facility = await Facilitys.get("banner-principal");
            const facilityInfo = await Facilitys.get("banner-principal-texts");
            setBanner(facility);
            setBannerInfos({ ...facilityInfo, data: JSON.parse(facilityInfo.data) });
        }
        catch (error) {
            console.error(error);
        }
    }

    return (
        <React.Fragment>
            {banner ?
                <Carousel
                    url={isMobile ? banner.dataMobile : banner.data}
                    maintext={bannerInfos?.data?.mainText}
                    description={bannerInfos?.data?.description}
                    href={bannerInfos?.data?.href}
                />
                :
                null
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
                    {
                        url: "https://i.ibb.co/0jphgqRb/IMG-1322.jpg",
                        redirect: "/collections/lancamentos",
                        title: "Ultimos lançamentos",
                        description: "Confira nossas ultimas novidades",
                    },
                ]}
                type="Grid"
            />
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