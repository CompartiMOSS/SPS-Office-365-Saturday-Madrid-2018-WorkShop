import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'HelloAlmSpfxWebPartStrings';
import HelloAlmSpfx from './components/HelloAlmSpfx';
import { IHelloAlmSpfxProps } from './components/IHelloAlmSpfxProps';

export interface IHelloAlmSpfxWebPartProps {
  description: string;
}

export default class HelloAlmSpfxWebPart extends BaseClientSideWebPart<IHelloAlmSpfxWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IHelloAlmSpfxProps > = React.createElement(
      HelloAlmSpfx,
      {
        description: this.properties.description
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
