/**
 * Creation Date: 28/12/20
 * Author: Vinícius da Silva Santos
 * Coordinator: Larissa Alves de Andrade Moreira
 * Developed by: Lari's Acessórios Team
 * Copyright 2025, LARI'S ACESSÓRIOS
 * All rights are reserved. Reproduction in whole or part is prohibited without the written consent of the copyright owner.
 */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AccountIcon } from "../../../../components/icons/icons";
import { Button } from "../../../../components/ui/button";
import {
    DialogBody,
    DialogCloseTrigger,
    DialogContent,
    DialogRoot,
    DialogTrigger,
} from "../../../../components/ui/dialog";
import { FormAccount } from "../FormAccount";
import { Checkbox } from "../../../../components/ui/checkbox";
import "../Header.css";
import LogoHeader from "../../../../images/logo.webp";
import authService from "../../../../services/authService";
import { toaster } from "../../../../components/ui/toaster";
import { UserAuthProps } from "@/lib/utils";

const AccountComponent = () => {
    const [isRegistering, setIsRegistering] = useState<boolean>(false);
    const [formValues, setFormValues] = useState<any>({});
    const [error, setError] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);

    const FormLoginAccount = [{
        label: <span>ENTRE EM NOSSO GRUPO E CONCORRA A <br /><span className="breaklineHeader">CUPONS EXCLUSIVOS</span></span>,
        btnLabel: "Entrar",
        photoURL: "https://i.ibb.co/xthR2SMM/IMG-7323.png",
        btnForm: [
            { label: "E-mail", value: "", json: 'email', required: true },
            { label: "Senha", value: "", json: 'senha', required: true },
        ]
    }];

    const FormRegisterAccount = [{
        label: <span>NA SUA PRIMEIRA COMPRA, <br /><span className="breaklineHeader">VOCÊ GANHA 15% OFF</span><br /> Com o cupom BEMVINDO</span>,
        btnLabel: "Cadastrar",
        photoURL: "https://i.ibb.co/xthR2SMM/IMG-7323.png",
        btnForm: [
            { label: "Nome completo", value: "", json: 'name', required: true },
            { label: "E-mail", value: "", json: 'email', required: true },
            { label: "CPF", value: "", json: 'cpf', required: true },
            { label: "Senha", value: "", json: 'senha', required: true },
        ]
    }];

    const handleToggleForm = () => {
        setIsRegistering(!isRegistering);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        setFormValues({
            ...formValues,
            [field]: e.target.value,
        });
    };

    const handleSubmit = () => {
        const fields = formData[0].btnForm;
        const missingFields = fields.filter((field: any) => field.required && !formValues[field.label]);

        if (missingFields.length > 0) {
            setError("Preencha todos os campos obrigatórios.");
        } else {
            setError(null);
            const email: string = formValues["E-mail"];
            const password: string = formValues["Senha"];
            const nome_completo: string = formValues["Nome Completo"];
            const cpf: string = formValues["CPF"]

            const User: UserAuthProps = {
                nome_completo: nome_completo,
                email: email,
                cpf: cpf,
                password: password
            }

            if (!isRegistering) {
                authService.login(User.email, User.password).then(response => {
                    toaster.create({
                        title: "Usuário logado com sucesso",
                        type: "success",
                    });
                }).catch(error => {
                    toaster.create({
                        title: "Ocorreu um erro durante o credenciamento: " + error,
                        type: "error",
                    });
                    console.error(error);
                });
            }
            else {
                authService.register(User).then(response => {
                    toaster.create({
                        title: "Usuário criado com sucesso",
                        type: "success",
                    });
                }).catch(error => {
                    toaster.create({
                        title: "Ocorreu um erro durante criamento da conta: " + error,
                        type: "error",
                    });
                    console.error(error);
                });
            }
        }
    };

    async function checkIfIsLogged() {
        const isLogged: boolean = await authService.isLogged();

        if (isLogged) {
            window.location.href = window.location.origin + '/account';
        }

    }


    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const formData = isRegistering ? FormRegisterAccount : FormLoginAccount;

    return (
        <DialogRoot size={"lg"} motionPreset="slide-in-bottom" placement="center">
            <DialogTrigger asChild>
                <Button onClick={checkIfIsLogged} variant="ghost" aria-label="Conta">
                    <AccountIcon />
                </Button>
            </DialogTrigger>
            <DialogContent backgroundColor={"white"} className={isMobile ? "dialogContentMobile" : ""}>
                <DialogBody>
                    <FormAccount
                        photoRef={formData[0].photoURL}
                        component={
                            <div className="inside-form-component">
                                <div className="header-top">
                                    <img src={LogoHeader} alt="LARIS ACESSÓRIOS" />
                                </div>
                                <form>
                                    <div className="header-inside-component">{formData[0].label}</div>
                                    {formData[0].btnForm.map((field: any, index) => (
                                        <div key={index} className="form-field">
                                            <label>{field.label}</label>
                                            <input
                                                type={field.label === "Senha" ? "password" : "text"}
                                                value={formValues[field.label] || ""}
                                                onChange={(e) => handleInputChange(e, field.label)}
                                            />
                                        </div>
                                    ))}
                                    {isRegistering && (
                                        <Checkbox variant={"subtle"} className="checkbox">
                                            <span>Estou ciente e aceito os termos da <Link to={window.location.origin}>Politica de Privacidade</Link></span>
                                        </Checkbox>
                                    )}
                                    {error && <div style={{ color: "red" }}>{error}</div>}
                                </form>
                                <Button onClick={handleSubmit} className="finalizeBtn">{formData[0].btnLabel}</Button>
                                <div className="btnBottom">
                                    <Button variant="link" onClick={handleToggleForm}>
                                        {isRegistering ? "Já tem conta? Entrar" : "Não tem conta? Cadastre-se"}
                                    </Button>
                                </div>
                            </div>
                        }
                    />
                </DialogBody>
                <DialogCloseTrigger />
            </DialogContent>
        </DialogRoot>
    );
};

export default AccountComponent;
