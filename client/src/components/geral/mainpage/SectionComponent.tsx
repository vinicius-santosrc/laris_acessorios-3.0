/**
 * Creation Date: 23/07/2025
 * Author: Vinícius da Silva Santos
 * Coordinator: Larissa Alves de Andrade Moreira
 * Developed by: Lari's Acessórios Team
 * Copyright 2025, LARI'S ACESSÓRIOS
 * All rights are reserved. Reproduction in whole or part is prohibited without the written consent of the copyright owner.
*/

import React from "react"
import "./SectionComponent.css"

const SectionComponent: React.FC<any> = ({ title, description, hasDescription, component }) => {
    return (
        <section className="section-component-wrapper">
            <div className="section-component-content">
                <div className="section-component-title">
                    <h1>{ title }</h1>
                    {hasDescription && <span>{description}</span>}
                </div>
                {component}
            </div>
        </section>
    )
}

export default SectionComponent;