import * as React from 'react';
import styles from './ToDoListApp.module.scss';
import { IToDoListAppProps } from './IToDoListAppProps';
import { IToDoListAppState } from './IToDoListAppState';
import { escape } from '@microsoft/sp-lodash-subset';
import { Checkbox, Label, ActionButton, IIconProps, TextField } from 'office-ui-fabric-react';
import { IToDoItem } from '../contracts/IToDoItem';
import { ToDoItem } from './ToDoItem';

const addIcon: IIconProps = { iconName: 'Add' };

const createToDoItems = (length = 10): IToDoItem[] => {
  let items: IToDoItem[] = [];
  for(let i = 0; i < length; i++ )
    items.push({
      id: i,
      label: 'item ' + i,
      isChecked: false,
      isEditing: false
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

  public removeItem(item: IToDoItem) {
    let { items } = this.state;

    const itemIndex = items.indexOf(item);
    
    if(itemIndex != -1)
      items.splice(itemIndex, 1);

    this.setState({
      items
    });
  }

  public  changeItem(item: IToDoItem) {
    let { items } = this.state;

    const itemIndex = items.indexOf(item);
    
    if(itemIndex != -1)
      items[itemIndex] = item;

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
    let { items } = this.state;
    
    items = items.sort((a, b) => b.id - a.id);

    return (
      <div className={ styles.toDoListApp }>
        <ActionButton 
          styles={{icon:{margin:0}, root: {padding: 0}}} 
          iconProps={addIcon} 
          allowDisabledFocus 
          onClick={()=>{console.log('click');}}
        >
          New Item
        </ActionButton> 
        {
          items.map((item: IToDoItem) =>
            <ToDoItem 
              key={'item' + item.id}
              item={item} 
              changeItem={this.changeItem.bind(this)}
              removeItem={this.removeItem.bind(this)} 
              className={styles.item}
            />       
          )
        }
      </div>
    );
  }
}
