import { Link } from "react-router-dom";
import { Button } from "../../ui/button";
import "./Footer.css";
import { Input } from "@chakra-ui/react";
import React from "react";
import { AccordionItem, AccordionItemContent, AccordionItemTrigger, AccordionRoot } from "../../../components/ui/accordion";

const Footer = () => {

    const date = new Date();
    const year = date.getFullYear();

    const footerSections = [
        {
            title: "Atendimento ao Cliente",
            links: [
                { text: "Entre em contato", to: window.location.origin + "/contact-us"},
                { text: "Cuidado com as Joias", to: window.location.origin + "/care-for-jewelry" },
                { text: "Perguntas frequentes", to: window.location.origin + "/questions" }
            ]
        },
        {
            title: "Sobre nós",
            links: [
                { text: "Política de Privacidade e de Proteção de Dados", to: window.location.origin + "/policy" }
            ]
        },
        {
            title: "Relacionado",
            links: [
                { text: "Seja modelo", to: window.location.origin + "/beamodel" }
            ]
        }
    ];

    return (
        <React.Fragment>
            <footer className="footer-group footer-desktop footer-wrapper">
                <div className="footer-inside">
                    <section className="footer-left-side-content footer-section">
                        {footerSections.map((section, index) => (
                            <article key={index} className="footer-content__inside">
                                <h2 className="footer-heading">{section.title}</h2>
                                <nav className="footer-inside_links footer-nav">
                                    {section.links.map((link, linkIndex) => (
                                        <Link key={linkIndex} to={link.to} className="footer-link">{link.text}</Link>
                                    ))}
                                </nav>
                            </article>
                        ))}
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
                    <span>© LARIS ACESSÓRIOS. {year}</span>
                </div>
            </footer>

            <footer className="footer-group footer-mobile footer-wrapper">
                <div className="footer-inside">
                    <section className="footer-right-side-content footer-section">
                        <h2 className="footer-heading">Receba novidades da LARI'S</h2>
                        <p className="footer-description">Seja o primeiro a receber notícias sobre novos produtos e promoções ativas.</p>
                        <div className="footer-btn-inside footer-form">
                            <Input className="footer-input" placeholder="E-mail" />
                            <Button className="footer-btn" variant={"outline"}>Inscrever-se</Button>
                        </div>
                    </section>
                    <div className="accordion">
                        <AccordionRoot collapsible defaultValue={["b"]}>
                            {footerSections.map((section, index) => (
                                <AccordionItem key={index} value={`section-${index}`}>
                                    <AccordionItemTrigger>
                                        <h2 id="sectionTitle">{section.title.toUpperCase()}</h2>
                                    </AccordionItemTrigger>
                                    <AccordionItemContent>
                                        <nav className="footer-inside_links footer-nav">
                                            {section.links.map((link, linkIndex) => (
                                                <Link key={linkIndex} to={link.to} className="footer-link">{link.text}</Link>
                                            ))}
                                        </nav>
                                    </AccordionItemContent>
                                </AccordionItem>
                            ))}
                        </AccordionRoot>
                    </div>
                    <div className="footer-bottom">
                        <span>© LARIS ACESSÓRIOS - JOIAS E SEMIJOIAS {year} - Brasil</span>
                    </div>
                </div>
            </footer>
        </React.Fragment>
    );
};

export default Footer;
