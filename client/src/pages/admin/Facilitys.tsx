import "./facilitysAdmin.css";
import {
    AccordionItem,
    AccordionItemContent,
    AccordionItemTrigger,
    AccordionRoot,
} from "../../components/ui/accordion"
import { Box } from "@chakra-ui/react";
import { adminService } from "../../services/adminService";
import { useEffect, useState } from "react";
import { Facilitys } from "../../services/facilitysService";
import { Button } from "../../components/ui/button";
import { toaster } from "../../components/ui/toaster";

export const FacilitysPage = () => {
    const [banner, setBanner] = useState<any>();

    useEffect(() => {
        getFacilitys();
    }, []);

    const getFacilitys = async () => {
        try {
            const facility = await Facilitys.get("banner-principal");
            setBanner(facility)
        }
        catch (error) {
            console.error(error);
        }
    }

    async function changeImage(e: any, item: any) {
        const file = e.target.files[0];
        if (file) {
            const uploadPhoto = await adminService.upload(e);
            setBanner({ ...banner, data: uploadPhoto })
        }
    }

    async function changeImageMobile(e: any, item: any) {
        const file = e.target.files[0];
        if (file) {
            const uploadPhoto = await adminService.upload(e);
            setBanner({ ...banner, dataMobile: uploadPhoto })
        }
    }
    
    async function saveCategories() {
        try {
            await Facilitys.save(banner);
            toaster.create({
                title: `Facilitys`,
                description: `${banner.reference} foi editado com sucesso`,
                type:"sucess"
            })
        }
        catch (error) {
            console.error(error);
            toaster.create({
                title: "Facilitys",
                description: "Erro ao atualizar",
                type:"error"
            })
        }
    }

    return (
        <section className="dashboard-laris-acessorios">
            <div className="dashboard-content">
                <div className="Facility-Content-Page">
                    <div className="header">
                        <h1 className="title">Facilitys</h1>
                        <p className="subtitle">Gerencie as imagens do website.</p>
                        <div className="actions">
                            <Button onClick={saveCategories} className="savebtn">Salvar alterações</Button>
                        </div>
                    </div>
                    {banner ?
                        <AccordionRoot spaceY="4" variant="plain" collapsible defaultValue={["b"]}>
                            <AccordionItem value={"banner-principal"}>
                                <Box position="relative">
                                    <AccordionItemTrigger indicatorPlacement="start">
                                        Banner Principal
                                    </AccordionItemTrigger>
                                </Box>
                                <AccordionItemContent>
                                    <div>
                                        <h2>PC</h2>
                                        <img className="categoryImageFacilitys" src={banner.data} alt="Imagem da Categoria" />
                                        <input type="file" placeholder="Alterar imagem" onChange={(e) => { changeImage(e, "banner-principal") }} />
                                    </div>

                                    <div>
                                        <h2>MOBILE</h2>
                                        <img className="categoryImageFacilitys" src={banner.dataMobile} alt="Imagem da Categoria" />
                                        <input type="file" placeholder="Alterar imagem mobile" onChange={(e) => { changeImageMobile(e, "banner-principal") }} />
                                    </div>
                                </AccordionItemContent>
                            </AccordionItem>
                        </AccordionRoot>
                        :
                        null
                    }
                </div>
            </div>
        </section>
    );
};
