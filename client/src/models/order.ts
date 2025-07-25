/**
 * Creation Date: 23/07/2025
 * Author: Vinícius da Silva Santos
 * Coordinator: Larissa Alves de Andrade Moreira
 * Developed by: Lari's Acessórios Team
 * Copyright 2025, LARI'S ACESSÓRIOS
 * All rights are reserved. Reproduction in whole or part is prohibited without the written consent of the copyright owner.
*/

export interface OrderProps {
    uid: string;
    enderecoPedido: any;
    dadosPedido: any;
    precototal: any;
    paymentOption: "CART" | "PIX" | "DINHEIRO";
    desconto: any;
    subtotal: any;
    CuponsDescontos: any;
    CupomAtual: any;
}

export interface OrderAfterBuyProps {
    id: number,
    uid: string;
    address: string;
    items: any;
    user: any;
    order_totalprice: number;
    createdAt: any;
    paymentOption: 'CART' | 'PIX' | 'DINHEIRO';
    state: 'PREPARANDO' | 'ENTREGA' | 'FINALIZADO';
    situation: "PAGO" | "NAOPAGO";
    desconto: number;
    subtotal: number;
    cupom_desconto: number;
    cupom_name: string;
    codigoRastreio: string;

}