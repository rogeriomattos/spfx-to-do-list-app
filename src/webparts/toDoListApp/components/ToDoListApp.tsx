import * as React from 'react';
import styles from './ToDoListApp.module.scss';
import { IToDoListAppProps } from './IToDoListAppProps';
import { IToDoListAppState } from './IToDoListAppState';
import { escape } from '@microsoft/sp-lodash-subset';
import { Checkbox, Label, ActionButton, IIconProps, TextField, ProgressIndicator } from 'office-ui-fabric-react';
import { IToDoItem } from '../contracts/IToDoItem';
import { ToDoItem } from './ToDoItem';
import { sp } from '@pnp/sp';
import { IItemAddResult } from '@pnp/sp/items';

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
    console.log(this.props);
    console.log(this.context);

    sp.setup({
      sp: {
        headers: {
          Accept: "application/json;odata=verbose",
        },
        baseUrl: this.props.absoluteUrl
      },
    });

    this.state = {
      items: [], //createToDoItems(),
      newItem: null
    };
  }

  public getItems() {
    sp.web.lists.getByTitle(this.props.listTitle)
    .items
    .orderBy('Id', false)
    .get()
    .then((items) =>{
      this.setState({
        items: items.map((item): IToDoItem => {
                  return {
                    id: item.Id,
                    isChecked: item.isChecked,
                    label: item.Title,
                    isEditing: false
                  };
                })
      });
    });
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

  public newItem() {
    
    const { listTitle } = this.props;
    sp.web.lists.getByTitle(listTitle).items.add(
      {Title:'', isChecked: false}
    ).then(({data}: IItemAddResult) => {
        console.log(data);
        console.log(data.Title);
        
        let { items } = this.state;

        items.push({
          id: data.Id,
          isChecked: data.isChecked,
          label: data.Title,
          isEditing: false
        });
    
        this.setState({
          items
        });

    });

    
    //Colocar aqui um new item na lista do sharepoint com o item em branco
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

  public progressFinishedItems() {
    
    const { items }  = this.state;
    const itemsFinished = items.filter((item)=>(item.isChecked));
    
    if(itemsFinished.length > 0) {
      const porcent = 1 / items.length;
      
      return ((porcent * 10 )  * itemsFinished.length)/10; 
    }
    
    return 0;
  }

  public componentDidMount(){
    this.getItems();
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
          onClick={this.newItem.bind(this)}
        >
          New Item
        </ActionButton> 
        {items.length > 0 &&
          <ProgressIndicator 
            label={(this.progressFinishedItems()  * 100).toFixed(0) + '% completed'}  
            percentComplete={this.progressFinishedItems()} 
          />
        }
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
