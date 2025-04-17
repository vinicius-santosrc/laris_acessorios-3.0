import { useEffect, useState } from 'react';
import logoHeader from '../../logo.svg';
import authService from '../../services/authService';
import { LayoutDashboard, Users, BoxIcon, DatabaseIcon, ChevronRight, Calendar, FactoryIcon, FileText, Settings, LogOut, ListOrdered, ChevronDown, ListIcon, LucideChevronsUpDown, Settings2Icon } from 'lucide-react'; // Importando ícone de Menu
import { getFirstAndLastName, menuItemsAdmin } from '../../lib/utils';
import './sidebar.css';
import { Link } from 'react-router-dom';
import MenuComponent from '../geral/header/menu-mobile/MenuComponent';
import { useUser } from '../../contexts/UserContext';
import { AccordionItem, AccordionItemContent, AccordionItemTrigger, AccordionRoot } from "../../components/ui/accordion";
import { Portal, Menu, Separator } from "@chakra-ui/react"

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
            hasSubMenu: false,
            group: "Visão Geral"
        },
        {
            section: <><BoxIcon /><span>Produtos</span></>,
            link: '/admin/products',
            hasSubMenu: false,
            group: "Gerenciamento"
        },
        {
            section: <><ListIcon /><span>Categorias</span></>,
            link: '/admin/categories',
            hasSubMenu: false,
            group: "Gerenciamento"
        },
        {
            section: <><Users /><span>Clientes</span></>,
            link: '/admin/clients',
            hasSubMenu: false,
            group: "Relacionamento"
        },
        {
            section: <><DatabaseIcon /><span>Planilhas</span></>,
            link: '/admin/planilhas',
            hasSubMenu: true,
            group: "Financeiro",
            subMenu: [
                { section: "Planilha itens", link: '/admin/sheet/planilha-itens' },
                { section: "Planilha finanças", link: '/admin/sheet/planilha-despesas' }
            ]
        },
        {
            section: <><Calendar /> Planejamentos</>,
            link: '/admin/planning',
            hasSubMenu: false,
            group: "Operações"
        },
        {
            section: <><ListOrdered /> Pedidos</>,
            link: '/admin/orders',
            hasSubMenu: false,
            group: "Vendas"
        },
        {
            section: <><FactoryIcon /> Facilitys</>,
            link: '/admin/facilitys',
            hasSubMenu: false,
            group: "Infraestrutura"
        },
        {
            section: <><FileText /> Relatórios</>,
            link: '/admin/reports',
            hasSubMenu: false,
            group: "Análises"
        },
        {
            section: <><Settings /> Configurações</>,
            link: '/admin/config',
            hasSubMenu: false,
            group: "Ajustes"
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
                <h2 className="groupTitle">
                    <span>Ajustes da Plataforma</span>
                </h2>
                <AccordionRoot collapsible>
                    {[
                        { name: "Visão Geral", icon: <LayoutDashboard /> },
                        { name: "Gerenciamento", icon: <BoxIcon /> },
                        { name: "Relacionamento", icon: <Users /> },
                        { name: "Financeiro", icon: <DatabaseIcon /> },
                        { name: "Operações", icon: <Calendar /> },
                        { name: "Vendas", icon: <ListOrdered /> },
                        { name: "Infraestrutura", icon: <FactoryIcon /> },
                        { name: "Análises", icon: <FileText /> },
                        { name: "Ajustes", icon: <Settings /> }
                    ].map((group, groupIndex) => {
                        const groupRoutes = routes.filter(route => route.group === group.name);

                        return groupRoutes.length > 0 ? (
                            <AccordionItem className='nav-section-select' key={groupIndex} value={`section-${groupIndex}`}>
                                <AccordionItemTrigger>
                                    <h2 id="sectionTitle">
                                        {group.icon}
                                        <span>{group.name}</span>
                                    </h2>
                                </AccordionItemTrigger>
                                <AccordionItemContent>
                                    <nav className="sidebar-nav">
                                        {groupRoutes.map((route, index) => (
                                            <div className="nav-section" key={index}>
                                                <Link
                                                    to={route.link}
                                                    className="nav-link"
                                                    id={window.location.pathname === route.link ? "selected" : ""}
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
                                </AccordionItemContent>
                            </AccordionItem>
                        ) : null;
                    })}
                </AccordionRoot>

                {/* Rodapé com informações do usuário */}

                <div className="sidebar-footer">
                    <Menu.Root>
                        <Menu.Trigger asChild>
                            <div className='sidebar-footer'>
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
                                        {process.env.REACT_APP_DEFAULTCONFIGURATION  != "local" ? null : <p className='user-role'>Ambiente Local</p>}
                                    </div>
                                </div>
                                <a className="logout-link">
                                    <LucideChevronsUpDown />
                                </a>
                            </div>
                        </Menu.Trigger>
                        <Portal>
                            <Menu.Positioner>
                                <Menu.Content width={250}>
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

                                    <Menu.Item value="new-txt-b" disabled>
                                        <Settings2Icon /> Configurações
                                    </Menu.Item>
                                    <Separator />
                                    <Menu.Item onClick={() => authService.logout()} value="new-txt-c">
                                        <LogOut /> Sair da conta
                                    </Menu.Item>
                                </Menu.Content>
                            </Menu.Positioner>
                        </Portal>
                    </Menu.Root>
                </div>
            </aside >
        </>
    );
};

export default SideBar;
