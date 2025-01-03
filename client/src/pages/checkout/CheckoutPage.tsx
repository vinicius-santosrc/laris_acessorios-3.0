import React, { useEffect, useState } from "react";
import "../../styles/checkout.css";
import { DataListItem, DataListRoot } from "../../components/ui/data-list";
import { Edit, ShoppingCartIcon, Trash2Icon } from "lucide-react";
import { Product } from "../../models/product";
import { Button } from "../../components/ui/button";
import { StepsCompletedContent, StepsContent, StepsItem, StepsList, StepsNextTrigger, StepsRoot } from "../../components/ui/steps";
import { Input } from "@chakra-ui/react";
import { LuCalendar, LuUser, LuWallet } from "react-icons/lu";
import { SelectContent, SelectItem, SelectLabel, SelectRoot, SelectTrigger, SelectValueText } from "../../components/ui/select";
import { paymentsMethods } from "../../lib/utils";

const CheckoutPage = () => {
    const [step, setStep] = useState<number>(0);
    const [items, setItems] = useState<any[]>([]);
    const [subtotal, setSubtotal] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);
    const [desconto, setDesconto] = useState<number>(0);
    const [cep, setCep] = useState<string>("");

    const [shippingDays, setShippingDays] = useState<number | null>(null);
    const [shippingCost, setShippingCost] = useState<number | null>(null);
    const [isCepValid, setIsCepValid] = useState<boolean>(false);

    // States for Step 2
    const [email, setEmail] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [surname, setSurname] = useState<string>("");
    const [address, setAddress] = useState<string>("");

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    const checkMobile = () => {
        setIsMobile(window.innerWidth <= 768);
    };

    useEffect(() => {
        window.addEventListener('resize', checkMobile);

        return () => {
            window.removeEventListener('resize', checkMobile);
        };
    }, []);

    useEffect(() => {
        const storedItems = localStorage.getItem("sacola");

        if (storedItems) {
            try {
                const parsedItems = JSON.parse(storedItems);
                if (Array.isArray(parsedItems)) {
                    setItems(parsedItems);
                    calculateTotal(parsedItems);
                } else {
                    console.warn("Formato de dados inválido para os itens da sacola");
                }
            } catch (error) {
                console.error("Erro ao parsear os itens da sacola", error);
            }
        }
    }, []);

    const calculateTotal = (items: any[]) => {
        const newSubtotal = items.reduce((acc, item) => acc + (item.price - (item.desconto || 0)), 0);
        setSubtotal(newSubtotal);
        const deliveryCost = shippingCost || 0;
        setTotal(newSubtotal + deliveryCost);
    };

    const removeItemFromCart = (itemId: any) => {
        const updatedItems = items.filter(item => item.id !== itemId);
        setItems(updatedItems);
        localStorage.setItem("sacola", JSON.stringify(updatedItems));
        calculateTotal(updatedItems);
    };

    const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputCep = e.target.value;
        setCep(inputCep);
    };

    const fetchShippingInfo = async () => {
        if (cep.length !== 8) {
            setIsCepValid(false);
            return;
        }

        setIsCepValid(true);

        try {
            const shippingDays = Math.floor(Math.random() * 10) + 1;
            const shippingCost = 10.0;

            setShippingDays(shippingDays);
            setShippingCost(shippingCost);
            calculateTotal(items);
        } catch (error) {
            console.error("Erro ao buscar informações de entrega", error);
        }
    };

    const handleFinalizePurchase = () => {
        if (step == 1) {
            return setStep(2);
        }

        const purchaseData = {
            email,
            name,
            surname,
            address,
            items,
            shipping: {
                cep,
                shippingDays,
                shippingCost,
            },
            subtotal,
            total,
            desconto,
        };

        console.log("Dados da compra:", JSON.stringify(purchaseData, null, 2));
    };

    return (
        <section className="checkout-page-wrapper">
            <StepsRoot defaultValue={0} aria-valuenow={step + 1} count={3} color={"black"}>
                {!isMobile &&
                    <StepsList>
                        <StepsItem index={0} icon={<LuUser />} className="item-step" color={"black"} title="Dados pessoais" description="Dados pessoais" />
                        <StepsItem index={1} icon={<LuWallet />} className="item-step" color={"black"} title="Pagamento" description="Escolha a forma de pagamento" />
                        <StepsItem index={2} icon={<LuCalendar />} className="item-step" color={"black"} title="Revisão do pedido" description="Revisão final do pedido" />
                    </StepsList>
                }

                <div className="checkout-page-inside">
                    <div className="checkout-content">
                        <div className="checkout-header">
                            <h1>Meu carrinho</h1>
                        </div>
                        <div className="checkout-grid-component">
                            <StepsContent index={0}>
                                <div className="checkout-grid__inside_left">
                                    <div className="box-checkout">
                                        <div className="box-checkout__header">
                                            <label>Lista de itens</label>
                                            <div className="items-component-checkout">
                                                {items.map((item: Product) => {
                                                    const photosProduct = JSON.parse(item.photoURL);
                                                    return (
                                                        <div className="item-cart-box" key={item.id}>
                                                            <div className="item-cart-box__inside">
                                                                <div className="item-info">
                                                                    <div className="item-left-side">
                                                                        <img src={photosProduct.length > 1 ? photosProduct[0] : photosProduct} alt={item.name_product} />
                                                                    </div>
                                                                    <div className="item-right-side">
                                                                        <h1>{item.name_product} - {item.size}</h1>
                                                                        <p>{item.type_full_label}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="item-middle">
                                                                    <h1>R$ {(item.price - item.desconto).toFixed(2)}</h1>
                                                                    <div className="item-right">
                                                                        <Button onClick={() => removeItemFromCart(item.id)}><Trash2Icon /></Button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="box-checkout">
                                        <div className="box-checkout__header">
                                            <div className="title-box-checkout">
                                                <label id="title">Dados pessoais</label>
                                            </div>
                                            <div className="items-component-checkout">
                                                <div className="inputbox">
                                                    <label>E-mail</label>
                                                    <Input placeholder="Insira o e-mail aqui" background={"#f7f7f7"} padding={2} variant={"subtle"} />
                                                </div>
                                                <div className="inputbox">
                                                    <label>Nome completo</label>
                                                    <Input placeholder="Insira o nome completo aqui" background={"#f7f7f7"} padding={2} variant={"subtle"} />
                                                </div>
                                                <div className="inputbox">
                                                    <label>CPF</label>
                                                    <Input placeholder="Insira o cpf aqui" background={"#f7f7f7"} padding={2} variant={"subtle"} />
                                                </div>
                                                <div className="inputbox">
                                                    <label>Telefone para contato</label>
                                                    <Input placeholder="Insira o telefone aqui" background={"#f7f7f7"} padding={2} variant={"subtle"} />
                                                </div>
                                            </div>

                                            <div className="title-box-checkout" style={{ marginTop: 20 }}>
                                                <label id="title">Entrega</label>
                                            </div>
                                            <div className="items-component-checkout">
                                                {isCepValid ? (
                                                    <>
                                                        <label><b>Receber</b> {items.length} itens em <span>{cep}</span> <Button onClick={() => { setIsCepValid(false) }}><Edit /></Button></label>
                                                        <div className="typeAddressSelected">
                                                            <div className="addressItem">
                                                                <div className="addressItem__insideleft">
                                                                    <p>Correios</p>
                                                                    <p>Em até {shippingDays} dias úteis</p>
                                                                </div>
                                                                <div className="addressItem__insideright">
                                                                    <p>R$ {shippingCost?.toFixed(2)}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div>
                                                        <Input
                                                            type="text"
                                                            placeholder="Digite o CEP"
                                                            value={cep}
                                                            onChange={handleCepChange}
                                                            onBlur={fetchShippingInfo}
                                                            background={"#f7f7f7"}
                                                            padding={2}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </StepsContent>
                            <div className="checkout-grid__inside_right">
                                <div className="box-checkout-right">
                                    <div className="checkout-box-right-header">
                                        <h1>Resumo da compra</h1>
                                    </div>
                                    <div className="data-list-prices">
                                        <DataListRoot unstyled size={"md"} width={"full"} className="item-data-list" orientation="horizontal">
                                            <DataListItem className="item-data-list-prices" label={"Subtotal"} value={"R$ " + subtotal.toFixed(2)} />
                                            <DataListItem className="item-data-list-prices" label={"Desconto"} value={"R$ " + desconto.toFixed(2)} />
                                            <DataListItem className="item-data-list-prices" label={"Entrega"} value={"Grátis"} />
                                            <DataListItem className="item-data-list-prices-principal" label={"Total"} value={"R$ " + total.toFixed(2)} />
                                        </DataListRoot>
                                        <div className="actions-buttons">
                                            <button className="finalize-btn" onClick={handleFinalizePurchase}>
                                                {step != 2 ?
                                                    <StepsNextTrigger>
                                                        <span>PROSSEGUIR PARA COMPRA</span>
                                                    </StepsNextTrigger>
                                                    :
                                                    <React.Fragment>
                                                        <ShoppingCartIcon />
                                                        <span>Finalizar compra</span>
                                                    </React.Fragment>
                                                }
                                            </button>
                                            <button className="continue_buyingBtn">
                                                Continuar comprando
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <StepsContent index={1}>
                    <div className="box-checkout">
                        <div className="box-checkout__header">
                            <div className="title-box-checkout">
                                <label id="title">Pagamento</label>
                            </div>
                            <div className="items-component-checkout">
                            </div>

                            <div className="title-box-checkout" style={{ marginTop: 20 }}>
                                <label id="title">Entrega</label>
                            </div>
                            <div className="items-component-checkout">
                                <SelectRoot collection={paymentsMethods} size="sm" width="320px">
                                    <SelectLabel>Selecione o método de pagamento</SelectLabel>
                                    <SelectTrigger>
                                        <SelectValueText placeholder="Selecione o pagamento" />
                                    </SelectTrigger>
                                    <SelectContent background={"white"}>
                                        {paymentsMethods.items.map((paymentMethod: any) => (
                                            <SelectItem item={paymentMethod} key={paymentMethod.value}>
                                                {paymentMethod.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </SelectRoot>

                            </div>
                        </div>
                    </div>
                </StepsContent>
                <StepsContent index={2}>Step 3</StepsContent>
                <StepsCompletedContent>All steps are complete!</StepsCompletedContent>
            </StepsRoot>

        </section>
    )
}

export default CheckoutPage;
