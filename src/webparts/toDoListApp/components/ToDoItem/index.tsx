import * as React from 'react';
import { Checkbox, TextField } from 'office-ui-fabric-react';
import { IToDoItemProps } from './props';
import { IToDoItemState } from './state';
import { IToDoItem } from '../../contracts/IToDoItem';

export class ToDoItem extends React.Component<IToDoItemProps, IToDoItemState> {

    public changeChecked(checked: boolean) {
        let { item } = this.props;
        item.isChecked = checked;
        this.props.changeItem(item);
    } 

    public changeLabel(label: string) {
        let { item } = this.props;
        item.label = label;
        this.props.changeItem(item);
    }

    public render(){
        const { item, className } = this.props;
        return (
            <div className={(className)? className : ''}>
                <Checkbox 
                    checked={item.isChecked} 
                    onChange={(e,checked: boolean) => this.changeChecked(checked)} 
                    styles={{root: {display: 'inline-block'}}}
                />
                <TextField
                    onChanged={(newValue: string)=> this.changeLabel(newValue)} 
                    styles={{wrapper:{display: 'inline-block'}, root:{display:'inline-block'}}} 
                    value={item.label} 
                    underlined 
                /> 
            </div>
        );
    }
}