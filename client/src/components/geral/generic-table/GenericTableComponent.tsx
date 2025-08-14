import React, { useState } from "react";
import {
    DialogCloseTrigger,
    DialogContent,
    DialogRoot,
    DialogTrigger,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Editable } from "@chakra-ui/react";
import { ActionBar } from "@chakra-ui/react"
import { LuSave, LuTrash2 } from "react-icons/lu";
import { Edit3Icon, FileWarningIcon, PlusCircleIcon, Trash } from "lucide-react";

interface Column {
    label: string;
    key: string;
    type: any;
}

interface GenericTableProps {
    columns: Column[];
    data: any[];
    currentItem: any;
    setCurrentItem: React.Dispatch<React.SetStateAction<any>>;
    onSave: () => void;
    onSaveAll: (localData: any) => void;
    onEdit: (item: any) => void;
    onDelete: (item: any) => void;
    inputPlaceholders?: { [key: string]: string };
    addItemOpen: boolean;
    setAddItemOpen: React.Dispatch<React.SetStateAction<boolean>>;
    actions: boolean;
}


const GenericTable: React.FC<GenericTableProps> = ({
    columns,
    data,
    currentItem,
    setCurrentItem,
    onSave,
    onSaveAll,
    onEdit,
    onDelete,
    inputPlaceholders = {},
    addItemOpen,
    setAddItemOpen,
    actions,
}) => {
    const [localData, setLocalData] = useState([...data]);

    // Atualiza o valor inline do Editable
    const handleEditableChange = (index: number, key: string, value: any) => {
        const updated = [...localData];
        updated[index] = { ...updated[index], [key]: value };
        setLocalData(updated);
    };

    // Atualiza o currentItem para o modal
    const handleInputChange = (key: string, value: any) => {
        setCurrentItem((prev: any) => ({
            ...prev,
            [key]: value,
        }));
    };

    // Salvar todas as alterações
    const handleSave = () => {
        // Atualiza os itens do backend via onSave
        onSave(localData, currentItem);
        setAddItemOpen(false);
    };

    // Salvar todas as alterações
    const handleSaveAll = () => {
        // Atualiza os itens do backend via onSave
        onSaveAll(localData);
        setAddItemOpen(false);
    };

    React.useEffect(() => {
        setLocalData([...data]);
    }, [data]);

    return (
        <div className="generic-table-container">
            <ActionBar.Root open={JSON.stringify(data) !== JSON.stringify(localData)}>
                <ActionBar.Positioner background={"transparent"}>
                    <ActionBar.Content background={"white"} boxShadow={"0.1px 5px 15px gray"} padding={2} zIndex={1000000}>
                        <ActionBar.SelectionTrigger>
                            Você alterou itens da tabela atual, deseja salvar os itens?
                        </ActionBar.SelectionTrigger>
                        <Button variant="outline" onClick={handleSaveAll} size="sm">
                            <LuSave />
                            Salvar
                        </Button>
                        <Button variant="outline" size="sm">
                            <DialogRoot>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        <LuTrash2 />
                                        Descartar
                                    </Button>
                                </DialogTrigger>

                                <DialogContent>
                                    <div className="confirmation-modal" style={{ padding: 20, textAlign: "center" }}>
                                        <div className="flex items-center">
                                            <div>
                                                <FileWarningIcon />
                                            </div>
                                            <div>
                                                <p>Tem certeza que deseja descartar as alterações?</p>
                                                <p>Essa ação não poderá ser desfeita.</p>
                                            </div>
                                        </div>
                                        <div style={{ marginTop: 20, display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                                            <Button
                                                variant="default"
                                                style={{ background: "red", padding: 4, width: 200, color: "white", borderRadius: 4 }}
                                                onClick={() => {
                                                    setLocalData([...data]); // descarta alterações
                                                }}
                                            >
                                                Sim
                                            </Button>
                                            <DialogCloseTrigger position={"relative"}>
                                                <Button
                                                    style={{ width: 200, padding: 4, borderRadius: 4 }}
                                                    variant="default">
                                                    Não
                                                </Button>
                                            </DialogCloseTrigger>
                                        </div>
                                    </div>
                                </DialogContent>
                            </DialogRoot>
                        </Button>
                        <ActionBar.CloseTrigger />
                        <ActionBar.Separator />
                    </ActionBar.Content>
                </ActionBar.Positioner>
            </ActionBar.Root>
            {/* DIALOG PARA ADIÇÃO/EDIÇÃO */}
            <DialogRoot open={addItemOpen} placement={"center"}>
                <DialogTrigger asChild>
                    <Button style={{ background: "green", width: 200, margin: 'center', padding: 4, borderRadius: 4, color: "white", display: "flex", alignItems: "center" }} onClick={() => setAddItemOpen(true)}><PlusCircleIcon /> Adicionar item</Button>
                </DialogTrigger>

                <DialogContent padding={4}>
                    <div className="form-add-edit">
                        <h1>Adição/Edição de linha</h1>
                        {columns.map(({ label, key, type }) => (
                            <div key={key} style={{ paddingTop: 4 }} className="form-group">
                                <label>{label}</label>
                                {typeof type === "object" ? (
                                    <select
                                        value={currentItem[key] || ""}
                                        onChange={e => handleInputChange(key, e.target.value)}
                                    >
                                        {type.map((item: any) => (
                                            <option key={item.option} value={item.option}>
                                                {item.label}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type={type ?? "text"}
                                        placeholder={inputPlaceholders[key] || ""}
                                        value={currentItem[key] || ""}
                                        onChange={(e) => handleInputChange(key, e.target.value)}
                                    />
                                )}
                            </div>
                        ))}
                        <Button style={{ background: "green", width: 200, margin: 'center', padding: 4, borderRadius: 4, color: "white", display: "flex", alignItems: "center" }} onClick={handleSave}>Salvar tudo</Button>
                        <DialogCloseTrigger onClick={() => setAddItemOpen(false)} />
                    </div>
                </DialogContent>
            </DialogRoot>

            {/* TABELA INLINE EDIT */}
            <table className="generic-table">
                <thead>
                    <tr>
                        {columns.map(({ label, key }) => (
                            <th key={key}>{label}</th>
                        ))}
                        {actions && <th>Ações</th>}
                    </tr>
                </thead>
                <tbody>
                    {localData?.map((item: any, index: number) => (
                        <tr key={index}>
                            {columns.map(({ key, type }) => (
                                <td key={key}>
                                    {typeof type !== "object" ? (
                                        <Editable.Root
                                            background={"transparent"}
                                            zIndex={1}
                                            style={{ fontWeight: 600, textAlign: "center", justifyContent: "center" }}
                                            defaultValue={String(item[key] ?? "")}
                                            activationMode="dblclick"
                                        >
                                            <Editable.Preview zIndex={1} />
                                            <Editable.Input
                                                zIndex={1}
                                                value={item[key]}
                                                onChange={(e: any) => handleEditableChange(index, key, e.target.value)}
                                            />
                                        </Editable.Root>
                                    ) :
                                        (
                                            <select
                                                value={item[key] || ""}
                                                onChange={e => handleEditableChange(index, key, e.target.value)}
                                            >
                                                {type.map((item: any) => (
                                                    <option key={item.option} value={item.option}>
                                                        {item.label}
                                                    </option>
                                                ))}
                                            </select>
                                        )
                                    }
                                </td>
                            ))}
                            {actions && (
                                <td>
                                    <Button onClick={() => onEdit(item)}><Edit3Icon /></Button>
                                    <Button onClick={() => onDelete(item)}><Trash color="red" /></Button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default GenericTable;