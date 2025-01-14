import { useEffect, useState } from 'react';
import logoHeader from '../../logo.svg';
import { UserProps } from '../../models/user';
import authService from '../../services/authService';
import { LayoutDashboard, Users, BoxIcon, DatabaseIcon, ChevronRight, Calendar, FactoryIcon, FileText, Settings, LogOut, ListOrdered, ChevronDown } from 'lucide-react';
import { getFirstAndLastName } from '../../lib/utils';
import './sidebar.css'; // Aponte para o arquivo CSS adequado
import { Link } from 'react-router-dom';

const SideBar = () => {
    const [userAtual, setUser] = useState<UserProps>();
    const [isLoading, setLoading] = useState(true);
    const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);

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
        setActiveSubMenu(activeSubMenu === index ? null : index);
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
            section: <><DatabaseIcon /><span>Planilhas</span></>,
            link: '/admin/planilhas',
            hasSubMenu: true,
            subMenu: [
                { section: "Planilha itens", link: '/admin/sheet/planilha-itens' },
                { section: "Planilha finanças", link: '/admin/sheet/planilha-despesas' }
            ]
        },
        {
            section: <><Calendar /> Planejamentos</>,
            link: '/admin/planning',
            hasSubMenu: false
        },
        {
            section: <><ListOrdered /> Pedidos</>,
            link: '/admin/orders',
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
                        <Link
                            to={route.link}
                            className="nav-link"
                            id={window.location.pathname == route.link ? "selected" : ""}
                            onClick={route.hasSubMenu ? (e) => { e.preventDefault(); handleSubMenuToggle(`submenu-${index}`); } : undefined}
                        >
                            {route.section} {route.hasSubMenu && activeSubMenu === `submenu-${index}` ? <ChevronDown /> : <>{route.hasSubMenu && <ChevronRight /> }</>}
                        </Link>

                        {/* Submenu */}
                        {route.hasSubMenu && activeSubMenu === `submenu-${index}` && (
                            <div className="sub-menu">
                                {route.subMenu?.map((subRoute, subIndex) => (
                                    <Link key={subIndex} to={subRoute.link} className="nav-link sub-nav-link">
                                        {subRoute.section}
                                    </Link>
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
