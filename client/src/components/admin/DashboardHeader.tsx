import { Button, Input } from "@chakra-ui/react";
import './dashboard/dashboard-header.css'
import { useEffect, useState } from "react";
import { UserProps } from "../../models/user";
import authService from "../../services/authService";
import { getFirstAndLastName } from "../../lib/utils";
import { Settings } from "lucide-react";
import NotificationsComponent from "./notifications/NotificationsComponent";
import SideBar from "./SideBar";
import logoHeader from '../../logo.svg';
import { useUser } from "../../contexts/UserContext";

export const DashboardHeader = () => {
    const [isBagOpen, setBagOpen] = useState<boolean>(false);

    const { user, loading } = useUser();
    const [isLoading, setLoading] = useState(true);
    const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null); // Para controlar qual submenu está aberto
    const [dateToday, setDateToday] = useState<string>("");
    const [isMobile, setIsMobile] = useState<boolean>(false);
    useEffect(() => {

        // Função para verificar a largura da tela
        const checkIfMobile = () => {
            if (window.innerWidth <= 768) {
                setIsMobile(true);
            } else {
                setIsMobile(false);
            }
        };

        // Verifica ao carregar o componente
        checkIfMobile();

        // Adiciona evento para verificar mudanças na largura da tela
        window.addEventListener("resize", checkIfMobile);

        // Remove o evento ao desmontar o componente
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

        setDateToday(formattedDate); // Atualiza o estado com a data formatad
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
                    <Input placeholder="Buscar" background={"white"} padding={2} width={400} variant={"subtle"} />
                    <Button disabled><Settings /></Button>
                    <NotificationsComponent setBagOpen={setBagOpen} isBagOpen={isBagOpen} />
                </div>
            </section>
        </header>
    )
}