import { Input } from "@chakra-ui/react";
import './dashboard/dashboard-header.css'
import { useEffect, useState } from "react";
import { UserProps } from "../../models/user";
import authService from "../../services/authService";
import { getFirstAndLastName } from "../../lib/utils";
import { Bell, Settings } from "lucide-react";
import NotificationsComponent from "./notifications/NotificationsComponent";
import SideBar from "./SideBar";

export const DashboardHeader = () => {
    const [isBagOpen, setBagOpen] = useState<boolean>(false);

    const [userAtual, setUser] = useState<UserProps>();
    const [isLoading, setLoading] = useState(true);
    const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null); // Para controlar qual submenu está aberto
    const [dateToday, setDateToday] = useState<string>("");

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            try {
                const res = await authService.getUserData();
                const userContent: UserProps = await authService.getUserByEmail(res.email);
                setUser(userContent);
            } catch (error) {
                console.error("Erro ao obter dados do usuário", error);
            }
            setLoading(false);
        };
        const today = new Date();
        const formattedDate = new Intl.DateTimeFormat('pt-BR', {
            weekday: 'long', // Nome completo do dia
            day: '2-digit', // Dia do mês com dois dígitos
            month: 'long', // Nome completo do mês
            year: 'numeric' // Ano
        }).format(today);

        setDateToday(formattedDate); // Atualiza o estado com a data formatad

        fetchUserData();
    }, []);

    return (
        <header className="dashboard-header-component">
            <section className="dashboard-header-component__inside">
                <div className="dashboard-header-component-account-details">
                    <div className="user-info-content">
                        <SideBar />
                        <img
                            src={userAtual?.photoURL}
                            alt={`Avatar de ${userAtual?.nome_completo}`}
                            className="user-avatar-header"
                        />
                        <div className="user-details-content">
                            <p className="user-name">
                                {userAtual && userAtual.nome_completo ? (<span>Olá, {getFirstAndLastName(userAtual.nome_completo)}</span>) : 'Carregando...'}
                            </p>
                            <p className="user-role">{dateToday}</p>
                        </div>
                    </div>
                </div>
                <div className="dashboard-header-component-action-btns">
                    <Input placeholder="Buscar" background={"white"} padding={2} width={400} variant={"subtle"} />
                    <button><Settings /></button>
                    <NotificationsComponent setBagOpen={setBagOpen} isBagOpen={isBagOpen} />
                </div>
            </section>
        </header>
    )
}