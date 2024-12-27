import { AccountIcon, SacolaIcon } from "../../../../components/icons/icons"
import { Button } from "../../../../components/ui/button"
import { DrawerBackdrop, DrawerBody, DrawerCloseTrigger, DrawerContent, DrawerFooter, DrawerHeader, DrawerRoot, DrawerTitle, DrawerTrigger } from "../../../../components/ui/drawer"
import React from "react"

interface BagComponentProps {
    setBagOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isBagOpen: boolean;
}

const BagComponent: React.FC<BagComponentProps> = ({ setBagOpen, isBagOpen }) => {
    return (
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
    )
}

export default BagComponent;