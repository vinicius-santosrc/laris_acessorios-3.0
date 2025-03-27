/**
 * Creation Date: 25/01/2025
 * Author: Vinícius da Silva Santos
 * Coordinator: Larissa Alves de Andrade Moreira
 * Developed by: Lari's Acessórios Team
 * Copyright 2025, LARI'S ACESSÓRIOS
 * All rights are reserved. Reproduction in whole or part is prohibited without the written consent of the copyright owner.
*/

import { useEffect, useState } from "react";
import { FaLock, FaMoneyBill, } from 'react-icons/fa';
import "./Config.css";
import { Link } from "react-router-dom";

const configData = [
    {
        id: "billing",
        title: "Pagamentos",
        icon: <FaMoneyBill />,
        children: (
            <section className="billing-section">
                <p>Métodos de pagamento aceitos na aplicação</p>
                <div className="box-section-content">
                    
                </div>
            </section>
        )
    },
];

const Config = () => {
    const [configOptions, setConfigOptions] = useState([]);

    useEffect(() => {
        // Carrega as opções de configuração ao montar o componente
        setConfigOptions(configData);
    }, []);

    return (
        <section className="dashboard-laris-acessorios">
            <div className="dashboard-content">
                <div className="header">
                    <h1 className="title">Configurações da Loja</h1>
                    <p className="subtitle">Gerencie as preferências gerais da sua loja de joalherias.</p>
                </div>
            </div>
        </section>
    );
};

export default Config;
