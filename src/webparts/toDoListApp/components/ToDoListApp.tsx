import * as React from 'react';
import styles from './ToDoListApp.module.scss';
import { IToDoListAppProps } from './IToDoListAppProps';
import { IToDoListAppState } from './IToDoListAppState';
import { escape } from '@microsoft/sp-lodash-subset';
import { Checkbox, Label, ActionButton, IIconProps } from 'office-ui-fabric-react';
import { IToDoItem } from '../contracts/IToDoItem';

const addIcon: IIconProps = { iconName: 'Add' };

const createToDoItems = (length = 10): IToDoItem[] => {
  let items: IToDoItem[] = [];
  for(let i = 0; i < length; i++ )
    items.push({
      id: i,
      label: 'item ' + i,
      isChecked: false
    });
  return items;
};

export default class ToDoListApp extends React.Component<IToDoListAppProps, IToDoListAppState> {
  
  constructor(props: IToDoListAppProps){
    super(props);

    this.state = {
      items: createToDoItems(),
      newItem: null
    };
  }

  public  changeIsCheckedItem(item: IToDoItem, checked: boolean) {
    let { items } = this.state;

    const itemIndex = items.indexOf(item);
    
    if(itemIndex != -1)
      items[itemIndex].isChecked = checked;

    this.setState({
      items
    });

    //Colocar aqui um update item na lista do sharepoint mundando o valor da prop IsChecked
  }

  public saveNewItem(){
    let { items, newItem } = this.state;

    if(newItem != null){
      items.push(newItem);

      this.setState({
        items, 
        newItem: null
      });
    }
  }
  
  public render(): React.ReactElement<IToDoListAppProps> {
    const { items } = this.state;

    const itemsChecked =  items.filter((item)=>(item.isChecked));
    const itemsUnChecked =  items.filter((item)=>(!item.isChecked));

    return (
      <div className={ styles.toDoListApp }>
        
        <h1>To Do</h1>
        <ActionButton styles={{icon:{margin:0}, root: {padding: 0}}} iconProps={addIcon} allowDisabledFocus  onClick={()=>{console.log('click');}}>
          New Item
        </ActionButton>        
        {
          itemsUnChecked.map((item: IToDoItem, index: number)=>(
            <div className={styles.item} key={'item' + item.id}>
              <Checkbox checked={item.isChecked} label={item.label} onChange={(e,checked: boolean) => this.changeIsCheckedItem(item, checked)} />
            </div>
          ))
        }
        <h1>To Done</h1>
        {
          itemsChecked.map((item: IToDoItem, index: number)=> (
            <div className={styles.item} key={'item' + item.id}>
              <Checkbox checked={item.isChecked} label={item.label} onChange={(e,checked: boolean) => this.changeIsCheckedItem(item, checked)} />
            </div>
          ))
        }
      </div>
    );
  }
}
