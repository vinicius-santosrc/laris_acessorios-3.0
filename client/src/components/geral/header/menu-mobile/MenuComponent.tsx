import { DrawerDescription } from "@chakra-ui/react"
import { Button } from "../../../../components/ui/button"
import { DrawerBackdrop, DrawerBody, DrawerCloseTrigger, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerRoot } from "../../../../components/ui/drawer"
import { ChevronRightIcon, ContactIcon, HeartIcon, MenuIcon, User2Icon, ChevronLeftIcon } from "lucide-react"
import React, { useState } from "react"
import { Link } from "react-router-dom"

interface MenuComponentProps {
    logoHeader: string;
    menuItems: any[];
    hasFooter: boolean;
}

const MenuComponent: React.FC<MenuComponentProps> = ({ logoHeader, menuItems, hasFooter }) => {
    const [isMainDrawerOpen, setIsMainDrawerOpen] = useState<boolean>(false);
    const [isSubDrawerOpen, setIsSubDrawerOpen] = useState<boolean>(false);
    const [activeCollection, setActiveCollection] = useState<string | null>(null);

    const closeMainDrawer = () => {
        setIsMainDrawerOpen(false);
    }

    const openSubDrawer = (collection: string) => {
        setActiveCollection(collection);
        setIsSubDrawerOpen(true);
    }

    const closeSubDrawer = () => {
        setIsSubDrawerOpen(false);
        setActiveCollection(null);
    }

    const FooterHeader = () => {
        if(!hasFooter) return
        return (
            <DrawerFooter>
                <section className="footer-drawer">
                    <div className="footer-drawer-content">
                        <Link to={window.location.origin + "/account"} onClick={closeMainDrawer} className="item-footer">
                            <User2Icon />
                            <p>Minha conta</p>
                        </Link>
                        <Link to={window.location.origin + "/account#wishlist"} onClick={closeMainDrawer} className="item-footer">
                            <HeartIcon />
                            <p>Lista de desejos</p>
                        </Link>
                        <Link to={window.location.origin} onClick={closeMainDrawer} className="item-footer">
                            <ContactIcon />
                            <p>Entre em contato</p>
                        </Link>
                    </div>
                </section>
            </DrawerFooter>
        )
    }

    return (
        <>
            {/* Menu Principal Drawer */}
            <Button variant="ghost" aria-label="Menu">
                <DrawerRoot
                    placement={"start"}
                    size={"full"}
                    open={isMainDrawerOpen}
                    onOpenChange={() => setIsMainDrawerOpen(!isMainDrawerOpen)}
                >
                    <DrawerBackdrop />
                    <DrawerTrigger>
                        <Button variant="ghost" aria-label="Menu">
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
                                    if (item.isLink) {
                                        return (
                                            <Link onClick={closeMainDrawer} to={item.href || "javascript:;"} key={id}>
                                                <div className="drawer-menu__item">
                                                    <div>
                                                        <p>{item.title}</p>
                                                    </div>
                                                    <div>
                                                        <ChevronRightIcon />
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    } else {
                                        return (
                                            <div key={id}>
                                                <div className="drawer-menu__item" onClick={() => openSubDrawer(item.title)}>
                                                    <div>
                                                        <p>{item.title}</p>
                                                    </div>
                                                    <div>
                                                        <ChevronRightIcon />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                })}
                            </section>
                        </DrawerBody>
                        <FooterHeader />
                    </DrawerContent>
                </DrawerRoot>
                {/* Coleção Submenu Drawer */}
                <DrawerRoot
                    placement={"end"}
                    size={"full"}
                    open={isSubDrawerOpen}
                    onOpenChange={() => setIsSubDrawerOpen(!isSubDrawerOpen)}
                >
                    <DrawerBackdrop />
                    <DrawerTrigger />
                    <DrawerContent className="drawer-header-component sub-menu-drawer">
                        <DrawerHeader className="drawer-header-component__header">
                            <DrawerHeader className="drawer-header-component__header">
                                <DrawerCloseTrigger />
                                <DrawerTitle left={"0"} right={"0"} margin={"auto"} justifyContent={"center"}>
                                    <img className="imageWrapper" src={logoHeader} alt="LARIS ACESSÓRIOS" />
                                </DrawerTitle>
                                <DrawerDescription style={{ textAlign: "center" }}>{activeCollection}</DrawerDescription>
                            </DrawerHeader>
                        </DrawerHeader>
                        <DrawerBody className="drawer-header-component__body">
                            <section className="drawer-menu-items">
                                {menuItems
                                    .find(item => item.title === activeCollection)
                                    ?.subItems.map((subItem: any, subId: number) => (
                                        <Link onClick={closeSubDrawer} to={subItem.href || "javascript:;"} key={subId}>
                                            <div className="drawer-menu__item">
                                                <div>
                                                    <p>{subItem.title}</p>
                                                </div>
                                                <div>
                                                    <ChevronRightIcon />
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                            </section>
                        </DrawerBody>
                        {hasFooter && <FooterHeader />}
                    </DrawerContent>
                </DrawerRoot>
            </Button>
        </>
    )
}

export default MenuComponent;
