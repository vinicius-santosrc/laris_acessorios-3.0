import { cartService } from "../../../../services/cartService";
import { AccountIcon, SacolaIcon } from "../../../../components/icons/icons"
import { Button } from "../../../../components/ui/button"
import { DrawerBackdrop, DrawerBody, DrawerCloseTrigger, DrawerContent, DrawerFooter, DrawerHeader, DrawerRoot, DrawerTitle, DrawerTrigger } from "../../../../components/ui/drawer"
import React from "react"
import { Product } from "../../../../models/product";

interface BagComponentProps {
    setBagOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isBagOpen: boolean;
}

const BagComponent: React.FC<BagComponentProps> = ({ setBagOpen, isBagOpen }) => {
    const bagItems = cartService.get();

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
                    {bagItems.length === 0 ? (
                        <section className="empty-bag">
                            <h2>Sua sacola está vazia.</h2>
                            <p>Adicione produtos à sacola para finalizar a compra.</p>
                            <Button className="btn-empty-bag">Escolher suas joias</Button>
                        </section>
                    ) : (
                        <section className="bag-items">
                            {bagItems.map((item: Product) => (
                                <div key={item.id + item.size} className="bag-item">
                                    <div className="bag-item__details">
                                        <p className="bag-item__name">{item.name_product}</p>
                                        <p className="bag-item__size">Tamanho: {item.size}</p>
                                        <p className="bag-item__price">{`R$ ${item.price.toFixed(2)}`}</p>
                                    </div>
                                    <Button
                                        onClick={() => cartService.remove(item.id)}
                                        variant="ghost"
                                        aria-label="Remover item da sacola"
                                    >
                                        Remover
                                    </Button>
                                </div>
                            ))}
                        </section>
                    )}
                </DrawerBody>
                <DrawerFooter />
            </DrawerContent>
        </DrawerRoot>
    )
}

export default BagComponent;