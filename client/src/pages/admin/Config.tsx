/**
 * Creation Date: 25/01/2025
 * Author: Vinícius da Silva Santos
 * Coordinator: Larissa Alves de Andrade Moreira
 * Developed by: Lari's Acessórios Team
 * Copyright 2025, LARI'S ACESSÓRIOS
 * All rights are reserved. Reproduction in whole or part is prohibited without the written consent of the copyright owner.
*/

import { useEffect, useState } from "react";
import { FaLock, } from 'react-icons/fa';
import "./Config.css";
import { Link } from "react-router-dom";

const configData = [
    {
        "id": "security",
        "title": "Segurança",
        "icon": <FaLock />,
        "buttonText": "VER"
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

                <ul className="config-list">
                    {configOptions.map((option: any) => (
                        <Link key={option.id} to={window.location.href}>
                            <li className="config-item">
                                <div className="config-icon">{option.icon}</div>
                                <h2 className="config-title">{option.title}</h2>
                            </li>
                        </Link>
                    ))}
                </ul>
            </div>
        </section>
    );
};

export default Config;
