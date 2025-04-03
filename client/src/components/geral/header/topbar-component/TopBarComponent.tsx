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