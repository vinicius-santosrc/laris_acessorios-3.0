import { useState, useEffect } from "react";
import { Checkbox } from "../../../components/ui/checkbox";
import { AccordionItem, AccordionItemContent, AccordionItemTrigger, AccordionRoot } from "../../../components/ui/accordion";
import "../../../styles/categories.css";
import { Radio, RadioGroup } from "../../../components/ui/radio";
import { DialogTitle, Separator, Text } from "@chakra-ui/react";
import { Button } from "../../ui/button";
import { CloseButton } from "../../../components/ui/close-button";
import { DialogRoot, DialogTrigger, DialogContent, DialogBody, DialogCloseTrigger } from "../../../components/ui/dialog";  // Ajuste no uso do Modal
import { FilterIcon } from "lucide-react";

const CategoryFilter = ({ onPriceChange, onFilterChange, selectedFilters }) => {
    const [items, setItems] = useState([
        { id: 1, title: "Coleções", options: [] },
        { id: 2, title: "Seleção", options: [{ label: "Presentes para Ela", value: "para-ela" }] },
        { id: 3, title: "Material", options: [{ label: "Prata de lei", value: "pratas" }, { label: "Banhados a ouro", value: "banhados-a-ouro" }] }
    ]);

    const [isMobile, setIsMobile] = useState(false);  // Estado para verificar se é mobile

    // UseEffect para detectar o tamanho da tela
    useEffect(() => {
        const handleResize = () => {
            // Verifica se a largura da tela é menor ou igual a 768px
            setIsMobile(window.innerWidth <= 768);
        };

        // Chama imediatamente para definir o estado inicial
        handleResize();

        // Adiciona o listener para mudanças no tamanho da tela
        window.addEventListener("resize", handleResize);

        // Limpa o listener quando o componente for desmontado
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const handlePriceChange = (value: any) => {
        onPriceChange(value);
    };

    const clearFilters = () => {
        onFilterChange("Coleções", []);
        onFilterChange("Seleção", [{ label: "Presentes para Ela", value: "para-ela" }]);
        onFilterChange("Material", [{ label: "Prata de lei", value: "pratas" }, { label: "Banhados a ouro", value: "banhados-a-ouro" }]);
    };

    return (
        <section className="category-filter-content">
            {!isMobile ?
                <div className="category-filter-wrapper">
                    <div className="category-filter__header">
                        <p>JOALHERIA</p>
                    </div>
                    <div className="category-filter__body">
                        <div className="category-first-options">
                            <AccordionRoot collapsible defaultValue={["b"]}>
                                {items?.map((item, index) => (
                                    <AccordionItem key={index} value={item.title}>
                                        <AccordionItemTrigger><h2>{item.title.toUpperCase()}</h2></AccordionItemTrigger>
                                        <AccordionItemContent>
                                            {item?.options?.map((option, optionIndex) => (
                                                <div key={optionIndex} className="option-container">
                                                    <Checkbox
                                                        checked={selectedFilters[item.title]?.includes(option.value)} // Mudamos para usar 'value'
                                                        onChange={() => onFilterChange(item.title, option)} // Passando o valor correto
                                                    >
                                                        {option.label}
                                                    </Checkbox>
                                                </div>
                                            ))}
                                        </AccordionItemContent>
                                    </AccordionItem>
                                ))}
                            </AccordionRoot>
                        </div>
                        <Separator variant="solid" />
                        <div className="category-orderby">
                            <h2>ORDENAR POR:</h2>
                            <div className="orderBy-component">
                                <RadioGroup className="radioGroup">
                                    <Radio value="1" onClick={() => handlePriceChange("1")}>MAIOR PREÇO</Radio>
                                    <Radio value="2" onClick={() => handlePriceChange("2")}>MENOR PREÇO</Radio>
                                </RadioGroup>
                            </div>
                        </div>
                        <Separator variant="solid" />
                        <div className="categor-bottom">
                            <Button onClick={clearFilters}>
                                <CloseButton /> LIMPAR FILTRO
                            </Button>
                        </div>
                    </div>
                </div>
                : null}

            {isMobile ?
                <div className="category-filter-wrapper">
                    <div className="category-filter__body">
                        <DialogRoot size="full" motionPreset="slide-in-bottom" placement="center">
                            <DialogTrigger asChild>
                                <Button variant="outline" className="mobile-filter-button">
                                    <FilterIcon /> FILTRAR
                                </Button>
                            </DialogTrigger>
                            <DialogContent paddingY={24} paddingX={4} backgroundColor={"white"}>
                                <DialogTitle fontSize={24}>
                                    JOALHERIA
                                </DialogTitle>
                                <DialogBody className="body-category-mobile">
                                    <div className="category-first-options">
                                        <AccordionRoot collapsible defaultValue={["b"]}>
                                            {items?.map((item, index) => (
                                                <AccordionItem key={index} value={item.title}>
                                                    <AccordionItemTrigger><h2>{item.title.toUpperCase()}</h2></AccordionItemTrigger>
                                                    <AccordionItemContent>
                                                        {item?.options?.map((option, optionIndex) => (
                                                            <div key={optionIndex} className="option-container">
                                                                <Checkbox
                                                                    checked={selectedFilters[item.title]?.includes(option.value)}
                                                                    onChange={() => onFilterChange(item.title, option)}
                                                                >
                                                                    {option.label}
                                                                </Checkbox>
                                                            </div>
                                                        ))}
                                                    </AccordionItemContent>
                                                </AccordionItem>
                                            ))}
                                        </AccordionRoot>
                                    </div>
                                    <Separator variant="solid" />
                                    <div className="category-orderby">
                                        <h2>ORDENAR POR:</h2>
                                        <div className="orderBy-component">
                                            <RadioGroup className="radioGroup">
                                                <Radio value="1" onClick={() => handlePriceChange("1")}>MAIOR PREÇO</Radio>
                                                <Radio value="2" onClick={() => handlePriceChange("2")}>MENOR PREÇO</Radio>
                                            </RadioGroup>
                                        </div>
                                    </div>
                                    <Separator variant="solid" />
                                    <div className="categor-bottom">
                                        <Button onClick={clearFilters}>
                                            <CloseButton /> LIMPAR FILTRO
                                        </Button>
                                    </div>
                                </DialogBody>
                                <DialogCloseTrigger />
                            </DialogContent>
                        </DialogRoot>
                    </div>
                </div>
                : null}
        </section>
    );
};

export default CategoryFilter;
