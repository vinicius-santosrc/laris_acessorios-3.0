import "./Main.css"
import React from "react"
import SubCategorys from "../../../components/geral/mainpage/SubCategorys"
import Carousel from "../../../components/geral/mainpage/Carousel"
import SectionComponent from "../../../components/geral/mainpage/SectionComponent"
import CategoryList from "../../../components/geral/category-list/CategoryList"
import Footer from "../../../components/geral/footer/Footer"
import ProductsMainPage from "../../../components/geral/mainpage/ProductsMainPage"

const Home = () => {
    return (
        <React.Fragment>
            <Carousel
                url=""
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