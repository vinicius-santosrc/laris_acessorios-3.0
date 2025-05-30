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