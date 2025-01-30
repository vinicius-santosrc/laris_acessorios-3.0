import React, { useState } from "react";
import "./facilitysAdmin.css";
import { adminService } from "../../services/adminService";

export const Facilitys = () => {
    const [foto, setFoto] = useState<any>(null)

    const [newFacility, setNewFacility] = useState({ title: "", description: "", imageUrl: "" });
    const [facilities, setFacilities] = useState([
        { title: "Exemplo 1", description: "Descrição exemplo", imageUrl: "/path/to/image1.jpg" },
        { title: "Exemplo 2", description: "Outra descrição", imageUrl: "/path/to/image2.jpg" },
    ]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewFacility({ ...newFacility, [name]: value });
    };

    const handleAddFacility = (e) => {
        e.preventDefault();
        setFacilities([...facilities, newFacility]);
        setNewFacility({ title: "", description: "", imageUrl: "" }); // Limpa os campos após adicionar
    };

    async function uploadThatFoto(e: any) {
        try {
            const urlDaFoto = await adminService.upload(e);
            setFoto(urlDaFoto)
        }
        catch (error) {
            console.error(error);
            alert("DEU ERRO AO ENVIAR A FOTO")
        }
    }

    return (
        <section className="dashboard-laris-acessorios">
            <div className="dashboard-content">
                <div className="Facility-Content-Page">
                    <div className="header">
                        <h1 className="title">Facilitys</h1>
                        <p className="subtitle">Gerencie os textos/imagens do website.</p>
                    </div>

                    <div className="facility-list">
                        <input type="file" onChange={(e) => uploadThatFoto(e)} />
                    </div>

                    {foto && <img src={foto}></img>}
                </div>
            </div>
        </section>
    );
};
