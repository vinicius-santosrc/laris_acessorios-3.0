import { Button } from "../../../../components/ui/button"
import { DrawerBackdrop, DrawerBody, DrawerCloseTrigger, DrawerContent, DrawerFooter, DrawerHeader, DrawerRoot, DrawerTitle, DrawerTrigger } from "../../../../components/ui/drawer"
import { ChevronRightIcon, ContactIcon, HeartIcon, MenuIcon, User2Icon } from "lucide-react"
import React, { useState } from "react"
import { Link } from "react-router-dom"

interface MenuComponentProps {
    logoHeader: string,
    menuItems: any[]
}

const MenuComponent: React.FC<MenuComponentProps> = ({ logoHeader, menuItems }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const closeDrawer = () => {
        setIsOpen(false);
    }

    return (
        <Button variant="ghost" aria-label="Menu">
            <DrawerRoot
                placement={"start"}
                size={"full"}
                open={isOpen}
                onOpenChange={() => setIsOpen(!isOpen)}
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
                                    <Link onClick={() => closeDrawer()} to={item.href || "javascript:;"} key={id}>
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
    )
}

export default MenuComponent;