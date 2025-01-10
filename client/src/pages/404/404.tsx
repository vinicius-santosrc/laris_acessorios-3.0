import React from 'react';
import './NotFoundPage.css'; 
import ErrorSvg from '../../images/undraw_page-not-found_6wni.svg';
import Footer from '../../components/geral/footer/Footer';
import ProductsMainPage from '../../components/geral/mainpage/ProductsMainPage';
import SectionComponent from '../../components/geral/mainpage/SectionComponent';
import CategoryList from '../../components/geral/category-list/CategoryList';

export const NotFoundPage = () => {
    return (
        <section className="not-found-page">
            <div className="not-found-page__inside">
                <img src={ErrorSvg} alt='notFoundIcon' />
                <h1 className="not-found-page__title">PÁGINA NÃO ENCOTRADA</h1>
                <p className="not-found-page__message">
                    Desculpe, mas a página que você procura não existe. Talvez você esteja buscando algo reluzente, mas está no lugar errado!
                </p>
                <a href="/" className="not-found-page__button">
                    Voltar para a Home
                </a>
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
            </div>
        </section>
    );
}
