import { useState } from "react"
import TopBarComponent from "./topbar-component/TopBarComponent"
import logoHeader from "../../../images/logo.svg"
import { AccountIcon, FavoritesIcon, SacolaIcon, SearchIcon } from "../../icons/icons"
import "./Header.css"
import { Link } from "react-router-dom"
import { ChevronRightIcon, ContactIcon, HeartIcon, MenuIcon, User2Icon } from "lucide-react"
import { Button } from "../../ui/button"
import { Image, Input } from "@chakra-ui/react"
import { DrawerBackdrop, DrawerBody, DrawerCloseTrigger, DrawerContent, DrawerFooter, DrawerHeader, DrawerRoot, DrawerTitle, DrawerTrigger } from "../../../components/ui/drawer"
import { menuItems } from "../../../lib/utils"

const Header = () => {
    const [isBagOpen, setBagOpen] = useState<boolean>(false);

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
                        <DrawerRoot>
                            <DrawerBackdrop />
                            <DrawerTrigger>
                                <Button onClick={() => setBagOpen(!isBagOpen)} variant="ghost" aria-label="Sacola de Compras">
                                    <SacolaIcon />
                                </Button>
                            </DrawerTrigger>
                            <DrawerContent className="drawer-header-component">
                                <DrawerCloseTrigger />
                                <DrawerHeader className="drawer-header-component__header">
                                    <DrawerTitle>Meus acessórios</DrawerTitle>
                                </DrawerHeader>
                                <DrawerBody className="drawer-header-component__body">
                                    <section className="empty-bag">
                                        <h2>Sua sacola está vazia.</h2>
                                        <p>Adicione produtos à sacola para finalizar a compra.</p>
                                        <Button className="btn-empty-bag">Escolher suas joias</Button>
                                    </section>
                                </DrawerBody>
                                <DrawerFooter />
                            </DrawerContent>
                        </DrawerRoot>
                    </section>
                </div>



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
            <header className="header-application-mobile header-application__wrapper">
                <div className="header-app-top-content header-app-top-content__wrapper">
                    <section className="header-inside-content header-inside-content__search">
                        <Button variant="ghost" aria-label="Menu">
                            <DrawerRoot
                                placement={"start"}
                                size={"full"}
                            >
                                <DrawerBackdrop />
                                <DrawerTrigger>
                                    <Button variant="ghost" aria-label="Sacola de Compras">
                                        <MenuIcon size={22} />
                                    </Button>
                                </DrawerTrigger>
                                <DrawerContent className="drawer-header-component">
                                    <DrawerHeader className="drawer-header-component__header">
                                        <DrawerCloseTrigger />
                                        <DrawerTitle left={"0"} right={"0"} margin={"auto"} justifyContent={"center"}>
                                            <img className="imageWrapper" src={logoHeader} alt="LARIS ACESSÓRIOS" />
                                        </DrawerTitle>
                                    </DrawerHeader>
                                    <DrawerBody className="drawer-header-component__body">
                                        <section className="drawer-menu-items">
                                            {menuItems.map((item, id) => {
                                                return (
                                                    <Link to={item.href || "javascript:;"} key={id}>
                                                        <div className="drawer-menu__item">
                                                            <div>
                                                                <p>{item.title}</p>
                                                            </div>
                                                            <div>
                                                                <ChevronRightIcon />
                                                            </div>
                                                        </div>
                                                    </Link>
                                                )
                                            })}
                                        </section>
                                    </DrawerBody>
                                    <DrawerFooter>
                                        <section className="footer-drawer">
                                            <div className="footer-drawer-content">
                                                <div className="item-footer">
                                                    <User2Icon />
                                                    <p>Minha conta</p>
                                                </div>
                                                <div className="item-footer">
                                                    <HeartIcon />
                                                    <p>Lista de desejos</p>
                                                </div>
                                                <div className="item-footer">
                                                    <ContactIcon />
                                                    <p>Entre em contato</p>
                                                </div>
                                            </div>
                                        </section>
                                    </DrawerFooter>
                                </DrawerContent>
                            </DrawerRoot>
                        </Button>
                        <Button variant="ghost" aria-label="Buscar">
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
                        <DrawerRoot>
                            <DrawerBackdrop />
                            <DrawerTrigger>
                                <Button onClick={() => setBagOpen(!isBagOpen)} variant="ghost" aria-label="Sacola de Compras">
                                    <SacolaIcon />
                                </Button>
                            </DrawerTrigger>
                            <DrawerContent className="drawer-header-component">
                                <DrawerCloseTrigger />
                                <DrawerHeader className="drawer-header-component__header">
                                    <DrawerTitle>Meus acessórios</DrawerTitle>
                                </DrawerHeader>
                                <DrawerBody className="drawer-header-component__body">
                                    <section className="empty-bag">
                                        <h2>Sua sacola está vazia.</h2>
                                        <p>Adicione produtos à sacola para finalizar a compra.</p>
                                        <Button className="btn-empty-bag">Escolher suas joias</Button>
                                    </section>
                                </DrawerBody>
                                <DrawerFooter />
                            </DrawerContent>
                        </DrawerRoot>
                    </section>
                </div>

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
