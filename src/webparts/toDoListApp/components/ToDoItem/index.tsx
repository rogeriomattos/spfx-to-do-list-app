import * as React from 'react';
import { Checkbox, TextField, IconButton, IIconProps } from 'office-ui-fabric-react';
import { IToDoItemProps } from './props';
import { IToDoItemState } from './state';
import { IToDoItem } from '../../contracts/IToDoItem';

const deleteIcon: IIconProps = { iconName: 'Delete' };

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
        const { item, className, removeItem } = this.props;
        
        return (
            <div className={(className)? className : ''}>
                <Checkbox 
                    checked={item.isChecked} 
                    onChange={(e,checked: boolean) => this.changeChecked(checked)} 
                    styles={{root: {display: 'inline-block', maxWidth: '24px'}}}
                />
                <TextField
                    onChanged={(newValue: string)=> this.changeLabel(newValue)} 
                    styles={{wrapper:{display: 'inline-block'}, root:{display:'inline-block', width: 'calc(100% - 24px - 32px)'}}} 
                    value={item.label} 
                    underlined
                /> 
                <IconButton 
                    onClick={(e) => removeItem(item)} 
                    styles={{root:{maxWidth: '32px'}}}
                    iconProps={deleteIcon} 
                    title="Remove" 
                    ariaLabel="Remove"
                />
            </div>
        );
    }
}