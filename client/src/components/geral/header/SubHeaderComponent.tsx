/**
 * Creation Date: 23/07/2025
 * Author: Vinícius da Silva Santos
 * Coordinator: Larissa Alves de Andrade Moreira
 * Developed by: Lari's Acessórios Team
 * Copyright 2025, LARI'S ACESSÓRIOS
 * All rights are reserved. Reproduction in whole or part is prohibited without the written consent of the copyright owner.
*/

import React from "react";
import "./Header.css";
import { Link } from "react-router-dom";

const SubHeaderComponent: React.FC<any> = ({ itemHover, isOpen }) => {
    return (
        isOpen && itemHover?.subItems && (
            <section className="subheader-component-wrapper">
                <div className="subheader-inside">
                    <div className="subheader-left-side">
                        <div className="subheader-title">
                            <h2>EXPLORE: {itemHover.title.toUpperCase()}</h2>
                        </div>
                        <div className="subheader-component">
                            {itemHover?.subItems.map((item: any, id: number) => {
                                return (
                                    <div key={id} className="item-component">
                                        <Link target="_parent" to={item.href}><h1>{item.title}</h1></Link>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="subheader-bottom">
                            <Link target="_parent" to={window.location.origin}><span><b>Conheça todos nossos produtos</b></span></Link>
                        </div>
                    </div>
                    <div className="subheader-right-side">
                        <img alt={itemHover.title} src={itemHover.imgMenuItem} />
                    </div>
                </div>
            </section>
        )
    );
};

export default SubHeaderComponent;
