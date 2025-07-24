/**
 * Creation Date: 23/07/2025
 * Author: Vinícius da Silva Santos
 * Coordinator: Larissa Alves de Andrade Moreira
 * Developed by: Lari's Acessórios Team
 * Copyright 2025, LARI'S ACESSÓRIOS
 * All rights are reserved. Reproduction in whole or part is prohibited without the written consent of the copyright owner.
*/

import { CartRepository } from "../../../../repositories/cart";
import { SacolaIcon } from "../../../../components/icons/icons";
import { Button } from "../../../../components/ui/button";
import { DrawerBackdrop, DrawerBody, DrawerCloseTrigger, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerRoot, DrawerTrigger } from "../../../../components/ui/drawer";
import React, { useEffect, useState } from "react";
import { Product } from "../../../../models/product";
import { TrashIcon } from "lucide-react";
import { DataListItem, DataListRoot } from "../../../../components/ui/data-list";
import ProductRepository from "../../../../repositories/product";
import AccountComponent from "../account-component/AccountComponent";
import AuthRepository from "../../../../repositories/auth";

interface BagComponentProps {
    setBagOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isBagOpen: boolean;
}

const BagComponent: React.FC<BagComponentProps> = ({ setBagOpen, isBagOpen }) => {
    const [bagItems, setBagItems] = useState<Product[]>([]);
    const [isLogged, setIsLogged] = useState(false);

    const authRepo = new AuthRepository();
    const productRepo = new ProductRepository();
    const cartRepo = new CartRepository();

    useEffect(() => {
        checkIfIsLogged()
        const fetchBagItems = async () => {
            const items = await cartRepo.get();
            const products = await Promise.all(
                items.map(async (item) => {
                    const product = await productRepo.getById(item.id);
                    return { ...product, size: item.size };
                })
            );
            setBagItems(products);
        };
        fetchBagItems();
    }, [isBagOpen]);

    async function checkIfIsLogged() {
        const isLogged: boolean = await authRepo.isLogged();
        setIsLogged(isLogged)
    }

    const handleRemove = async (productId: any) => {
        await cartRepo.remove(productId);
        setBagItems(await cartRepo.get());
    };

    const subtotal = bagItems.reduce((acc, item) => {
        const priceWithDiscount = item.price;
        return acc + priceWithDiscount;
    }, 0);

    const totalDiscount = bagItems.reduce((acc, item) => {
        return acc + item.desconto;
    }, 0);

    const finalizeBtn = () => {
        window.location.href = window.location.origin + "/checkout";
    };

    const total = subtotal - totalDiscount;

    const stats = [
        { label: "SUBTOTAL", value: `R$ ${subtotal.toFixed(2)}`, helpText: "Valor dos pedidos" },
        { label: "DESCONTO", value: `R$ ${totalDiscount.toFixed(2)}`, helpText: "Valor dos descontos" },
        { label: "TOTAL", value: `R$ ${total.toFixed(2)}`, helpText: "Valor total da compra" },
    ];

    return (
        <DrawerRoot size={"xs"}>
            <DrawerBackdrop />
            <DrawerTrigger>
                <Button onClick={() => setBagOpen(!isBagOpen)} variant="ghost" aria-label="Sacola de Compras">
                    <SacolaIcon />
                </Button>
            </DrawerTrigger>
            <DrawerContent className="drawer-header-component">
                <DrawerHeader className="drawer-header-component__header">
                    <DrawerTitle>{bagItems.length === 0 ? "MEUS ACESSÓRIOS" : `MINHA SACOLA (${bagItems.length})`}</DrawerTitle>
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
                            {bagItems.map((item: Product) => {
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
                                                {item.desconto > 0 ?
                                                    <><s style={{ color: "gray" }}> {`R$ ${item.price.toFixed(2)}`}</s><br></br>{`R$ ${priceWithDiscount.toFixed(2)}`}</>
                                                    :
                                                    <>{`R$ ${priceWithDiscount.toFixed(2)}`}</>
                                                }
                                            </p>
                                        </div>
                                        <div>
                                            <Button
                                                onClick={() => handleRemove(item.id)}
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
                {bagItems.length === 0 ? null : (
                    <DrawerFooter className="footerBag">
                        <DataListRoot unstyled size={"md"} width={"full"} className="footerItems" orientation="horizontal">
                            {stats.map((item) => (
                                <DataListItem className="itemFooter" key={item.label} label={item.label} value={item.value} />
                            ))}
                        </DataListRoot>
                        {!isLogged ?
                            <AccountComponent checkoutBtn={true} />
                            :
                            <Button onClick={finalizeBtn} aria-label="Ir para checkout" className="finalizeBtn">FINALIZAR COMPRA</Button>
                        }
                    </DrawerFooter>
                )}
                <DrawerCloseTrigger />
            </DrawerContent>
        </DrawerRoot>
    );
};

export default BagComponent;
