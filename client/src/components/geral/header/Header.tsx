import React, { useEffect, useState } from "react";
import TopBarComponent from "./topbar-component/TopBarComponent";
import logoHeader from "../../../images/logo.svg";
import { FavoritesIcon, SearchIcon } from "../../icons/icons";
import "./Header.css";
import { Link } from "react-router-dom";
import { Button } from "../../ui/button";
import { Image, Input, InputElementProps } from "@chakra-ui/react";
import { MenuItemsProps } from "../../../lib/utils";
import BagComponent from "./bag-component/BagComponent";
import MenuComponent from "./menu-mobile/MenuComponent";
import AccountComponent from "./account-component/AccountComponent";
import SubHeaderComponent from "./SubHeaderComponent";
import { adminService } from "../../../services/adminService";

const Header = () => {
    const [isBagOpen, setBagOpen] = useState<boolean>(false);
    const [isSearchBoxOpen, setSearchbox] = useState<boolean>(false);
    const [isItemHover, setItemHover] = useState<MenuItemsProps | null>(null);
    const [isSubHeaderOpen, setSubHeaderOpen] = useState<boolean>(false);
    const [isSubMenuHovered, setIsSubMenuHovered] = useState<boolean>(false);
    const [inputSearch, setInputSearch] = useState<string>("");
    const [isFocused, setIsFocused] = useState(false);

    const [menuItems, setMenuItems] = useState<any[]>([]);

    const handleMouseEnter = (categoria: any) => {
        if (categoria.sub_items) {
            setItemHover({
                ...categoria,
                subItems: JSON.parse(categoria.sub_items),
            });
            setSubHeaderOpen(true);
        }
    };

    const handleMouseLeave = () => {
        setTimeout(() => {
            if (!isSubMenuHovered) {
                setItemHover(null);
                setSubHeaderOpen(false);
            }
        }, 1500);
    };
    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const data = await adminService.getMenuItems();
                setMenuItems(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchMenuItems();
    }, []);


    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    const handleKeyDown = (e: InputElementProps) => {
        if (isFocused && e.key === 'Enter') {
            window.location.href = `${window.location.origin}/search/${inputSearch}`;
        }
    };

    const handleSubHeaderMouseEnter = () => {
        setIsSubMenuHovered(true);
    };

    const handleSubHeaderMouseLeave = () => {
        setIsSubMenuHovered(false);
        setSubHeaderOpen(false);
    };
    if (window.location.href.includes("/admin")) {
        return null
    }

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
                            <Input
                                className="search-input"
                                value={inputSearch}
                                placeholder="Buscar por produtos"
                                onChange={(e) => setInputSearch(e.target.value)}
                                onKeyDown={handleKeyDown}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                            />
                        </div>
                    </section>

                    <section className="header-inside-content header-inside-content__logo">
                        <Link to={window.location.origin} target="_parent">
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
                        {menuItems.length > 0 ? (
                            menuItems.map((categoria) => (
                                <article
                                    key={categoria.title}
                                    className="redirect-item-content redirect-item-content__gifts"
                                    onMouseEnter={() => handleMouseEnter(categoria)}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    <Link
                                        target={categoria.is_link === 1 ? "_parent" : "_parent"}
                                        to={
                                            categoria.is_link === 0
                                                ? window.location.origin + categoria.href
                                                : (categoria.href ? window.location.origin + categoria.href : "javascript:;")
                                        }
                                    >
                                        <span>{categoria.title.toUpperCase()}</span>
                                    </Link>
                                </article>
                            ))
                        ) : (
                            <p>Carregando menu...</p>
                        )}
                    </div>
                </nav>

            </header>

            <header className="header-application-mobile header-application__wrapper">
                <div className="header-app-top-content header-app-top-content__wrapper">
                    <section className="header-inside-content header-inside-content__search">
                        <MenuComponent
                            logoHeader={logoHeader}
                            menuItems={menuItems}
                            hasFooter={true}
                        />
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
                        <Link to={window.location.origin} target="_parent">
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
                                <Input value={inputSearch}
                                    placeholder="Buscar por produtos"
                                    onChange={(e) => setInputSearch(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur} />
                                <Button onClick={() => window.location.href = `${window.location.origin}/search/${inputSearch}`} className="search-btn" variant={"outline"}>
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
