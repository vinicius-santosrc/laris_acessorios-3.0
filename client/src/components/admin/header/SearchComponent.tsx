/**
 * Creation Date: 10/11/2025
 * Author: Vinícius da Silva Santos
 * Coordinator: Larissa Alves de Andrade Moreira
 * Developed by: Lari's Acessórios Team
 * Copyright 2025, LARI'S ACESSÓRIOS
 * All rights are reserved. Reproduction in whole or part is prohibited without the written consent of the copyright owner.
*/

import { useRef, useState, useEffect } from "react";
import { Input, Popover, Portal, Text, Box } from "@chakra-ui/react";
import { DASHBOARD_SEARCH_OPTIONS } from "../../../utils/searchOptions";
import "./SearchComponent.css";

const SearchComponent = () => {
    const [value, setValue] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const [options, setOptions] = useState<any[]>([]);
    const [filteredOptions, setFilteredOptions] = useState<any[]>([]);

    useEffect(() => {
        const loadOptions = async () => {
            const result = await DASHBOARD_SEARCH_OPTIONS();
            setOptions(result);
        };
        loadOptions();
    }, []);

    useEffect(() => {
        if (value) {
            const filtered = options.filter((option) => {
                const search = value?.toLowerCase() || "";
                return (
                    String(option.label || "")
                        .toLowerCase()
                        .includes(search) ||
                    String(option.name_product || "")
                        .toLowerCase()
                        .includes(search) ||
                    option.items?.some(
                        (item: any) =>
                            String(item.name || "")
                                .toLowerCase()
                                .includes(search) ||
                            String(item.user || "")
                                .toLowerCase()
                                .includes(search)
                    )
                );
            });
            setFilteredOptions(filtered);
        } else {
            setFilteredOptions([]);
        }
    }, [value, options]);

    return (
        <Box position="relative" w="400px">
            <Input
                ref={inputRef}
                placeholder="Buscar"
                background="white"
                onChange={(e) => setValue(e.target.value)}
                padding={2}
                width="100%"
                variant="subtle"
                value={value}
            />

            <Popover.Root
                open={!!value}
                focusManagement={false}
                autoFocus={false}
                trapFocus={false}
                returnFocusOnClose={false}
                closeOnBlur={false}
            >
                <Popover.Anchor ref={inputRef} />

                <Portal>
                    <Popover.Positioner>
                        <Popover.Content width="400px">
                            <Popover.Arrow />
                            <Popover.Body>
                                <Popover.Title fontWeight="medium">Sugestões</Popover.Title>
                                <Box mt={2}>
                                    {value ? (
                                        <>
                                            <Text>Resultado da busca para: <strong>{value}</strong></Text>
                                            <div className="items-suggestions">
                                                {filteredOptions.map((option) => (
                                                    <Box
                                                        key={option.value}
                                                        display="flex"
                                                        alignItems="center"
                                                        padding={2}
                                                        borderRadius="md"
                                                        _hover={{ backgroundColor: "gray.100", cursor: "pointer" }}
                                                        onClick={() => (window.location.href = option.url)}
                                                    >
                                                        <Box mr={2}>{option.icon}</Box>
                                                        <Text>{option.label}</Text>
                                                    </Box>
                                                ))}
                                            </div>
                                        </>
                                    ) : (
                                        <Text>Digite algo para buscar.</Text>
                                    )}
                                </Box>
                            </Popover.Body>
                        </Popover.Content>
                    </Popover.Positioner>
                </Portal>
            </Popover.Root>
        </Box>
    );
};

export default SearchComponent;