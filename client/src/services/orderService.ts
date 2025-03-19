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
export class orderService {
    private static endpoint = process.env.REACT_APP_API_ENDPOINT;
    private static secretKey = process.env.REACT_APP_API_SECRET_KEY;
    private static preEndpoint = process.env.REACT_APP_API_PREENDPOINT;

    constructor() { }

    static create = async (order: OrderProps) => {
        if (!this.endpoint || !this.secretKey || !this.preEndpoint) {
            console.error("API endpoint ou chave secreta não configurados corretamente.");
            return;
        }

        const url = `${this.endpoint}${this.preEndpoint}${this.secretKey}/orders/add`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
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
                    cupons: order.CupomAtual ? order.CupomAtual.name : ''
                }),
            });

            if (response.ok) {
                await emailService.send(templateId.confirmationBuy, {
                    link_rastreio: window.location.origin + "/account#orders",
                    userComprador: order.dadosPedido.usuario,
                    endereco: order.enderecoPedido,
                    methodPayment: order.paymentOption,
                    items: order.dadosPedido.produtos,
                    order: order,
                    to_email: order.dadosPedido.usuario.email,
                    principal_message: order.paymentOption != "PIX" ? "Seu pedido foi confirmado com sucesso. Em breve, você receberá atualizações sobre o envio. Assim que o produto for despachado, enviaremos um e-mail com o código de rastreamento para que você possa acompanhar a entrega." : "Estamos aguardando o pagamento do seu pedido. Entraremos em contato para combinar a entrega e enviar o QRCode para o pagamento via pix."
                });
                
                await emailService.send(templateId.adminConfirmationBuy, {
                    link_rastreio: "https://www.larisacessorios.com.br/admin/orders",
                    userComprador: order.dadosPedido.usuario,
                    endereco: order.enderecoPedido,
                    methodPayment: order.paymentOption,
                });
                toaster.create({
                    title: "Pedido realizado com sucesso",
                    type: "success"
                });

                localStorage.setItem('sacola', '[]');
            } else {
                toaster.create({
                    title: "Erro ao realizar pedido",
                    type: "error"
                });
            }
        } catch (error) {
            console.error("Erro ao criar o pedido:", error);
            toaster.create({
                title: "Erro de conexão",
                type: "error"
            });
        }
    };

    static getAll = async () => {
        if (!this.endpoint || !this.secretKey || !this.preEndpoint) {
            console.error("API endpoint ou chave secreta não configurados corretamente.");
            return;
        }

        const url = `${this.endpoint}${this.preEndpoint}${this.secretKey}/orders`;

        try {
            const request = await fetch(url);
            const data = await request.json();
            return data;
        }
        catch (error) {
            console.error("Erro ao pegar todas as orders", error);
        }
    }

    static getByUid = async (uid: string) => {
        if (!this.endpoint || !this.secretKey || !this.preEndpoint) {
            console.error("API endpoint ou chave secreta não configurados corretamente.");
            return;
        }

        const url = `${this.endpoint}${this.preEndpoint}${this.secretKey}/orders`;

        try {
            const request = await fetch(url);
            const data = await request.json();
            const orderFounded = data.find((order: any) => order.uid === uid)
            return orderFounded;
        }
        catch (error) {
            console.error("Erro ao pegar a order " + uid + ": ", error)
        }
    }

    static getById = async (id: any) => {
        if (!this.endpoint || !this.secretKey || !this.preEndpoint) {
            console.error("API endpoint ou chave secreta não configurados corretamente.");
            return;
        }

        const url = `${this.endpoint}${this.preEndpoint}${this.secretKey}/getOrderById`;

        try {
            const request = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: id
                })
            });
            const data = await request.json();
            return data[0];
        }
        catch (error) {
            console.error("Erro ao pegar a orders", error)
        }
    }

    static getByUser = async (userId: string) => {
        if (!this.endpoint || !this.secretKey || !this.preEndpoint) {
            console.error("API endpoint ou chave secreta não configurados corretamente.");
            return;
        }

        const url = `${this.endpoint}${this.preEndpoint}${this.secretKey}/orders`;

        try {
            const request = await fetch(url);
            const data = await request.json();
            const filteredData = data.filter((order: OrderAfterBuyProps) => {
                const orderUser = JSON.parse(order.user);

                return orderUser.uid === userId ? order : null;
            })
            return data;
        }
        catch (error) {
            console.error("Erro ao pegar a orders", error)
        }
    }

    static update = async (order: any) => {
        if (!this.endpoint || !this.secretKey || !this.preEndpoint) {
            console.error("API endpoint ou chave secreta não configurados corretamente.");
            return;
        }

        const url = `${this.endpoint}${this.preEndpoint}${this.secretKey}/orders/edit`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(order),
            });

            if (response.ok) {
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
        } catch (error) {
            console.error("Erro ao criar o pedido:", error);
            toaster.create({
                title: "Erro de conexão",
                type: "error"
            });
        }
    }
}