/**
 * Creation Date: 13/03/2025
 * Author: Vinícius da Silva Santos
 * Coordinator: Larissa Alves de Andrade Moreira
 * Developed by: Lari's Acessórios Team
 * Copyright 2025, LARI'S ACESSÓRIOS
 * All rights are reserved. Reproduction in whole or part is prohibited without the written consent of the copyright owner.
 */


import { useEffect, useState } from "react";
import { Button, CloseButton, Drawer, Portal } from "@chakra-ui/react";
import "./policycookies.css";

const COOKIE_STORAGE_KEY = "cookieConsent";

const PolicyCookies = () => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const storedConsent = localStorage.getItem(COOKIE_STORAGE_KEY);
        if (!storedConsent) {
            setIsOpen(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem(COOKIE_STORAGE_KEY, "accepted");
        setIsOpen(false);
    };

    const handleReject = () => {
        localStorage.setItem(COOKIE_STORAGE_KEY, "rejected");
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        <Drawer.Root defaultOpen={true} key={"bottom"} placement={"bottom"}>
            <Portal>
                <Drawer.Backdrop className="laris-cookies-drawer-backdrop" />
                <Drawer.Positioner className="laris-cookies-drawer-positioner">
                    <Drawer.Content roundedTop={"l3"} className="laris-cookies-drawer-content">
                        <Drawer.Header className="laris-cookies-drawer-header">
                            <Drawer.Title className="laris-cookies-drawer-title">POLÍTICA DE COOKIES</Drawer.Title>
                        </Drawer.Header>
                        <Drawer.Body className="laris-cookies-drawer-body">
                            Este website utiliza cookies e tecnologias semelhantes para permitir o seu funcionamento e o oferecimento de nossos produtos e serviços, além de outras funcionalidades e finalidades.
                            <br />Para alterar ou revogar o seu consentimento a alguns ou todos os cookies, clique em "Configurar os seus cookies" ou, para saber mais, consulte a nossa Política de Cookies.
                            <br />Ao clicar em "Permitir todos", você dá o seu consentimento para a utilização de todos os cookies utilizados neste website.
                            <br />Ao clicar em "Rejeitar cookies não necessários", você rejeita todos os cookies exceto os cookies necessários ao funcionamento deste website.
                            <br />
                            <br />
                            Cookies analíticos serão coletados a partir do início da sua navegação em nosso site. Ao configurar seus cookies, você pode rejeitar a sua utilização.
                        </Drawer.Body>
                        <Drawer.Footer className="laris-cookies-drawer-footer">
                            <Button className="laris-cookies-drawer-button-allow" onClick={handleAccept}>
                                PERMITIR TODOS
                            </Button>
                            <Button variant="outline" className="laris-cookies-drawer-button-reject" onClick={handleReject}>
                                REJEITAR COOKIES NÃO NECESSÁRIOS
                            </Button>
                        </Drawer.Footer>
                        <Drawer.CloseTrigger asChild>
                            <CloseButton size="sm" className="laris-cookies-drawer-close-button" onClick={handleReject} />
                        </Drawer.CloseTrigger>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Portal>
        </Drawer.Root>
    );
};

export default PolicyCookies;
