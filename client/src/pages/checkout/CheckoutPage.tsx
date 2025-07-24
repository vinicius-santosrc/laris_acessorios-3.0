/**
 * Creation Date: 23/07/2025
 * Author: Vinícius da Silva Santos
 * Coordinator: Larissa Alves de Andrade Moreira
 * Developed by: Lari's Acessórios Team
 * Copyright 2025, LARI'S ACESSÓRIOS
 * All rights are reserved. Reproduction in whole or part is prohibited without the written consent of the copyright owner.
 */

import React, { useEffect, useState } from "react";
import "../../styles/checkout.css";
import { DataListItem, DataListRoot } from "../../components/ui/data-list";
import { Edit, ShoppingCartIcon, Trash2Icon } from "lucide-react";
import { Product } from "../../models/product";
import { Button } from "../../components/ui/button";
import { StepsContent, StepsItem, StepsList, StepsNextTrigger, StepsPrevTrigger, StepsRoot } from "../../components/ui/steps";
import { Checkbox, Input } from "@chakra-ui/react";
import { LuCalendar, LuUser, LuWallet } from "react-icons/lu";
import { SelectContent, SelectItem, SelectLabel, SelectRoot, SelectTrigger, SelectValueText } from "../../components/ui/select";
import { EnumPaymentMethod, formatCEP, formatCPF, formatTelefone, gerarUidComCaracteresENumeros, getCEPJson, parcelamentosDisponiveis, paymentInsideMethod, paymentsMethods } from "../../lib/utils";
import { toaster } from "../../components/ui/toaster";
import { Loader } from "../../components/ui/loader";
import { CepProps } from "../../models/cep";
import OrderRepository from "../../repositories/order";
import { PaymentElement } from "@stripe/react-stripe-js";
import { useElements, useStripe } from "@stripe/react-stripe-js";
import { OrderProps } from "../../models/order";
import { CartRepository } from "../../repositories/cart";
import ProductRepository from "../../repositories/product";
import Footer from "../../components/geral/footer/Footer";
import { ShippingRepository } from "../../repositories/shipping";
import { ShippingItem } from "@/models/shipping";
import { useUser } from "../../contexts/UserContext";
import { PaymentRepository } from "../../repositories/payment";

