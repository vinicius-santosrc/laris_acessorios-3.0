import { useEffect, useState } from 'react';
import logoHeader from '../../logo.svg';
import { UserProps } from '../../models/user';
import authService from '../../services/authService';
import { LayoutDashboard, Users, FileText, Settings, LogOut, BoxIcon, DatabaseIcon, ChevronRight, Calendar, FactoryIcon } from 'lucide-react';
import { getFirstAndLastName } from '../../lib/utils';

const SideBar = () => {
    const [userAtual, setUser] = useState<UserProps>();
    const [isLoading, setLoading] = useState(true);
    const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null); // Para controlar qual submenu está aberto

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

        fetchUserData();
    }, []);

    const handleSubMenuToggle = (index: string) => {
        setActiveSubMenu(activeSubMenu === index ? null : index); // Alterna entre abrir e fechar
    };

    const routes = [
        {
            section: <><LayoutDashboard /><span>Dashboard</span></>,
            link: '/admin',
            hasSubMenu: false
        },
        {
            section: <><BoxIcon /><span>Produtos</span></>,
            link: '/admin/products',
            hasSubMenu: false,
        },
        {
            section: <><Users /><span>Clientes</span></>,
            link: '/admin/clients',
            hasSubMenu: false
        },
        {
            section: <><DatabaseIcon /><span>Planilhas</span><ChevronRight /></>,
            link: '/admin/planilhas',
            hasSubMenu: true,
            subMenu: [
                {
                    section: "Planilha itens",
                    link: '/admin/planilhas/itens'
                },
                {
                    section: "Planilha finanças",
                    link: '/admin/planilhas/finanças'
                }
            ]
        },
        {
            section: <><Calendar /> Planejamentos</>,
            link: '/admin/reports',
            hasSubMenu: false
        },
        {
            section: <><FactoryIcon /> WebFacility</>,
            link: '/admin/reports',
            hasSubMenu: false
        },
        {
            section: <><FileText /> Relatórios</>,
            link: '/admin/reports',
            hasSubMenu: false
        },
        {
            section: <><Settings /> Configurações</>,
            link: '/admin/config',
            hasSubMenu: false
        },
    ];

    return (
        <aside className="sidebar" aria-label="Sidebar de navegação">
            {/* Header com logo */}
            <div className="sidebar-header">
                <div className="sidebar-header__inside">
                    <div className='sidebar-header-icon'>
                        <img src={logoHeader} alt='Laris acessórios' />
                    </div>
                </div>
            </div>

            {/* Seções de navegação */}
            <nav className="sidebar-nav">
                <div className='sidebar-header-section'>
                    <h2>Navegação</h2>
                </div>
                {routes.map((route, index) => (
                    <div className="nav-section" key={index}>
                        <a
                            href={route.link}
                            className="nav-link"
                            id={window.location.href.includes(route.link) ? "selected" : ""}
                            onClick={route.hasSubMenu ? (e) => { e.preventDefault(); handleSubMenuToggle(`submenu-${index}`); } : undefined}
                        >
                            {route.section}
                        </a>

                        {/* Submenu - aparece quando o item com submenu é clicado */}
                        {route.hasSubMenu && activeSubMenu === `submenu-${index}` && (
                            <div className="sub-menu">
                                {route.subMenu?.map((subRoute, subIndex) => (
                                    <a key={subIndex} href={subRoute.link} className="nav-link sub-nav-link">
                                        {subRoute.section}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </nav>

            {/* Rodapé com informações do usuário */}
            <div className="sidebar-footer">
                <div className="user-info-content">
                    <img
                        src={userAtual?.photoURL}
                        alt={`Avatar de ${userAtual?.nome_completo}`}
                        className="user-avatar"
                    />
                    <div className="user-details-content">
                        <p className="user-name">
                        {userAtual && userAtual.nome_completo ? getFirstAndLastName(userAtual.nome_completo) : 'Carregando...'}
                        </p>
                        <p className="user-role">{userAtual?.label}</p>
                    </div>
                </div>
                <a href="/logout" className="logout-link">
                    <LogOut className="logout-icon" />
                </a>
            </div>
        </aside>
    );
};

export default SideBar;
