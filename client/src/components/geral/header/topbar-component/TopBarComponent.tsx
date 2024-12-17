import { CloseIcon } from "../../../../components/icons/icons"
import { Button } from "../../../../components/ui/button"
import React, { useState } from "react"
import "./TopBarComponent.css"

interface TopBarComponentProps {
    text: string;
}

const TopBarComponent: React.FC<TopBarComponentProps> = ({ text }) => {

    const [isShowing, setShowing] = useState<boolean>(true);
    
    return (
        <section className="topbar-wrapper">
            {isShowing &&
                <div className="topbar-content">
                    <div className="topbar-content-inside">

                    </div>
                    <div className="topbar-content-inside">
                        <span>{text}</span>
                    </div>
                    <div className="topbar-content-inside">
                        <Button title="Fechar" onClick={() => setShowing(!isShowing)} variant={"ghost"}><CloseIcon /></Button>
                    </div>
                </div>
            }
        </section>
    )
}

export default TopBarComponent