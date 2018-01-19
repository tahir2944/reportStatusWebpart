import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
  
} from '@microsoft/sp-webpart-base';
/// <reference path="../reportStatus/loc/mystrings" />
import * as strings from 'ReportStatusWebPartStrings';
import ReportStatus from './components/ReportStatus';
import { IReportStatusProps } from './components/IReportStatusProps';
import { SPComponentLoader } from '@microsoft/sp-loader';
import * as reactbootstrap from 'react-bootstrap';
import {} from '@types/material-ui'
export interface IReportStatusWebPartProps {
  description: string;
  
}

export default class ReportStatusWebPart extends BaseClientSideWebPart<IReportStatusWebPartProps> {

  public constructor() {
    super();
    SPComponentLoader.loadCss('https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css');
    SPComponentLoader.loadCss('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css');
    SPComponentLoader.loadCss('https://cdnjs.cloudflare.com/ajax/libs/jstree/3.2.1/themes/default/style.min.css');

    SPComponentLoader.loadScript('https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js', { globalExportsName: 'jQuery' }).then((jQuery: any): void => {
      SPComponentLoader.loadScript('https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min.js',  { globalExportsName: 'jQuery' }).then((): void => {
               
      });
    });
    

  }

  public render(): void {
    console.log('this.context.pageContext.user',this.context.pageContext.user);
    const element: React.ReactElement<IReportStatusProps > = React.createElement(
      ReportStatus,
      {
        description: this.properties.description,
        pageContext: this.context.pageContext,
        usermail:this.context.pageContext.user.email,
        displayName:this.context.pageContext.user.displayName 
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
