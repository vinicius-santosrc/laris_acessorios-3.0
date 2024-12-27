import { useState } from "react"
import TopBarComponent from "./topbar-component/TopBarComponent"
import logoHeader from "../../../images/logo.svg"
import { AccountIcon, FavoritesIcon, SearchIcon } from "../../icons/icons"
import "./Header.css"
import { Link } from "react-router-dom"
import { Button } from "../../ui/button"
import { Image, Input } from "@chakra-ui/react"
import { menuItems, MenuItemsProps } from "../../../lib/utils"
import BagComponent from "./bag-component/BagComponent"
import MenuComponent from "./menu-mobile/MenuComponent"

const Header = () => {
    const [isBagOpen, setBagOpen] = useState<boolean>(false);
    const [isSearchBoxOpen, setSearchbox] = useState<boolean>(false);

    return (
        <div className="header-full-component">
            <TopBarComponent
                text="Compre pelo WhatsApp +55 35 99739-4181"
            />
            <header className="header-application header-application__wrapper">
                <div className="header-app-top-content header-app-top-content__wrapper">
                    <section className="header-inside-content header-inside-content__search">
                        <div className="search-box-area search-box-area__wrapper">
                            <SearchIcon />
                            <Input className="search-input" placeholder="Buscar por produtos" />
                        </div>
                    </section>

                    <section className="header-inside-content header-inside-content__logo">
                        <Link to={window.location.origin}><Image src={logoHeader} alt="Logotipo" className="logo-image" /></Link>
                    </section>

                    <section className="header-inside-content header-inside-content__icons">
                        <Button variant="ghost" aria-label="Conta">
                            <AccountIcon />
                        </Button>
                        <Button variant="ghost" aria-label="Favoritos">
                            <FavoritesIcon />
                        </Button>
                        <BagComponent setBagOpen={setBagOpen} isBagOpen={isBagOpen} />
                    </section>
                </div>



                <nav className="header-app-bottom-content header-app-bottom-content__wrapper">
                    <div className="header-inside-bottom-content header-inside-bottom-content__redirects">
                        {menuItems.map((categoria: MenuItemsProps) => {
                            return (
                                <article key={categoria.title} className="redirect-item-content redirect-item-content__gifts">
                                    <Button onClick={() => categoria.isLink ? window.location.href = categoria.href : "javascript:;"}>{categoria.title}</Button>
                                </article>
                            )
                        })}
                    </div>
                </nav>
            </header>
            <header className="header-application-mobile header-application__wrapper">
                <div className="header-app-top-content header-app-top-content__wrapper">
                    <section className="header-inside-content header-inside-content__search">
                        <MenuComponent logoHeader={logoHeader} menuItems={menuItems} />
                        <Button onClick={() => { setSearchbox(!isSearchBoxOpen) }} variant="ghost" aria-label="Buscar">
                            <SearchIcon />
                        </Button>
                    </section>

                    <section className="header-inside-content header-inside-content__logo">
                        <Link to={window.location.origin}><Image src={logoHeader} alt="Logotipo" className="logo-image" /></Link>
                    </section>

                    <section className="header-inside-content header-inside-content__icons">
                        <Button variant="ghost" aria-label="Conta">
                            <AccountIcon />
                        </Button>
                        <BagComponent setBagOpen={setBagOpen} isBagOpen={isBagOpen} />
                    </section>
                </div>

                {isSearchBoxOpen &&
                    <section className="search-box-wrapper-mobile">
                        <div className="search-box-wrapper-inside">
                            <div className="search-btn-inside search-form">
                                <Input className="search-input" placeholder="Buscar produtos" />
                                <Button className="search-btn" variant={"outline"}>BUSCAR</Button>
                            </div>
                        </div>
                    </section>
                }

                <nav className="header-app-bottom-content header-app-bottom-content__wrapper">
                    <div className="header-inside-bottom-content header-inside-bottom-content__redirects">
                        <article className="redirect-item-content redirect-item-content__gifts">
                            <Button>Presentes</Button>
                        </article>
                        <article className="redirect-item-content redirect-item-content__launches">
                            <Button>Lançamentos</Button>
                        </article>
                        <article className="redirect-item-content redirect-item-content__jewels">
                            <Button>Joias</Button>
                        </article>
                        <article className="redirect-item-content redirect-item-content__semi-jewels">
                            <Button>Semijoias</Button>
                        </article>
                        <article className="redirect-item-content redirect-item-content__accessories">
                            <Button>Acessórios</Button>
                        </article>
                        <article className="redirect-item-content redirect-item-content__collections">
                            <Button>Coleções</Button>
                        </article>
                        <article className="redirect-item-content redirect-item-content__black-friday">
                            <Button>Black Friday</Button>
                        </article>
                    </div>
                </nav>
            </header>
        </div>
    )
}

export default Header
