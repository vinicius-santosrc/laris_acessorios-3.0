import React, { useState } from "react";
import TopBarComponent from "./topbar-component/TopBarComponent";
import logoHeader from "../../../images/logo.svg";
import { FavoritesIcon, SearchIcon } from "../../icons/icons";
import "./Header.css";
import { Link } from "react-router-dom";
import { Button } from "../../ui/button";
import { Image, Input } from "@chakra-ui/react";
import { menuItems, MenuItemsProps } from "../../../lib/utils";
import BagComponent from "./bag-component/BagComponent";
import MenuComponent from "./menu-mobile/MenuComponent";
import AccountComponent from "./account-component/AccountComponent";
import SubHeaderComponent from "./SubHeaderComponent";

const Header = () => {
    const [isBagOpen, setBagOpen] = useState<boolean>(false);
    const [isSearchBoxOpen, setSearchbox] = useState<boolean>(false);
    const [isItemHover, setItemHover] = useState<MenuItemsProps | null>(null);
    const [isSubHeaderOpen, setSubHeaderOpen] = useState<boolean>(false);
    const [isSubMenuHovered, setIsSubMenuHovered] = useState<boolean>(false);

    const handleMouseEnter = (categoria: MenuItemsProps) => {
        setItemHover(categoria);
        setSubHeaderOpen(true);
    };

    const handleMouseLeave = () => {
        setTimeout(() => {
            if (!isSubMenuHovered) {
                setItemHover(null);
                setSubHeaderOpen(false);
            }
        }, 1500);
    };

    const handleSubHeaderMouseEnter = () => {
        setIsSubMenuHovered(true);
    };

    const handleSubHeaderMouseLeave = () => {
        setIsSubMenuHovered(false);
        setSubHeaderOpen(false);
    };

    if (window.location.href.includes("/checkout")) {
        return (
            <React.Fragment>
                <div className="header-full-component">
                    <TopBarComponent text="Compre pelo WhatsApp +55 35 99739-4181" />
                    <header className="header-application header-application__wrapper">
                        <div className="header-app-top-content header-app-top-content__wrapper">
                            <section className="header-inside-content header-inside-content__search">
                            </section>

                            <section className="header-inside-content header-inside-content__logo">
                                <Link to={window.location.origin} target="_parent">
                                    <Image src={logoHeader} alt="Logotipo" className="logo-image" />
                                </Link>
                            </section>

                            <section className="header-inside-content header-inside-content__icons">

                            </section>
                        </div>
                    </header>
                </div>

                <header className={"header-application-mobile header-application__wrapper " + window.location.href.includes('/checkout') && "header-mobile-checkout"}>
                    <div className="header-app-top-content header-app-top-content__wrapper">
                        <section className="header-inside-content header-inside-content__search">
                        </section>

                        <section className="header-inside-content header-inside-content__logo">
                            <Link to={window.location.origin} target="_parent">
                                <Image src={logoHeader} alt="Logotipo" className="logo-image" />
                            </Link>
                        </section>

                        <section className="header-inside-content header-inside-content__icons">
                        </section>
                    </div>
                </header>
            </React.Fragment>

        )
    }

    return (
        <div className="header-full-component">
            <TopBarComponent text="Compre pelo WhatsApp +55 35 99739-4181" />
            <header className="header-application header-application__wrapper">
                <div className="header-app-top-content header-app-top-content__wrapper">
                    <section className="header-inside-content header-inside-content__search">
                        <div className="search-box-area search-box-area__wrapper">
                            <SearchIcon />
                            <Input className="search-input" placeholder="Buscar por produtos" />
                        </div>
                    </section>

                    <section className="header-inside-content header-inside-content__logo">
                        <Link to={window.location.origin}>
                            <Image src={logoHeader} alt="Logotipo" className="logo-image" />
                        </Link>
                    </section>

                    <section className="header-inside-content header-inside-content__icons">
                        <AccountComponent />
                        <Button onClick={() => { window.location.href = window.location.origin + "/account#wishlist" }} variant="ghost" aria-label="Favoritos">
                            <FavoritesIcon />
                        </Button>
                        <BagComponent setBagOpen={setBagOpen} isBagOpen={isBagOpen} />
                    </section>
                </div>

                <nav className="header-app-bottom-content header-app-bottom-content__wrapper">
                    <div className="header-inside-bottom-content header-inside-bottom-content__redirects">
                        {menuItems.map((categoria: MenuItemsProps) => {
                            return (
                                <article
                                    key={categoria.title}
                                    className="redirect-item-content redirect-item-content__gifts"
                                    onMouseEnter={() => handleMouseEnter(categoria)} // Ativar hover
                                    onMouseLeave={handleMouseLeave} // Desativar hover
                                >
                                    <Button
                                        onClick={() =>
                                            categoria.isLink
                                                ? (window.location.href = categoria.href)
                                                : "javascript:;"
                                        }
                                    >
                                        {categoria.title}
                                    </Button>
                                </article>
                            );
                        })}
                    </div>
                </nav>
            </header>

            <header className="header-application-mobile header-application__wrapper">
                <div className="header-app-top-content header-app-top-content__wrapper">
                    <section className="header-inside-content header-inside-content__search">
                        <MenuComponent logoHeader={logoHeader} menuItems={menuItems} />
                        <Button
                            onClick={() => {
                                setSearchbox(!isSearchBoxOpen);
                            }}
                            variant="ghost"
                            aria-label="Buscar"
                        >
                            <SearchIcon />
                        </Button>
                    </section>

                    <section className="header-inside-content header-inside-content__logo">
                        <Link to={window.location.origin}>
                            <Image src={logoHeader} alt="Logotipo" className="logo-image" />
                        </Link>
                    </section>

                    <section className="header-inside-content header-inside-content__icons">
                        <AccountComponent />
                        <BagComponent setBagOpen={setBagOpen} isBagOpen={isBagOpen} />
                    </section>
                </div>

                {isSearchBoxOpen && (
                    <section className="search-box-wrapper-mobile">
                        <div className="search-box-wrapper-inside">
                            <div className="search-btn-inside search-form">
                                <Input className="search-input" placeholder="Buscar produtos" />
                                <Button className="search-btn" variant={"outline"}>
                                    BUSCAR
                                </Button>
                            </div>
                        </div>
                    </section>
                )}
            </header>

            <section
                className="subHeader"
                onMouseEnter={handleSubHeaderMouseEnter}
                onMouseLeave={handleSubHeaderMouseLeave}
            >
                <SubHeaderComponent itemHover={isItemHover} isOpen={isSubHeaderOpen} />
            </section>
        </div>
    );
};

export default Header;
