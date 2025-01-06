import "../../styles/loader.css";
import logoHeader from "../../images/logo.svg";
import { Loader2Icon } from "lucide-react";
export const Loader = () => {
    return (
        <section className="loader-component">
            <div className="loader-backdrop"></div>
            <div className="loader-inside">
                <Loader2Icon className="loader-content" />
            </div>
        </section>
    )
}