/**
 * Creation Date: 27/12/2024
 * Author: Vinícius da Silva Santos
 * Coordinator: Larissa Alves de Andrade Moreira
 * Developed by: Lari's Acessórios Team
 * Copyright 2025, LARI'S ACESSÓRIOS
 * All rights are reserved. Reproduction in whole or part is prohibited without the written consent of the copyright owner.
 */

import { OrderAfterBuyProps, OrderProps } from "../models/order";
import { toaster } from "../components/ui/toaster";
import emailService from "./emailService";
import { templateId } from "../lib/utils";
import api, { getUrlByAmbient } from "./api";

const authorization = localStorage.getItem("token") ?? "";

export class orderService {
    private static url = getUrlByAmbient();
    private static secretKey = process.env.REACT_APP_API_SECRET_KEY;
    private static preEndpoint = process.env.REACT_APP_API_PREENDPOINT;

    constructor() { }

    static readonly create = async (order: OrderProps) => {
        if (!this.url || !this.secretKey || !this.preEndpoint) {
            console.error("API endpoint ou chave secreta não configurados corretamente.");
            return;
        }

        const url = `${this.url}${this.preEndpoint}${this.secretKey}/orders/add`;

        try {
            const response = await api.post(url, {
                uid: order.uid,
                address: JSON.stringify(order.enderecoPedido),
                items: JSON.stringify(order.dadosPedido.produtos),
                user: JSON.stringify(order.dadosPedido.usuario),
                totalprice: order.precototal,
                paymentOption: order.paymentOption,
                situation: order.paymentOption === "CART" ? 'PAGO' : 'NAOPAGO',
                desconto: order.desconto,
                subtotal: order.subtotal,
                cupom_desconto: order.CuponsDescontos || 0,
                cupons: order.CupomAtual ? order.CupomAtual.name : '',
                codigoRastreio: ""
            });

            if (response.status === 200 || response.status === 201) {
                await emailService.send(templateId.confirmationBuy, {
                    link_rastreio: window.location.origin + "/account#orders",
                    userComprador: order.dadosPedido.usuario,
                    endereco: order.enderecoPedido,
                    methodPayment: order.paymentOption,
                    items: order.dadosPedido.produtos,
                    order: order,
                    to_email: order.dadosPedido.usuario.email,
                    principal_message: order.paymentOption != "PIX"
                        ? "Seu pedido foi confirmado com sucesso. Em breve, você receberá atualizações sobre o envio. Assim que o produto for despachado, enviaremos um e-mail com o código de rastreamento para que você possa acompanhar a entrega."
                        : "Estamos aguardando o pagamento do seu pedido. Entraremos em contato para enviar o QRCode para o pagamento via pix."
                });

                await emailService.send(templateId.adminConfirmationBuy, {
                    link_rastreio: "https://www.larisacessorios.com.br/admin/orders",
                    userComprador: order.dadosPedido.usuario,
                    endereco: order.enderecoPedido,
                    methodPayment: order.paymentOption,
                });

                toaster.create({ title: "Pedido realizado com sucesso", type: "success" });
                localStorage.setItem('sacola', '[]');
            } else {
                toaster.create({ title: "Erro ao realizar pedido", type: "error" });
            }
        } catch (error: any) {
            console.error("Erro ao criar o pedido:", error);
            toaster.create({ title: "Erro de conexão", type: "error" });
        }
    };

    static readonly createByAdmin = async (order: OrderProps) => {
        if (!this.url || !this.secretKey || !this.preEndpoint) {
            console.error("API endpoint ou chave secreta não configurados corretamente.");
            return;
        }

        const url = `${this.url}${this.preEndpoint}${this.secretKey}/orders/add`;

        try {
            const response = await api.post(url, {
                uid: order.uid,
                address: JSON.stringify(order.enderecoPedido),
                items: JSON.stringify(order.dadosPedido.produtos),
                user: JSON.stringify(order.dadosPedido.usuario),
                totalprice: order.precototal,
                paymentOption: order.paymentOption,
                situation: order.paymentOption === "CART" ? 'PAGO' : 'NAOPAGO',
                desconto: order.desconto,
                subtotal: order.subtotal,
                cupom_desconto: order.CuponsDescontos || 0,
                cupons: order.CupomAtual ? order.CupomAtual.name : '',
                codigoRastreio: ""
            });
            if (response.status === 200 || response.status === 201) {
                toaster.create({ title: "Pedido realizado com sucesso", type: "success" });
            } else {
                toaster.create({ title: "Erro ao realizar pedido", type: "error" });
            }
        } catch (error: any) {
            console.error("Erro ao criar o pedido:", error);
            toaster.create({ title: "Erro de conexão", type: "error" });
        }
    };

