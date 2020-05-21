import { IToDoItem } from "../../contracts/IToDoItem";

export interface IToDoItemProps {
    item: IToDoItem;
    changeItem: (item: IToDoItem) => void;
    className?: string; 
}