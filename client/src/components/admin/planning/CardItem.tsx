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
