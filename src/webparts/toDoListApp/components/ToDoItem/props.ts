import { IToDoItem } from "../../contracts/IToDoItem";

export interface IToDoItemProps {
    item: IToDoItem;
    changeItem: (item: IToDoItem) => void;
    removeItem: (item: IToDoItem) => void;
    className?: string; 
}