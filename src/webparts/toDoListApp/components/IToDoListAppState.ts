import { IToDoItem } from "../contracts/IToDoItem";

export interface IToDoListAppState {
    items: IToDoItem[];
    newItem: IToDoItem;
}