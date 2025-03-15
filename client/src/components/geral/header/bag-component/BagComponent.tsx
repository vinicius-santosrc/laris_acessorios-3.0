import { cartService } from "../../../../services/cartService";
import { SacolaIcon } from "../../../../components/icons/icons";
import { Button } from "../../../../components/ui/button";
import { DrawerBackdrop, DrawerBody, DrawerCloseTrigger, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerRoot, DrawerTrigger } from "../../../../components/ui/drawer";
import React, { useEffect, useState } from "react";
import { Product } from "../../../../models/product";
import { TrashIcon } from "lucide-react";
import { DataListItem, DataListRoot } from "../../../../components/ui/data-list";
import productService from "../../../../services/productService";

interface BagComponentProps {
    setBagOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isBagOpen: boolean;
}

const BagComponent: React.FC<BagComponentProps> = ({ setBagOpen, isBagOpen }) => {
    const [bagItems, setBagItems] = useState<Product[]>([]);

    useEffect(() => {
        const fetchBagItems = async () => {
            const items = await cartService.get();
            const products = await Promise.all(
                items.map(async (item) => {
                    const product = await productService.getById(item.id);
                    return { ...product, size: item.size };
                })
            );
            setBagItems(products);
        };
        fetchBagItems();
    }, [isBagOpen]);

    const handleRemove = async (productId: any) => {
        await cartService.remove(productId);
        setBagItems(await cartService.get());
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
                        <Button onClick={finalizeBtn} className="finalizeBtn">FINALIZAR COMPRA</Button>
                    </DrawerFooter>
                )}
                <DrawerCloseTrigger />
            </DrawerContent>
        </DrawerRoot>
    );
};

export default BagComponent;
