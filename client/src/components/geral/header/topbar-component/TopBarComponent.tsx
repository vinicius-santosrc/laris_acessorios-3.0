/**
 * Creation Date: 23/07/2025
 * Author: Vinícius da Silva Santos
 * Coordinator: Larissa Alves de Andrade Moreira
 * Developed by: Lari's Acessórios Team
 * Copyright 2025, LARI'S ACESSÓRIOS
 * All rights are reserved. Reproduction in whole or part is prohibited without the written consent of the copyright owner.
*/

import { CloseIcon } from "../../../../components/icons/icons"
import { Button } from "../../../../components/ui/button"
import React, { useEffect, useState } from "react"
import "./TopBarComponent.css"

interface TopBarComponentProps {
    isTransparent: boolean;
    text: string;
}

const TopBarComponent: React.FC<TopBarComponentProps> = ({ isTransparent, text }) => {

    const [isShowing, setShowing] = useState<boolean>(true);
    const [isClosed, setClosed] = useState<boolean>(false);

    useEffect(() => {
        if (isClosed) {
            return setShowing(false)
        }
        else if ((window.scrollY <= 15) && !isClosed) {
            setShowing(true)
        }
        else {
            setShowing(false);
        }
    }, [isTransparent])

    if (window.location.href.includes("checkout")) {
        return
    }


    return (
        isShowing && !isClosed &&
        <section className="topbar-wrapper">
            <div className="topbar-content">
                <div className="topbar-content-inside">

                </div>
                <div className="topbar-content-inside">
                    <span>{text.toUpperCase()}</span>
                </div>
                <div className="topbar-content-inside">
                    <Button title="Fechar" onClick={() => setClosed(true)} variant={"ghost"}><CloseIcon /></Button>
                </div>
            </div>
        </section>

    )
}

export default TopBarComponent