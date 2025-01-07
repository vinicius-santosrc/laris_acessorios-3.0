import { useState } from "react";
import { Checkbox } from "../../../components/ui/checkbox";
import { AccordionItem, AccordionItemContent, AccordionItemTrigger, AccordionRoot } from "../../../components/ui/accordion";
import "../../../styles/categories.css";
import { Radio, RadioGroup } from "../../../components/ui/radio";
import { Button, Separator, Text } from "@chakra-ui/react";
import { CloseButton } from "../../../components/ui/close-button";

const CategoryFilter = () => {
    const [items, setItems] = useState([
        { id: 1, title: "Coleções", options: [] },
        { id: 2, title: "Seleção", options: ["PARA ELA"] },
        { id: 3, title: "Material", options: ["Prata de lei"]}
    ]);

    const [selectedFilters, setSelectedFilters] = useState<any>({
        "Coleções": ["LOVE"],
        "Seleção": ["PARA ELA"], 
        "Material": ["Prata de lei"]
    });

    const handleFilterChange = (category: any, option: any) => {
        setSelectedFilters((prevFilters: any) => {
            const newFilters: any = { ...prevFilters };
            if (newFilters[category].includes(option)) {
                newFilters[category] = newFilters[category].filter((item: any) => item !== option);
            } else {
                newFilters[category].push(option);
            }
            return newFilters;
        });
    };

    const clearFilters = () => {
        setSelectedFilters({
            "Coleções": [],
            "Seleção": [],
        });
    };

    return (
        <section className="category-filter-content">
            <div className="category-filter-wrapper">
                <div className="category-filter__header">
                    <p>JOALHERIA</p>
                </div>
                <div className="category-filter__body">
                    <div className="category-first-options">
                        <AccordionRoot collapsible defaultValue={["b"]}>
                            {items.map((item, index) => (
                                <AccordionItem key={index} value={item.title}>
                                    <AccordionItemTrigger><h2>{item.title.toUpperCase()}</h2></AccordionItemTrigger>
                                    <AccordionItemContent>
                                        {item.options.map((option, optionIndex) => (
                                            <div key={optionIndex} className="option-container">
                                                <Checkbox
                                                    checked={selectedFilters[item.title]?.includes(option)}
                                                    onChange={() => handleFilterChange(item.title, option)}
                                                >
                                                    {option}
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
                            <RadioGroup className="radioGroup" >
                                <Radio value="1">MAIOR PREÇO</Radio>
                                <Radio value="2">MENOR PREÇO</Radio>
                            </RadioGroup>
                        </div>
                    </div>
                    <Separator variant="solid" />
                    <div className="categor-bottom">
                        <Button onClick={clearFilters}>
                            <CloseButton /> <Text>LIMPAR FILTRO</Text>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CategoryFilter;
