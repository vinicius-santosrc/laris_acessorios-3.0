import "./facilitysAdmin.css";
import {
    AccordionItem,
    AccordionItemContent,
    AccordionItemTrigger,
    AccordionRoot,
} from "../../components/ui/accordion";
import { Box } from "@chakra-ui/react";
import { adminService } from "../../services/adminService";
import { useEffect, useState } from "react";
import { Facilitys } from "../../services/facilitysService";
import { Button } from "../../components/ui/button";
import { toaster } from "../../components/ui/toaster";

interface FacilityItem {
    reference: string;
    data: string;
    dataMobile: string;
    hasMobile: boolean;
}

interface FacilityProps {
    title: string;
    content: any;
}

export const FacilitysPage = () => {
    const [banners, setBanners] = useState<FacilityItem[]>([]);

    useEffect(() => {
        getFacilitys();
    }, []);

    const getFacilitys = async () => {
        try {
            const facilities = await Facilitys.getAll();
            setBanners(facilities);
        } catch (error) {
            console.error(error);
        }
    };

    async function changeImage(e: any, index: number, isMobile: boolean) {
        const file = e.target.files[0];
        if (file) {
            const uploadPhoto = await adminService.upload(e);
            setBanners((prev) => {
                const updated: any = [...prev];
                if (isMobile) {
                    updated[index].dataMobile = uploadPhoto;
                } else {
                    updated[index].data = uploadPhoto;
                }
                return updated;
            });
        }
    }

    async function saveFacilitys() {
        try {
            for (const banner of banners) {
                await Facilitys.save(banner);
            }
            toaster.create({
                title: "Facilitys",
                description: "Todas as alterações foram salvas com sucesso!",
                type: "success",
            });
        } catch (error) {
            console.error(error);
            toaster.create({
                title: "Facilitys",
                description: "Erro ao atualizar",
                type: "error",
            });
        }
    }

    const FacilitysContent: FacilityProps[] = [
        {
            title: "Imagens",
            content: <div>
                {banners.length > 0 ? (
                    <AccordionRoot spaceY="4" variant="plain" collapsible>
                        {banners.map((banner, index) => (
                            <AccordionItem key={banner.reference} value={banner.reference}>
                                <Box position="relative">
                                    <AccordionItemTrigger indicatorPlacement="start">
                                        {banner.reference}
                                    </AccordionItemTrigger>
                                </Box>
                                <AccordionItemContent>
                                    <div>
                                        <h2>{banner.hasMobile ? "PC" : "Imagem geral (PC/MOBILE)"}</h2>
                                        <img className="categoryImageFacilitys" src={banner.data} alt="Imagem da Categoria" />
                                        <input type="file" onChange={(e) => changeImage(e, index, false)} />
                                    </div>

                                    {banner.hasMobile ?

                                        <div>
                                            <h2>MOBILE</h2>
                                            <img className="categoryImageFacilitys" src={banner.dataMobile} alt="Imagem da Categoria" />
                                            <input type="file" onChange={(e) => changeImage(e, index, true)} />
                                        </div>
                                        : null}
                                </AccordionItemContent>
                            </AccordionItem>
                        ))}
                    </AccordionRoot>
                ) : null}
            </div>
        }
    ]

    return (
        <section className="dashboard-laris-acessorios">
            <div className="dashboard-content">
                <div className="Facility-Content-Page">
                    <div className="header">
                        <h1 className="title">Facilitys</h1>
                        <p className="subtitle">Gerencie os componentes e as imagens do website.</p>
                        <div className="actions">
                            <Button onClick={saveFacilitys} className="savebtn">Salvar alterações</Button>
                        </div>
                    </div>

                    {FacilitysContent.map((facilityItem: FacilityProps) => {
                        return (
                            <>
                                <div className="contentPage">
                                    <h1>{facilityItem.title}</h1>
                                </div>
                                {facilityItem.content}
                            </>
                        )
                    })}
                </div>
            </div>
        </section>
    );
};
