import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneButton
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'ToDoListAppWebPartStrings';
import ToDoListApp from './components/ToDoListApp';
import { IToDoListAppProps } from './components/IToDoListAppProps';
import { IToDoListAppWebPartProps } from './IToDoListAppWebPartProps';
import { sp } from '@pnp/sp';
import "@pnp/sp/webs";
import "@pnp/sp/lists/web";
import "@pnp/sp/fields";
import "@pnp/sp/items";
import { IListAddResult } from '@pnp/sp/lists';
import { FieldTypes } from '@pnp/sp/fields';


export default class ToDoListAppWebPart extends BaseClientSideWebPart <IToDoListAppWebPartProps> {

  private listTitleDefault: string = 'To Do List - SPFX App';

  constructor(){
    super();
    console.log('constructors');
    
  }

  public render(): void {
    console.log('render');
    this.verifyThereAreTheListInSite();

    const element: React.ReactElement<IToDoListAppProps> = React.createElement(
      ToDoListApp,
      {
        listTitle: this.properties.listTitle,
        absoluteUrl: this.context.pageContext.site.absoluteUrl
      }
    );

    ReactDom.render(element, this.domElement);
  }

  public onRender(): void {
    console.log('onRender');
  }

  protected onDispose(): void {
    console.log('onDispose');
    ReactDom.unmountComponentAtNode(this.domElement);
  }
  

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  private async verifyThereAreTheListInSite() {
    sp.setup({
      sp: {
        headers: {
          Accept: "application/json;odata=verbose",
        },
        baseUrl: this.context.pageContext.site.absoluteUrl
      },
    });

    const list = await sp.web.lists.filter("Title eq '" + this.properties.listTitle + "'").top(1).get();
    console.log(list);
    if(list.length == 0){
      console.log('There Are not list');
      this.createList();
    }
    else
      console.log(list[0].Title);
  }

  protected createList(): void {
    console.log('Create List');

    sp.setup({
      sp: {
        headers: {
          Accept: "application/json;odata=verbose",
        },
        baseUrl: this.context.pageContext.site.absoluteUrl
      },
    });

    sp.web.lists.add(this.properties.listTitle).then(async(res: IListAddResult)=> {
      console.log(res);
      const fieldIsChecked = await sp.web.lists.getByTitle(this.properties.listTitle).fields.addBoolean('isChecked');
      console.log(fieldIsChecked);
      this.context.propertyPane.refresh();
    })
    .catch((error) => {

    });
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          groups: [
            {
              
              groupFields: [
                PropertyPaneTextField('listTitle',{
                  label: 'List'
                }) 
              ]
            }
          ]
        }
      ]
    };
  }
}
