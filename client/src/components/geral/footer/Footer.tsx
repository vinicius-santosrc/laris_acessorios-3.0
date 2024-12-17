import { Link } from "react-router-dom";
import { Button } from "../../ui/button";
import "./Footer.css";
import { Input } from "@chakra-ui/react";

const Footer = () => {

    const date = new Date();;
    const year = date.getFullYear();

    return (
        <footer className="footer-group footer-wrapper">
            <div className="footer-inside">
                <section className="footer-left-side-content footer-section">
                    <article className="footer-content__inside">
                        <h2 className="footer-heading">Atendimento ao Cliente</h2>
                        <nav className="footer-inside_links footer-nav">
                            <Link to={window.location.origin} className="footer-link">Entre em contato</Link>
                            <Link to={window.location.origin} className="footer-link">Rastreie sua encomenda</Link>
                            <Link to={window.location.origin} className="footer-link">Cuidado com as Joias</Link>
                            <Link to={window.location.origin} className="footer-link">Perguntas frequentes</Link>
                        </nav>
                    </article>
                    <article className="footer-content__inside">
                        <h2 className="footer-heading">Sobre nós</h2>
                        <nav className="footer-inside_links footer-nav">
                            <Link to={window.location.origin} className="footer-link">Política de Privacidade e de Proteção de Dados</Link>
                        </nav>
                    </article>
                    <article className="footer-content__inside">
                        <h2 className="footer-heading">Relacionado</h2>
                        <nav className="footer-inside_links footer-nav">
                            <Link to={window.location.origin} className="footer-link">Seja modelo</Link>
                        </nav>
                    </article>
                </section>
                <section className="footer-right-side-content footer-section">
                    <h2 className="footer-heading">Receba novidades da LARI'S</h2>
                    <p className="footer-description">Seja o primeiro a receber notícias sobre novos produtos e promoções ativas.</p>
                    <div className="footer-btn-inside footer-form">
                        <Input className="footer-input" placeholder="E-mail" />
                        <Button className="footer-btn" variant={"outline"}>Inscrever-se</Button>
                    </div>
                </section>
            </div>
            <div className="footer-bottom">
                <span>© LARIS ACESSÓRIOS. { year }</span>
            </div>
        </footer>
    );
};

export default Footer;
