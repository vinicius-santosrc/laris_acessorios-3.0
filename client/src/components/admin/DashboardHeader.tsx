/**
 * Creation Date: 23/07/2025
 * Author: Vinícius da Silva Santos
 * Coordinator: Larissa Alves de Andrade Moreira
 * Developed by: Lari's Acessórios Team
 * Copyright 2025, LARI'S ACESSÓRIOS
 * All rights are reserved. Reproduction in whole or part is prohibited without the written consent of the copyright owner.
*/

import { Button, Input } from "@chakra-ui/react";
import './dashboard/dashboard-header.css'
import { useEffect, useState } from "react";
import { getFirstAndLastName } from "../../lib/utils";
import { Settings } from "lucide-react";
import NotificationsComponent from "./notifications/NotificationsComponent";
import SideBar from "./SideBar";
import { useUser } from "../../contexts/UserContext";
import SearchComponent from "./header/SearchComponent";

export const DashboardHeader = () => {
    const [isBagOpen, setBagOpen] = useState<boolean>(false);

    const { user, loading } = useUser();
    const [isLoading, setLoading] = useState(true);
    const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
    const [dateToday, setDateToday] = useState<string>("");
    const [isMobile, setIsMobile] = useState<boolean>(false);

    useEffect(() => {
        const checkIfMobile = () => {
            if (window.innerWidth <= 768) {
                setIsMobile(true);
            } else {
                setIsMobile(false);
            }
        };

        checkIfMobile();
        window.addEventListener("resize", checkIfMobile);

        return () => {
            window.removeEventListener("resize", checkIfMobile);
        }
    }, []);

    useEffect(() => {
        const today = new Date();
        const formattedDate = new Intl.DateTimeFormat('pt-BR', {
            weekday: 'long', // Nome completo do dia
            day: '2-digit', // Dia do mês com dois dígitos
            month: 'long', // Nome completo do mês
            year: 'numeric' // Ano
        }).format(today);

        setDateToday(formattedDate);
    }, []);

    return (
        <header className="dashboard-header-component">
            <section className="dashboard-header-component__inside">
                {/*isMobile && <img className="logoheadermobile" src={logoHeader} alt="LARIS-ACESSORIOS" />*/}
                <div className="dashboard-header-component-account-details">
                    <div className="user-info-content">
                        <SideBar />
                        <img
                            src={user?.photoURL}
                            alt={`Avatar de ${user?.nome_completo}`}
                            className="user-avatar-header"
                        />
                        <div className="user-details-content">
                            <p className="user-name">
                                {user && user.nome_completo ? (<span>Olá, {getFirstAndLastName(user.nome_completo)}</span>) : 'Carregando...'}
                            </p>
                            <p className="user-role">{dateToday}</p>
                        </div>
                    </div>
                </div>
                <div className="dashboard-header-component-action-btns">
                    <SearchComponent />
                    <Button disabled><Settings /></Button>
                    <NotificationsComponent setBagOpen={setBagOpen} isBagOpen={isBagOpen} />
                </div>
            </section>
        </header>
    )
}