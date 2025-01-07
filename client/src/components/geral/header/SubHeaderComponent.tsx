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
                            <h1>{itemHover.title.toUpperCase()}</h1>
                        </div>
                        <div className="subheader-component">
                            {itemHover?.subItems.map((item: any, id: number) => {
                                return (
                                    <div key={id} className="item-component">
                                        <Link to={item.href}><h1>{item.title}</h1></Link>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="subheader-bottom">
                            <Link to={window.location.origin}><span><b>Conheça todos nossos produtos</b></span></Link>
                        </div>
                    </div>
                    <div className="subheader-right-side">
                        <img alt={itemHover.title} src={itemHover.photoURL} />
                    </div>
                </div>
            </section>
        )
    );
};

export default SubHeaderComponent;
