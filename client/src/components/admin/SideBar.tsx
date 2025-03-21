import { useEffect, useState } from 'react';
import logoHeader from '../../logo.svg';
import { UserProps } from '../../models/user';
import authService from '../../services/authService';
import { LayoutDashboard, Users, BoxIcon, DatabaseIcon, ChevronRight, Calendar, FactoryIcon, FileText, Settings, LogOut, ListOrdered, ChevronDown, Menu, ListIcon } from 'lucide-react'; // Importando ícone de Menu
import { getFirstAndLastName, menuItemsAdmin } from '../../lib/utils';
import './sidebar.css';
import { Link } from 'react-router-dom';
import MenuComponent from '../geral/header/menu-mobile/MenuComponent';
import { LuList } from 'react-icons/lu';
import { useUser } from '../../contexts/UserContext';

const SideBar = () => {
    const { user, loading } = useUser();
    const [isLoading, setLoading] = useState(true);
    const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
    const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false);

    useEffect(() => {
        setLoading(loading)
    }, [loading]);

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
            section: <><ListIcon /><span>Categorias</span></>,
            link: '/admin/categories',
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
            section: <><FactoryIcon /> Facilitys</>,
            link: '/admin/facilitys',
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
        <>
            {/* Botão para abrir a sidebar em dispositivos móveis */}
            <div className="mobile-menu-button">
                <MenuComponent
                    logoHeader={logoHeader}
                    menuItems={menuItemsAdmin}
                    hasFooter={false}
                />
            </div>

            <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`} aria-label="Sidebar de navegação">
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
                    {routes.map((route, index) => (
                        <div className="nav-section" key={index}>
                            <Link
                                to={route.link}
                                className="nav-link"
                                id={window.location.pathname == route.link ? "selected" : ""}
                                onClick={route.hasSubMenu ? (e) => { e.preventDefault(); handleSubMenuToggle(`submenu-${index}`); } : () => setSidebarOpen(false)}
                            >
                                {route.section} {route.hasSubMenu && activeSubMenu === `submenu-${index}` ? <ChevronDown /> : <>{route.hasSubMenu && <ChevronRight />}</>}
                            </Link>

                            {/* Submenu */}
                            {route.hasSubMenu && activeSubMenu === `submenu-${index}` && (
                                <div className="sub-menu">
                                    {route.subMenu?.map((subRoute, subIndex) => (
                                        <Link key={subIndex} onClick={() => setSidebarOpen(false)} to={subRoute.link} className="nav-link sub-nav-link">
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
                            src={user?.photoURL}
                            alt={`Avatar de ${user?.nome_completo}`}
                            className="user-avatar"
                        />
                        <div className="user-details-content">
                            <p className="user-name">
                                {user && user.nome_completo ? getFirstAndLastName(user.nome_completo) : 'Carregando...'}
                            </p>
                            <p className="user-role">{user?.label}</p>
                        </div>
                    </div>
                    <a href="/logout" className="logout-link">
                        <LogOut className="logout-icon" />
                    </a>
                </div>
            </aside>
        </>
    );
};

export default SideBar;
