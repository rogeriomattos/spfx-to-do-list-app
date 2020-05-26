import * as React from 'react';
import styles from './ToDoListApp.module.scss';
import { IToDoListAppProps } from './IToDoListAppProps';
import { IToDoListAppState } from './IToDoListAppState';
import { ActionButton, IIconProps, ProgressIndicator } from 'office-ui-fabric-react';
import { IToDoItem } from '../contracts/IToDoItem';
import { ToDoItem } from './ToDoItem';
import { sp } from '@pnp/sp';
import { IItemAddResult } from '@pnp/sp/items';

import debounceEvent from '../utils/debounceEvent';

const debounce = debounceEvent();

const addIcon: IIconProps = { iconName: 'Add' };

export default class ToDoListApp extends React.Component<IToDoListAppProps, IToDoListAppState> {
  
  constructor(props: IToDoListAppProps){
    super(props);
    
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
                    isChecked: item.IsChecked,
                    label: item.Title,
                    isWhaitSave: false
                  };
                })
      });
    });
  }

  public removeItem(item: IToDoItem) {
    const { listTitle } = this.props;
    let { items } = this.state;

    const itemIndex = items.indexOf(item);
    
    if(itemIndex != -1){
      items.splice(itemIndex, 1);

      this.setState({
        items
      });
    
      sp.web.lists.getByTitle(listTitle).items.getById(item.id).delete().then((res)=>{
        console.log('deletou');
      });
    }  
  }

  public  changeItem(item: IToDoItem) {
    
    const { listTitle } = this.props;

    let { items } = this.state;

    const itemIndex = items.indexOf(item);

    items[itemIndex] = item;

    this.setState({
      items
    });

    debounce(() => {
      if(itemIndex != -1)
        sp.web.lists.getByTitle(listTitle).items.getById(item.id).update({Title: item.label, IsChecked: item.isChecked})
        .then(({data}: IItemAddResult) => {
          console.log('salvou');
        })
        .catch((error)=> {
          console.log(error);
        }); 
    }, 500);
  }

  public newItem() {
    debounce(() => {
      const { listTitle } = this.props;

      const { items } = this.state;
      
      items.push({
        id:(items.length > 0)? items[0].id + 1 : null,
        isChecked: false,
        label: '',
        isWhaitSave: true
      });
      
      this.setState({
        items
      });
      
      sp.web.lists.getByTitle(listTitle).items.add({Title:'', IsChecked: false})
      .then(({data}: IItemAddResult) => {    
          
          items[0] = {
            id: data.Id,
            isChecked: data.IsCheked,
            label: data.Title,
            isWhaitSave: false
          };

          this.setState({
            items
          });
      });
    }, 100);
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

  public componentDidMount() {
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
