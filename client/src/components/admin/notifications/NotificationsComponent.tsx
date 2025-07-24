/**
 * Creation Date: 23/07/2025
 * Author: Vinícius da Silva Santos
 * Coordinator: Larissa Alves de Andrade Moreira
 * Developed by: Lari's Acessórios Team
 * Copyright 2025, LARI'S ACESSÓRIOS
 * All rights are reserved. Reproduction in whole or part is prohibited without the written consent of the copyright owner.
*/

import { Button } from "../../../components/ui/button";
import { DataListRoot } from "../../../components/ui/data-list";
import { DrawerBackdrop, DrawerBody, DrawerCloseTrigger, DrawerContent, DrawerFooter, DrawerHeader, DrawerRoot, DrawerTitle, DrawerTrigger } from "../../../components/ui/drawer";
import { Bell, TrashIcon } from "lucide-react";
import { useState } from "react";

interface BagComponentProps {
    setBagOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isBagOpen: boolean;
}

const NotificationsComponent: React.FC<BagComponentProps> = ({ setBagOpen, isBagOpen }) => {
    const [bagItems, setBagItems] = useState<any>("");

    return (
        <DrawerRoot>
            <DrawerBackdrop />
            <DrawerTrigger>
                <Button onClick={() => setBagOpen(!isBagOpen)} variant="ghost" aria-label="Notificações">
                    <Bell />
                </Button>
            </DrawerTrigger>
            <DrawerContent className="drawer-header-component">
                <DrawerHeader className="drawer-header-component__header">
                    <DrawerTitle>Notificações</DrawerTitle>
                </DrawerHeader>
                <DrawerBody className="drawer-header-component__body">
                    {bagItems.length === 0 ? (
                        <section className="empty-bag">
                            <h2>Nenhuma notificação por enquanto.</h2>
                            <p>Aqui aparecerão as notificações para todos os administradores da plataforma.</p>
                        </section>
                    ) : (
                        <section className="bag-items">
                            {bagItems.map((item: any) => {
                                const priceWithDiscount = item.price - item.desconto;
                                return (
                                    <div key={item.id + item.size} className="bag-item">
                                        <div className="image-bag-item">
                                            <img src={JSON.parse(item.photoURL)[0]} alt={item.name_product} />
                                        </div>
                                        <div className="bag-item__details">
                                            <p className="bag-item__name">{item.name_product}</p>
                                            <p className="bag-item__size">Tamanho: {item.size}</p>
                                            <p className="bag-item__price">
                                                {`R$ ${priceWithDiscount.toFixed(2)}`}
                                            </p>
                                        </div>
                                        <div>
                                            <Button
                                                variant="ghost"
                                                aria-label="Remover item da sacola"
                                            >
                                                <TrashIcon size={16} />
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </section>
                    )}
                </DrawerBody>
                {bagItems.length === 0 ? null :
                    <DrawerFooter className="footerBag">
                        <DataListRoot unstyled size={"md"} width={"full"} className="footerItems" orientation="horizontal">
                           
                        </DataListRoot>
                        <Button className="finalizeBtn">FINALIZAR COMPRA</Button>
                    </DrawerFooter>
                }
                <DrawerCloseTrigger />
            </DrawerContent>
        </DrawerRoot>
    );
}

export default NotificationsComponent;