    static readonly getAll = async () => {
        if (!this.url || !this.secretKey || !this.preEndpoint) {
            console.error("API endpoint ou chave secreta não configurados corretamente.");
            return;
        }

        const url = `${this.url}${this.preEndpoint}${this.secretKey}/orders`;

        try {
            const { data } = await api.get(url);
            return data.reverse();
        } catch (error: any) {
            console.error("Erro ao pegar todas as orders", error);
        }
    };

    static readonly getByUid = async (uid: string) => {
        if (!this.url || !this.secretKey || !this.preEndpoint) {
            console.error("API endpoint ou chave secreta não configurados corretamente.");
            return;
        }

        const url = `${this.url}${this.preEndpoint}${this.secretKey}/orders`;

        try {
            const { data } = await api.get(url);
            return data.find((order: any) => order.uid === uid);
        } catch (error: any) {
            console.error("Erro ao pegar a order " + uid + ": ", error);
        }
    };

    static readonly getById = async (id: any) => {
        if (!this.url || !this.secretKey || !this.preEndpoint) {
            console.error("API endpoint ou chave secreta não configurados corretamente.");
            return;
        }

        const url = `${this.url}${this.preEndpoint}${this.secretKey}/getOrderById`;

        try {
            const { data } = await api.post(url, { id });
            return data[0];
        } catch (error: any) {
            console.error("Erro ao pegar a orders", error);
        }
    };

    static readonly getByUser = async (email: string) => {
        if (!this.url || !this.secretKey || !this.preEndpoint) {
            console.error("API endpoint ou chave secreta não configurados corretamente.");
            return;
        }

        const url = `${this.url}${this.preEndpoint}${this.secretKey}/orders`;

        try {
            const { data } = await api.get(url);

            const filteredData = data.filter((order: OrderAfterBuyProps) => {
                const orderUser = JSON.parse(order.user);
                return orderUser.email === email;
            });
            return filteredData;
        } catch (error: any) {
            console.error("Erro ao pegar a orders", error);
        }
    };

    static readonly update = async (order: any) => {
        if (!this.url || !this.secretKey || !this.preEndpoint) {
            console.error("API endpoint ou chave secreta não configurados corretamente.");
            return;
        }

        const url = `${this.url}${this.preEndpoint}${this.secretKey}/orders/edit`;

        try {
            const response = await api.post(url, order);

            if (response.status === 200 || response.status === 201) {
                toaster.create({
                    title: `Pedido ${order.id} atualizado com sucesso`,
                    type: "success"
                });
                localStorage.setItem('sacola', '[]');
            } else {
                toaster.create({
                    title: "Erro ao atualizar pedido",
                    type: "error"
                });
            }
        } catch (error: any) {
            console.error("Erro ao atualizar o pedido:", error);
            toaster.create({
                title: "Erro de conexão",
                type: "error"
            });
        }
    };

    static readonly delete = async (order: any) => {
        if (!this.url || !this.secretKey || !this.preEndpoint) {
            console.error("API endpoint ou chave secreta não configurados corretamente.");
            return;
        }

        const url = `${this.url}${this.preEndpoint}${this.secretKey}/orders/delete`;

        try {
            const response = await api.post(url, order);

            if (response.status === 200 || response.status === 201) {
                toaster.create({
                    title: `Pedido ${order.id} excluido com sucesso`,
                    type: "success"
                });
            } else {
                toaster.create({
                    title: "Erro ao excluir pedido",
                    type: "error"
                });
            }
        } catch (error: any) {
            console.error("Erro ao atualizar o pedido:", error);
            toaster.create({
                title: "Erro de conexão",
                type: "error"
            });
        }
    }
}
