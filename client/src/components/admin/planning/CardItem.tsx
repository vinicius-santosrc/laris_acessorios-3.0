/**
 * Creation Date: 23/07/2025
 * Author: Vinícius da Silva Santos
 * Coordinator: Larissa Alves de Andrade Moreira
 * Developed by: Lari's Acessórios Team
 * Copyright 2025, LARI'S ACESSÓRIOS
 * All rights are reserved. Reproduction in whole or part is prohibited without the written consent of the copyright owner.
*/

import { Draggable } from "react-beautiful-dnd";

const CardItem = ({ item, index, removeItem }: { item: string, index: number, removeItem: () => void }) => {
    return (
        <Draggable draggableId={item} index={index}>
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="flexbox-content"
                >
                    <div className="contents-card">{item}</div>
                    <button onClick={removeItem}><i className="fa-solid fa-minus"></i></button>
                </div>
            )}
        </Draggable>
    );
};

export default CardItem;
