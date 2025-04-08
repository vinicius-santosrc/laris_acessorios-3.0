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
        catch (error: any) {
            throw Error(error);
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
                <Carousel
                    url={""}
                    maintext={""}
                    description={""}
                    href={""}
                />
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
            <ShowCaseCollection
                items={[
                    {
                        url: "https://m.media-amazon.com/images/I/61rIEt70ZPL._AC_SL1000_.jpg",
                        redirect: "/product/lattafa-asad",
                        title: "Lattafa Asad Eau De Parfum",
                        description: "Fragrância intensa e marcante, feita para quem sabe o valor da presença.",
                    },
                    {
                        url: "https://images.tcdn.com.br/img/img_prod/487119/fakhar_rose_lattafa_feminino_eau_de_parfum_100ml_635_3_df83c846247eafb7a1b5cf79ec52122c.png",
                        redirect: "/product/fakhar-rose-eau-de-parfum-lattafa",
                        title: "Fakhar Rose Eau de Parfum – Lattafa",
                        description: "Exala elegância, romantismo e confiança",
                    },
                ]}
                type="Grid"
                style="default"
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
                        url: "https://i.ibb.co/1ffkJ52j/produto-perfume-arabe-feminino-al-wataniah-sabah-al-ward-edp-100ml-3161-removebg-preview.png",
                        redirect: "/product/sabah-al-ward-al-wataniah",
                        title: "Sabah Al Ward Al Wataniah Eau de Parfum 100ml",
                        description: "Fragrância intensa e marcante, feita para quem sabe o valor da presença.",
                    },
                ]}
                type="Grid"
                style="alternative"
            />
            <Footer />
        </React.Fragment>
    )
}

export default Home