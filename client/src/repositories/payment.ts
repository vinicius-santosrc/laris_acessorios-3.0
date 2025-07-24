/**
 * Creation Date: 23/07/2025
 * Author: Vinícius da Silva Santos
 * Coordinator: Larissa Alves de Andrade Moreira
 * Developed by: Lari's Acessórios Team
 * Copyright 2025, LARI'S ACESSÓRIOS
 * All rights are reserved. Reproduction in whole or part is prohibited without the written consent of the copyright owner.
 */

import { toaster } from "../components/ui/toaster";

export class PaymentRepository {
    static readonly createPaymentIntent = async (total: number, paymentMethodType: string) => {
        const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/create-payment-intent`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ amount: total * 100, paymentMethodType }),
        });

        if (!response.ok) {
            throw new Error("Erro ao criar Payment Intent");
        }

        const data = await response.json();
        return data.clientSecret;
    };

    static readonly confirmCreditCardPayment = async (
        stripe: any,
        elements: any,
        clientSecret: string,
        returnUrl: string
    ) => {
        const { error } = await stripe.confirmPayment({
            elements,
            clientSecret,
            confirmParams: {
                return_url: returnUrl,
            },
            redirect: "if_required",
        });

        return error;
    };

    static readonly handleCardPaymentError = (error: any) => {
        const messages: { [key: string]: string } = {
            card_declined: `${error.message} Tente novamente com outro cartão ou aguarde.`,
            expired_card: "O cartão expirou. Utilize um cartão válido.",
            incorrect_cvc: "O código de segurança do cartão está incorreto.",
            insufficient_funds: "Saldo insuficiente. Utilize outro cartão ou verifique com seu banco.",
            processing_error: "Ocorreu um erro no processamento do pagamento. Tente novamente.",
            incorrect_number: "O número do cartão está incorreto. Verifique e tente novamente.",
        };

        const message = messages[error.code] || "Não foi possível realizar a compra com seu cartão. Tente novamente com outro cartão ou aguarde.";

        toaster.create({
            title: message,
            type: "error",
        });
    };

    static readonly new = async (data: any, value: number): Promise<void> => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/payments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user: data.usuario,
                    items: data.produtos,
                    address: data.endereco,
                    total: value,
                    paymentOption: data.paymentOption,
                    desconto: data.desconto,
                    subtotal: data.subtotal,
                    cupons: data.CuponsDescontos || 0,
                    cupomAtual: data.CupomAtual || '',
                    uid: data.uid,
                    createdAt: new Date().toISOString(),
                }),
            });

            if (!response.ok) {
                throw new Error(`Erro ao criar pagamento: ${response.statusText}`);
            }

            console.log("Pagamento criado com sucesso");
        } catch (error) {
            console.error("Erro ao criar pagamento:", error);
            throw error;
        }
    };
}