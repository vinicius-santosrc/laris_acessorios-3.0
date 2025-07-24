/**
 * Creation Date: 23/07/2025
 * Author: Vinícius da Silva Santos
 * Coordinator: Larissa Alves de Andrade Moreira
 * Developed by: Lari's Acessórios Team
 * Copyright 2025, LARI'S ACESSÓRIOS
 * All rights are reserved. Reproduction in whole or part is prohibited without the written consent of the copyright owner.
 */


import { templateId } from "../lib/utils";
import * as emailjs from "@emailjs/browser";

class MailRepository {
    private readonly serviceAPI: string;
    private readonly publicKey: string;

    constructor() {
        this.serviceAPI = process.env.REACT_APP_API_EMAIL_SERVICE ?? '';
        this.publicKey = process.env.REACT_APP_API_PK_EMAIL ?? '';
        emailjs.init(this.publicKey);
    }

    async send(templateId: templateId, options: any) {
        await emailjs.send(this.serviceAPI, templateId, options);
    }
}

export default MailRepository;