const CheckoutPage = ({ paymentMethodTypes, clientSecret }: any) => {
    const [step, setStep] = useState<number>(0);
    const [items, setItems] = useState<any[]>([]);
    const [subtotal, setSubtotal] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);
    const [desconto, setDesconto] = useState<number>(0);
    const [cep, setCep] = useState<string>("");

    const [shippingDays, setShippingDays] = useState<any>(null);
    const [shippingCost, setShippingCost] = useState<any>(null);
    const [isCepValid, setIsCepValid] = useState<boolean>(false);

    const [estado, setEstado] = useState<any>(null);
    const [cidade, setcidade] = useState<any>(null);
    const [bairro, setbairro] = useState<any>(null);
    const [endereco, setendereco] = useState<any>(null);
    const [numero, setnumero] = useState<any>(null);
    const [referencia, setreferencia] = useState<any>(null);

    // States for Step 0
    const [email, setEmail] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [cpf, setCPF] = useState<string>("");
    const [telefone, setTel] = useState<string>("");

    const [shippingDetails, setShippingDetails] = useState<ShippingItem[]>([]);
    const [shipMethodSelected, setShipMethod] = useState<ShippingItem>();

    //States for Step 1
    const [paymentMethodSelected, setPaymentMethodSelected] = useState<any>();
    const [parcelamento, setParcelamento] = useState<any>();

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    const [isLoading, setLoading] = useState(true);

    const { user, loading } = useUser();

    const stripe: any = useStripe();
    const elements: any = useElements();
    const [errorMessage, setErrorMessage] = useState<string>();

    const cartRepo = new CartRepository();
    const productRepo = new ProductRepository();
    const shippingRepo = new ShippingRepository();

    useEffect(() => {
        window.document.title = "Finalizar compra";
        PaymentRepository.createPaymentIntent(total, paymentMethodTypes)
            .then((clientSecret) => {
                // Armazenar ou utilizar clientSecret conforme necessário
            })
            .catch((err) => {
                console.error("Erro ao criar PaymentIntent:", err);
            });
    }, [total, paymentMethodTypes]);

    if (!stripe || !elements) {
        console.error("Stripe ou Elements não inicializados");
    }

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
        calculateTotal(items);
    }, [shippingCost, subtotal, items]);

    useEffect(() => {
        setLoading(loading);
    }, [loading]);

    useEffect(() => {
        if (!user && !loading) {
            window.location.href = window.location.origin;
        }
    }, [user]);

    useEffect(() => {
        const fetchUserData = async () => {
            const itemsCart = await cartRepo.get();
            const storedItems: any = await Promise.all(
                itemsCart.map(async (item: any) => {
                    const product = await productRepo.getById(item.id);
                    return { ...product, size: item.size };
                })
            );

            setLoading(true);
            if (storedItems) {
                try {
                    const parsedItems = (storedItems);
                    if (Array.isArray(parsedItems)) {
                        setItems(parsedItems);
                        calculateTotal(parsedItems);

                        try {
                            setEmail(user?.email ?? "");
                            setCPF(formatCPF(user?.cpf ?? ""));
                            setName(user?.nome_completo ?? "");
                        } catch (error: any) {
                            console.error("Erro ao obter dados do usuário", error);
                            window.location.href = window.location.origin;
                        }

                        setLoading(false);
                    } else {
                        setLoading(false);
                    }
                } catch (error: any) {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        setEmail(user?.email ?? "");
        setCPF(formatCPF(user?.cpf ?? ""));
        setName(user?.nome_completo ?? "");
    }, [user]);

    const calculateTotal = (items: Product[]) => {
        const newSubtotal = items.reduce((acc, item) => acc + item.price, 0);
        let descontoTotal = 0;

        items.forEach((item) => {
            if (item.desconto > 0) {
                descontoTotal += item.desconto;
            }
        });

        setSubtotal(newSubtotal);
        setDesconto(descontoTotal);
        const deliveryCost = Number(shippingCost) || 0;
        setTotal(newSubtotal - descontoTotal + deliveryCost);
    };

    const selectShippingMethod = (shippingItem: ShippingItem) => {
        setShipMethod(shippingItem);
        setShippingDays(shippingItem.delivery_time);
        setShippingCost(shippingItem.price);
        calculateTotal(items);
    };

    const removeItemFromCart = (itemId: any) => {
        const updatedItems = items.filter(item => item.id !== itemId);
        setItems(updatedItems);
        localStorage.setItem("sacola", JSON.stringify(updatedItems));
        calculateTotal(updatedItems);
    };

    const fetchShippingInfo = async () => {
        if (cep.length !== 9) {
            setIsCepValid(false);
            return;
        }

        setIsCepValid(true);

        try {
            const cepReturned: CepProps = await getCEPJson(cep);
            const detailsShipping: any = await shippingRepo.getShippingOptionsByCep(cep);
            detailsShipping.push({
                id: 4,
                name: "Retirada",
                price: "0.00",
                custom_price: "0.00",
                discount: "0.00",
                currency: "R$",
                delivery_time: 0,
                delivery_range: {
                    min: 0,
                    max: 0
                },
                custom_delivery_time: 0,
                custom_delivery_range: {
                    min: 0,
                    max: 0
                },
                packages: [],
                additional_services: {
                    receipt: false,
                    own_hand: false,
                    collect: false
                },
                additional: {
                    unit: {
                        price: 0,
                        delivery: 0
                    }
                },
                company: {
                    id: 3,
                    name: "Retirada",
                    picture: ""
                }
            });
            setShippingDetails(detailsShipping);
            calculateTotal(items);
            if (!cepReturned.localidade) {
                setIsCepValid(false);
            }

            if (!cepReturned.localidade) {
                toaster.create({
                    title: "Não foi possível encontrar o cep informado, insira os dados manualmente",
                    type: "error"
                });
            }

            setcidade(cepReturned.localidade);
            setEstado(cepReturned.estado);
            setbairro(cepReturned.bairro);
            setendereco(cepReturned.logradouro);
            setTotal(total + shippingCost);

        } catch (error: any) {
            console.error("Erro ao buscar informações de entrega", error);
        }
    };

    const handleFinalizePurchase = async () => {
        if (email === "" || name === "" || cpf === "" || cep === "" || telefone === "" || total === 0 || !paymentMethodSelected || !shipMethodSelected?.id) {
            toaster.create({
                title: "Preencha todas as informações"
            });
            return;
        }

        const orderUid = gerarUidComCaracteresENumeros();

        if (!stripe || !elements) {
            return;
        }

        setLoading(true);

        const { error: submitError } = await elements.submit();
        if (submitError) {
            setErrorMessage(submitError.message);
            setLoading(false);
            return;
        }

        const userNotLogged = {
            cpf: cpf,
            cupons: '[]',
            cupons_usados: '[]',
            email: email,
            id: 2,
            label: "default",
            nome_completo: name,
            photoURL: "",
            uid: ""
        };

        const dadosPedido = {
            "usuario": {
                ...user || userNotLogged,
                "telefone": telefone
            },
            "produtos": items,
        };

        const enderecoPedido = {
            "endereço": endereco,
            "bairro": bairro,
            "cidade": cidade,
            "estado": estado,
            "cep": cep,
            "referencia": referencia,
            "numero": numero,
            "shippingMethodSelected": shipMethodSelected,
            "shippingCust": shipMethodSelected?.price,
            "shippingDeliveryTime": shipMethodSelected?.delivery_time,
            "codigoRastreio": ""
        };

        const orderContent: OrderProps = {
            uid: orderUid,
            enderecoPedido: enderecoPedido,
            dadosPedido: dadosPedido,
            precototal: total,
            paymentOption: paymentMethodSelected.label === "Cartão de Crédito" ? "CART" : 'PIX',
            desconto: desconto,
            subtotal: subtotal,
            CuponsDescontos: 0,
            CupomAtual: ''
        };

        if (paymentMethodSelected?.value === EnumPaymentMethod.CreditCard) {
            try {
                const error = await PaymentRepository.confirmCreditCardPayment(
                    stripe,
                    elements,
                    clientSecret,
                    `${window.location.origin}/success/${orderUid}`
                );

                if (error) {
                    PaymentRepository.handleCardPaymentError(error);
                } else {
                    await OrderRepository.create(orderContent);
                    window.location.href = window.location.origin + `/success/` + orderUid;
                }
            } catch (error: any) {
                console.error("Error finalizing purchase:", error);
                setErrorMessage("Error finalizing purchase. Please try again.");
                toaster.create({
                    title: "Erro: " + error
                });
            } finally {
                setLoading(false);
            }
        } else if (paymentMethodSelected?.value === EnumPaymentMethod.Pix) {
            try {
                await OrderRepository.create(orderContent);
                window.location.href = window.location.origin + `/success/` + orderUid;
            } catch (error: any) {
                console.error("Error finalizing purchase:", error);
                setErrorMessage("Error finalizing purchase. Please try again.");
                toaster.create({
                    title: "Erro: " + error
                });
            }
        }
    };

    if (items.length <= 0) {
        return <>
            <section className="not-found-page">
                <div className="not-found-page__inside">
                    <h1 className="not-found-page__title">SUA SACOLA ESTÁ VAZIA.</h1>
                    <p className="not-found-page__message">
                        Para continuar comprando, navegue pelas categorias do site ou faça uma busca pelo seu produto.
                    </p>
                    <a href="/" className="not-found-page__button">
                        Escolher produtos
                    </a>
                </div>
            </section>
            <Footer />
        </>
    }

    return (
        <section className="checkout-page-wrapper">
            {isLoading && <Loader />}
            <StepsRoot defaultValue={0} aria-valuenow={step} count={3} color={"black"}>
                {!isMobile &&
                    <StepsList>
                        <StepsItem onClick={() => setStep(0)} index={0} icon={<LuUser />} className="item-step" color={"black"} title="Dados pessoais" description="Dados pessoais" />
                        <StepsItem onClick={() => setStep(1)} index={1} icon={<LuWallet />} className="item-step" color={"black"} title="Pagamento" description="Escolha a forma de pagamento" />
                        <StepsItem onClick={() => setStep(2)} index={2} icon={<LuCalendar />} className="item-step" color={"black"} title="Revisão do pedido" description="Revisão final do pedido" />
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
                                                                    {item.desconto > 0 ?
                                                                        <h1><s style={{ color: "gray" }}> R$ {(item.price).toFixed(2)}</s> R$ {(item.price - item.desconto).toFixed(2)}</h1>
                                                                        :
                                                                        <h1 style={{ color: "#be0a45" }}>R$ {(item.price - item.desconto).toFixed(2)}</h1>
                                                                    }
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
                                                    <Input disabled={!!user} value={user ? user.email : email} onChange={(e) => setEmail((e.target.value.toLowerCase()))} placeholder="Insira o e-mail aqui" background={"var(--cinza-principal)"} padding={2} variant={"subtle"} />
                                                </div>
                                                <div className="inputbox">
                                                    <label>Nome completo</label>
                                                    <Input disabled={!!user} value={user ? user.nome_completo : name} onChange={(e) => setName(e.target.value)} placeholder="Insira o nome completo aqui" background={"var(--cinza-principal)"} padding={2} variant={"subtle"} />
                                                </div>
                                                <div className="inputbox">
                                                    <label>CPF</label>
                                                    <Input
                                                        disabled={!!user}
                                                        maxLength={14}
                                                        value={user ? formatCPF(user.cpf) : formatCPF(cpf)}
                                                        onChange={(e) => setCPF(formatCPF(e.target.value))}
                                                        placeholder="Insira o cpf aqui" background={"var(--cinza-principal)"}
                                                        padding={2}
                                                        variant={"subtle"}
                                                    />
                                                </div>
                                                <div className="inputbox">
                                                    <label>Telefone para contato</label>
                                                    <Input
                                                        maxLength={15}
                                                        value={formatTelefone(telefone)}
                                                        onChange={(e) => setTel(formatTelefone(e.target.value))}
                                                        placeholder="Insira o telefone aqui"
                                                        background={"var(--cinza-principal)"}
                                                        padding={2}
                                                        variant={"subtle"}
                                                    />
                                                </div>
                                            </div>

                                            <div className="title-box-checkout" style={{ marginTop: 20 }}>
                                                <label id="title">Entrega</label>
                                            </div>
                                            <div className="items-component-checkout">
                                                {isCepValid ? (
                                                    <>
                                                        <label><b>Receber</b> {items.length} itens em <span>{cep}</span> <Button onClick={() => { setIsCepValid(false) }}><Edit /></Button></label>
                                                        {!shipMethodSelected?.id && <label style={{ color: "red" }}>* Selecione uma opção de frete</label>}
                                                        <div className="typeAddressSelected">
                                                            {shippingDetails.map((item: ShippingItem) => {
                                                                return (
                                                                    <div key={item.name}>
                                                                        <Checkbox.Root width={"full"} checked={shipMethodSelected?.id === item.id}>
                                                                            <Checkbox.HiddenInput />
                                                                            <Checkbox.Control />
                                                                            <Checkbox.Label width={"full"} style={{ width: "100% !importabt" }} cursor={"pointer"} color={"black"}>
                                                                                <div onClick={() => selectShippingMethod(item)} className="addressItem">
                                                                                    <div className="addressItem">
                                                                                        <div className="addressItem__insideleft">
                                                                                            <p>{item.company.name} ({item.name})</p>
                                                                                            {item.company.name != "Retirada" ? <p>Em até {item.delivery_time} dias úteis</p> : <>Retire o produto em Pouso Alegre - MG</>}
                                                                                        </div>
                                                                                        <div className="addressItem__insideright">
                                                                                            {item.company.name != "Retirada" ? <p>{item.currency} {item.price}</p> : <></>}
                                                                                        </div>
                                                                                    </div>
                                                                                </div></Checkbox.Label>
                                                                        </Checkbox.Root>
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div>
                                                        <Input
                                                            type="text"
                                                            placeholder="Digite o CEP"
                                                            value={formatCEP(cep)}
                                                            onChange={(e) => setCep(formatCEP(e.target.value))}
                                                            onBlur={fetchShippingInfo}
                                                            background={"var(--cinza-principal)"}
                                                            padding={2}
                                                            maxLength={9}
                                                        />
                                                    </div>
                                                )}
                                                {isCepValid &&
                                                    <React.Fragment>
                                                        <div className="inputbox">
                                                            <label>Cidade</label>
                                                            <Input
                                                                value={cidade}
                                                                onChange={(e) => setcidade(e.target.value)}
                                                                placeholder="Insira a cidade aqui"
                                                                background={"var(--cinza-principal)"}
                                                                padding={2}
                                                                variant={"subtle"}
                                                            />
                                                        </div>
                                                        <div className="inputbox">
                                                            <label>Estado</label>
                                                            <Input
                                                                value={estado}
                                                                onChange={(e) => setEstado(e.target.value)}
                                                                placeholder="Insira o estado aqui"
                                                                background={"var(--cinza-principal)"}
                                                                padding={2}
                                                                variant={"subtle"}
                                                            />
                                                        </div>
                                                        <div className="inputbox">
                                                            <label>Bairro</label>
                                                            <Input
                                                                value={bairro}
                                                                onChange={(e) => setbairro(e.target.value)}
                                                                placeholder="Insira o bairro aqui"
                                                                background={"var(--cinza-principal)"}
                                                                padding={2}
                                                                variant={"subtle"}
                                                            />
                                                        </div>
                                                        <div className="inputbox">
                                                            <label>Endereço</label>
                                                            <Input
                                                                value={endereco}
                                                                onChange={(e) => setendereco(e.target.value)}
                                                                placeholder="Insira o endereço aqui"
                                                                background={"var(--cinza-principal)"}
                                                                padding={2}
                                                                variant={"subtle"}
                                                            />
                                                        </div>
                                                        <div className="inputbox">
                                                            <label>Número</label>
                                                            <Input
                                                                value={numero}
                                                                onChange={(e) => setnumero(e.target.value)}
                                                                placeholder="Insira o número aqui"
                                                                background={"var(--cinza-principal)"}
                                                                padding={2}
                                                                variant={"subtle"}
                                                            />
                                                        </div>
                                                        <div className="inputbox">
                                                            <label>Referencia</label>
                                                            <Input
                                                                value={referencia}
                                                                onChange={(e) => setreferencia(e.target.value)}
                                                                placeholder="Insira a referencia aqui"
                                                                background={"var(--cinza-principal)"}
                                                                padding={2}
                                                                variant={"subtle"}
                                                            />
                                                        </div>
                                                    </React.Fragment>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </StepsContent>
                            <StepsContent index={1}>
                                <div className="box-checkout">
                                    <div className="box-checkout__header">
                                        <div className="title-box-checkout">
                                            <label id="title">Pagamento</label>
                                        </div>
                                        <div className="items-component-checkout">
                                            <SelectRoot
                                                variant={"subtle"}
                                                onValueChange={(value) => { setPaymentMethodSelected(value.items[0]) }}
                                                collection={paymentsMethods} size="sm" width="320px">
                                                <SelectLabel>Selecione o método de pagamento: </SelectLabel>
                                                <SelectTrigger>
                                                    <SelectValueText placeholder="Selecione o pagamento" />
                                                </SelectTrigger>
                                                <SelectContent background={"white"}>
                                                    {paymentsMethods.items.map((paymentMethod: any) => (
                                                        !paymentMethod.disabled &&
                                                        <SelectItem item={paymentMethod} key={paymentMethod.value}>
                                                            {paymentMethod.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </SelectRoot>
                                            {paymentMethodSelected?.value == EnumPaymentMethod.CreditCard &&
                                                <form>
                                                    <PaymentElement id="payment-element" />
                                                </form>
                                            }
                                            {paymentMethodSelected?.value == EnumPaymentMethod.Pix &&
                                                <section className="section-payment-inside">
                                                    <div className="header-pix-content">
                                                        <p>1. Conclua sua compra.</p>
                                                        <p>2. Aguarde nosso contato para definir os detalhes da entrega e o valor final.</p>
                                                        <p>3. Realize o pagamento via Pix utilizando o QR Code enviado pela nossa equipe.</p>
                                                        <p>4. Envie o comprovante de pagamento pelo WhatsApp para a pessoa que entrou em contato com você.</p>
                                                        <p>5. Agora é só aguardar ansiosamente pelo seu pedido da Laris! 💖</p>
                                                    </div>
                                                    <div className="logo-pix">
                                                        <img src={"https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Logo%E2%80%94pix_powered_by_Banco_Central_%28Brazil%2C_2020%29.svg/2560px-Logo%E2%80%94pix_powered_by_Banco_Central_%28Brazil%2C_2020%29.svg.png"} alt="pix" />
                                                    </div>
                                                </section>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </StepsContent>
                            <StepsContent index={2}>
                                <div className="box-checkout">
                                    <div className="box-checkout__header">
                                        <div className="title-box-checkout">
                                            <label id="title">Revisão do pedido</label>
                                        </div>
                                    </div>
                                    <div className="items-component-checkout">
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
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>

                                        <div className="box-checkout">
                                            <div className="box-checkout__header">
                                                <div className="title-box-checkout">
                                                    <label id="title">Forma de Pagamento</label>
                                                </div>
                                                <div className="items-component-checkout">
                                                    <p>{paymentMethodSelected?.label || "Método de pagamento não selecionado"}</p>
                                                    {paymentMethodSelected?.value == EnumPaymentMethod.CreditCard &&
                                                        <React.Fragment>
                                                            <p>{parcelamento?.label} R$ {total.toFixed(2)}</p>
                                                            <p>Nome completo: {name}</p>
                                                        </React.Fragment>
                                                    }
                                                </div>
                                            </div>
                                        </div>

                                        <div className="box-checkout">
                                            <div className="box-checkout__header">
                                                <div className="title-box-checkout">
                                                    <label id="title">Entrega</label>
                                                </div>
                                                <div className="items-component-checkout">
                                                    <p>CEP: {cep ? cep : "Cep não indicado"}</p>
                                                    {isCepValid && (
                                                        <div>
                                                            <p>Receber {items.length} itens em {cep} ({cidade} / {bairro} / {endereco})</p>
                                                            {shipMethodSelected?.company.name != "Retirada" && <p>Seu pedido será entregue em {shipMethodSelected?.delivery_time} dias após ser enviado.</p>}
                                                            {shipMethodSelected?.company.name != "Retirada" ? <p>{shipMethodSelected?.company.name} - {shipMethodSelected?.name}</p> : <p>{shipMethodSelected?.name} em Pouso Alegre</p>}
                                                            {shipMethodSelected?.company.name != "Retirada" && <p>Custo de entrega: {shipMethodSelected?.currency} {shipMethodSelected?.price}</p>}
                                                        </div>
                                                    )}
                                                </div>
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
                                            <DataListItem className="item-data-list-prices" label={"Entrega"} value={"R$ " + (shippingCost ? shippingCost : "A DEFINIR")} />
                                            <DataListItem className="item-data-list-prices-principal" label={"Total"} value={"R$ " + total.toFixed(2)} />
                                        </DataListRoot>
                                        <div className="actions-buttons">
                                            {step != 2 ?
                                                <StepsNextTrigger width={'full'} onClick={() => setStep(step + 1)}>
                                                    <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="finalize-btn">
                                                        <span>PROSSEGUIR PARA COMPRA</span>
                                                    </button>
                                                </StepsNextTrigger>
                                                :
                                                <button className="finalize-btn" onClick={handleFinalizePurchase} >
                                                    <ShoppingCartIcon />
                                                    <span>Finalizar compra</span>
                                                </button>
                                            }
                                            {step != 0 &&
                                                <StepsPrevTrigger width={'full'} onClick={() => setStep(step - 1)}>
                                                    <button className="continue_buyingBtn">
                                                        <span>VOLTAR</span>
                                                    </button>
                                                </StepsPrevTrigger>
                                            }
                                            <button onClick={() => window.location.href = window.location.origin} className="continue_buyingBtn">
                                                Continuar comprando
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </StepsRoot>
            <Footer />
        </section>
    )
}

export default CheckoutPage;
