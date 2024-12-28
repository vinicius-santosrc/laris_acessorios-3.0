import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AccountIcon } from "../../../../components/icons/icons";
import { Button } from "../../../../components/ui/button";
import {
    DialogBody,
    DialogCloseTrigger,
    DialogContent,
    DialogRoot,
    DialogTrigger,
} from "../../../../components/ui/dialog";
import { FormAccount } from "../FormAccount";
import { Checkbox } from "../../../../components/ui/checkbox";
import "../Header.css";
import LogoHeader from "../../../../images/logo.webp";

const AccountComponent = () => {
    const [isRegistering, setIsRegistering] = useState<boolean>(false);
    const [formValues, setFormValues] = useState<any>({});
    const [error, setError] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);

    const FormLoginAccount = [{
        label: <span>ENTRE EM NOSSO GRUPO E CONCORRA A <br /><span className="breaklineHeader">CUPONS EXCLUSIVOS</span></span>,
        btnLabel: "Entrar",
        photoURL: "https://uploaddeimagens.com.br/images/004/878/465/full/IMG_7323.png?1735408579",
        btnForm: [
            { label: "E-mail", value: "", required: true },
            { label: "Senha", value: "", required: true },
        ]
    }];

    const FormRegisterAccount = [{
        label: <span>NA SUA PRIMEIRA COMPRA, <br /><span className="breaklineHeader">VOCÊ GANHA 15% OFF</span><br /> Com o cupom BEMVINDO</span>,
        btnLabel: "Cadastrar",
        photoURL: "https://uploaddeimagens.com.br/images/004/878/465/full/IMG_7323.png?1735408579",
        btnForm: [
            { label: "Nome completo", value: "", required: true },
            { label: "E-mail", value: "", required: true },
            { label: "CPF", value: "", required: true },
            { label: "Senha", value: "", required: true },
        ]
    }];

    const handleToggleForm = () => {
        setIsRegistering(!isRegistering);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        setFormValues({
            ...formValues,
            [field]: e.target.value,
        });
    };

    const handleSubmit = () => {
        const fields = formData[0].btnForm;
        const missingFields = fields.filter((field: any) => field.required && !formValues[field.label]);

        if (missingFields.length > 0) {
            setError("Preencha todos os campos obrigatórios.");
        } else {
            setError(null);
            console.log(JSON.stringify(formValues, null, 2));
            alert(JSON.stringify(formValues, null, 2));
        }
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const formData = isRegistering ? FormRegisterAccount : FormLoginAccount;

    return (
        <DialogRoot size={"lg"} motionPreset="slide-in-bottom" placement="center">
            <DialogTrigger asChild>
                <Button variant="ghost" aria-label="Conta">
                    <AccountIcon />
                </Button>
            </DialogTrigger>
            <DialogContent className={isMobile ? "dialogContentMobile" : ""}>
                <DialogBody>
                    <FormAccount
                        photoRef={formData[0].photoURL}
                        component={
                            <div className="inside-form-component">
                                <div className="header-top">
                                    <img src={LogoHeader} alt="LARIS ACESSÓRIOS" />
                                </div>
                                <form>
                                    <div className="header-inside-component">{formData[0].label}</div>
                                    {formData[0].btnForm.map((field: any, index) => (
                                        <div key={index} className="form-field">
                                            <label>{field.label}</label>
                                            <input
                                                type={field.label === "Senha" ? "password" : "text"}
                                                value={formValues[field.label] || ""}
                                                onChange={(e) => handleInputChange(e, field.label)}
                                            />
                                        </div>
                                    ))}
                                    {isRegistering && (
                                        <Checkbox variant={"subtle"} className="checkbox">
                                            <span>Estou ciente e aceito os termos da <Link to={window.location.origin}>Politica de Privacidade</Link></span>
                                        </Checkbox>
                                    )}
                                    {error && <div style={{ color: "red" }}>{error}</div>}
                                </form>
                                <Button onClick={handleSubmit} className="finalizeBtn">{formData[0].btnLabel}</Button>
                                <div className="btnBottom">
                                    <Button variant="link" onClick={handleToggleForm}>
                                        {isRegistering ? "Já tem conta? Entrar" : "Não tem conta? Cadastre-se"}
                                    </Button>
                                </div>
                            </div>
                        }
                    />
                </DialogBody>
                <DialogCloseTrigger />
            </DialogContent>
        </DialogRoot>
    );
};

export default AccountComponent;
