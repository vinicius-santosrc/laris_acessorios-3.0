/**
 * Creation Date: 14/12/2025
 * Author: Vinícius da Silva Santos
 * Coordinator: Larissa Alves de Andrade Moreira
 * Developed by: Lari's Acessórios Team
 * Copyright 2024, LARI'S ACESSÓRIOS
 * All rights are reserved. Reproduction in whole or part is prohibited without the written consent of the copyright owner.
*/

import { useEffect, useState } from "react"
import { auth, CheckIfUserIsLogged, loginIn } from "../../../lib/firebase";
import { toaster } from "../../../components/ui/toaster";
import authService from "../../../services/authService";
import "../Admin.css";
import LogoHeader from "../../../logo.svg"

export default function AdminLogin() {
    const [user, setUser] = useState<any>(null)
    const [password, setPassword] = useState<any>(null)
    const [email, setEmail] = useState<any>(null);
    const [isAlert, setIsAlert] = useState<any>(false);
    const [typeAlert, settypeAlert] = useState<any>("error");
    const [alertMessage, setMessageAlert] = useState<any>("");

    async function signIn() {
        if (!email || !password) {

            setIsAlert(true)
            settypeAlert("error")
            setMessageAlert("Preencha todas as informações solicitadas")
            setTimeout(() => {
                setIsAlert(false)
            }, 4000);
            return;
        }
        await loginAccount();
        async function loginAccount() {
            const User = {
                email: email,
                password: password
            }
            if (User.email && User.password) {
                await loginIn(User)
                    .then(() => {
                        setIsAlert(true)
                        settypeAlert("success")
                        setMessageAlert("Login realizado com sucesso.")
                        setTimeout(() => {
                            setIsAlert(false)
                        }, 3000);
                        window.location.href = window.location.origin + "/admin"
                    })
                    .catch((err) => {
                        if (err == "FirebaseError: Firebase: Error (auth/invalid-email).") {
                            setIsAlert(true)
                            settypeAlert("error")
                            setMessageAlert("Senha ou usuário incorretos. ")
                            setTimeout(() => {
                                setIsAlert(false)
                            }, 4000);
                        }
                    })
            }
        }
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user: any) => {
            if (user && user.uid) {
                const u = await authService.getUserByUid(user.uid);
                if (u) {
                    if (CheckIfUserIsLogged()) {
                        window.location.href = window.location.origin + "/admin";
                    }
                }
            }
        });

        return () => unsubscribe();
    }, []);

    if (user) {
        window.location.href = '/admin'
    }

    return (
        <section className="AdminLoginPage">
            {isAlert ?
                toaster.create({
                    title: alertMessage,
                    type: typeAlert 

                })
                : null
            }
            <div className="AdminLogin-flexbox">
                <div className="AdminLogin-left-side">
                    <img className="LogoAdmin" src={LogoHeader} alt="logolaris" />
                    <section className="modalFormLogin">
                        <div className="AdminLogin-top">
                            <h2>Seja bem-vindo(a)</h2>
                            <p>Preencha as informações abaixo para entrar na plataforma</p>
                        </div>
                        <div className="AdminLogin-middle">
                            <div className="AdminLogin-input-box">
                                <p>E-mail</p>
                                <input
                                    onChange={
                                        (e) => {
                                            setEmail(e.target.value)
                                        }
                                    } />
                            </div>
                            <div className="AdminLogin-input-box">
                                <p>Senha</p>
                                <input
                                    onChange={
                                        (e) => {
                                            setPassword(e.target.value)
                                        }
                                    } />
                            </div>
                        </div>
                        <div className="AdminLogin-bottom">
                            <button onClick={signIn}>Entrar</button>
                        </div>
                        <div className="AdminLogin-forgot-password">
                            <a href="#">Esqueceu sua senha?</a>
                        </div>
                    </section>
                </div>
                <div className="AdminLogin-right-side">
                    <img src={"https://uploaddeimagens.com.br/images/004/877/966/full/processed-5EF3B05D-B8F3-4B16-892C-E8508CCD0A48.jpeg?1735149543"} alt="rightsideimage" />
                </div>
            </div>
        </section>
    )
}