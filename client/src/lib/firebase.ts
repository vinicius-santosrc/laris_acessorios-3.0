/**
 * Creation Date: 12/12/2024
 * Author: Vinícius da Silva Santos
 * Coordinator: Larissa Alves de Andrade Moreira
 * Developed by: Lari's Acessórios Team
 * Copyright 2024, LARI'S ACESSÓRIOS
 * All rights are reserved. Reproduction in whole or part is prohibited without the written consent of the copyright owner.
*/

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'

const endpoint = process.env.REACT_APP_API_ENDPOINT;
//const endpoint = process.env.REACT_APP_API_ENDPOINT_TEST;
const secretKey = process.env.REACT_APP_API_SECRET_KEY;
const preEndpoint = process.env.REACT_APP_API_PREENDPOINT;

const auth = getAuth();

const CreateNewAccount = async (user: any) => {
    await createUserWithEmailAndPassword(auth, user.email, user.password)
        .then(async (userCredential) => {
            await fetch(`${endpoint}${preEndpoint}${secretKey}/users/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    uid: userCredential.user.uid,
                    nome_completo: user.nome_completo,
                    cpf: user.cpf,
                    email: user.email
                }),
            })
                .then((res) => {
                    window.location.href = window.location.origin;
                })
                .catch((err) => { throw Error(err) })
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error(error)
        });
}

const loginIn = async (user: any) => {
    await signInWithEmailAndPassword(auth, user.email, user.password)
        .then(async (userCredential) => {
            if (window.location.href.includes("admin")) {
                return window.location.href = window.location.origin + "/admin"
            }
            return window.location.href = window.location.origin;
        })
}

const CheckIfUserIsLogged = () => {
    if (auth.currentUser) {
        return true;
    } else {
        return false;
    }
};


export { auth, CreateNewAccount, loginIn, CheckIfUserIsLogged }