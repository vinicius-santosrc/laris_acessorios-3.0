/**
 * Creation Date: 23/07/2025
 * Author: Vinícius da Silva Santos
 * Coordinator: Larissa Alves de Andrade Moreira
 * Developed by: Lari's Acessórios Team
 * Copyright 2025, LARI'S ACESSÓRIOS
 * All rights are reserved. Reproduction in whole or part is prohibited without the written consent of the copyright owner.
*/

import { Link } from "react-router-dom";
import { Button } from "../../ui/button";
import "./Footer.css";
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

    if (window.location.href.includes("/checkout")) {
        return (
            <footer className="checkout-footer">
                <div className="checkout-footer-container">
                    <div className="checkout-footer-item">
                        <h3>ENTREGAS & TROCAS</h3>
                        <p>A Laris Acessórios oferece entregas via Correios e Jadlog para todas as entregas e a possibilidade de trocar ou devolver suas criações sem nenhum custo em até 7 dias.</p>
                        <div className="checkout-footer-links">
                            <Link to="?entrega">Ver entrega</Link>
                            <Link to="?devolucoes">Ver devoluções</Link>
                        </div>
                    </div>
                    <div className="checkout-footer-item">
                        <h3>EMBALAGEM</h3>
                        <p>Seu pedido será enviado em uma caixa e dentro, uma icônica embalagem Laris Acessórios.</p>
                    </div>
                    <div className="checkout-footer-item">
                        <h3>PAGAMENTO E ENVIO 100% SEGURO</h3>
                        <p>A Laris Acessórios garante a segurança no pagamento e envio de seu pedido.</p>
                        <div className="checkout-footer-payment-icons">
                            <span>Visa</span>
                            <span>MasterCard</span>
                            <span>Elo</span>
                            <span>Pix</span>
                        </div>
                    </div>
                    <div className="checkout-footer-item">
                        <h3>GARANTIA DE AUTENTICIDADE</h3>
                        <p>A Laris Acessórios assegura a autenticidade de todos os produtos comprados em nossa e-Boutique.</p>
                    </div>
                </div>
            </footer>
        )
    }

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
                        <p className="footer-description">Seja o primeiro a receber notícias sobre novos produtos e promoções ativas. Entre agora em nosso grupo no WhatsApp</p>
                        <div className="footer-btn-inside footer-form">
                            <Button onClick={() => window.open("https://chat.whatsapp.com/HiQ2vdNPoLiFgK7SMZPlIK")} className="footer-btn" variant={"outline"}>ENTRAR NO GRUPO</Button>
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
                        <p className="footer-description">Seja o primeiro a receber notícias sobre novos produtos e promoções ativas. Entre agora em nosso grupo no WhatsApp</p>
                        <div className="footer-btn-inside footer-form">
                            <Button onClick={() => window.open("https://chat.whatsapp.com/HiQ2vdNPoLiFgK7SMZPlIK")} className="footer-btn" variant={"outline"}>ENTRAR NO GRUPO</Button>
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
