import * as React from 'react';
import styles from './ReportStatus.module.scss';
import { IReportStatusProps } from './IReportStatusProps';
import { escape } from '@microsoft/sp-lodash-subset';
/* tslint:enable:no-unused-variable */
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import {
  DetailsList,
  DetailsListLayoutMode,
  Selection,
  IColumn
} from 'office-ui-fabric-react/lib/DetailsList';
import { MarqueeSelection } from 'office-ui-fabric-react/lib/MarqueeSelection';
import { autobind } from 'office-ui-fabric-react/lib/Utilities';
import { IListItem } from "../../../common/IObjects";


let _items: any[] = [];

let _columns: IColumn[] = [
  {
    key: 'column1',
    name: 'ReportName',
    fieldName: 'Title',
    minWidth: 100,
    maxWidth: 200,
    isResizable: true,
    ariaLabel: 'Operations for name'
  },
  {
    key: 'column2',
    name: 'Frequency',
    fieldName: 'Frequency',
    minWidth: 100,
    maxWidth: 200,
    isResizable: true,
    ariaLabel: 'Operations for value'
  },
  {
    key: 'column3',
    name: 'LastUpdated',
    fieldName: 'LastUpdated',
    minWidth: 100,
    maxWidth: 200,
    isResizable: true,
    ariaLabel: 'Operations for value'
  },
];









export default class ReportStatus extends React.Component<any, any> {

  private _selection: Selection;

  constructor() {
    super();

    // Populate with items for demos.
    if (_items.length === 0) {
      for (let i = 0; i < 200; i++) {
        _items.push({
          key: i,
          name: 'Item ' + i,
          value: i
        });
      }
    }

    this._selection = new Selection({
      onSelectionChanged: () => this.setState({ selectionDetails: this._getSelectionDetails() })
    });

    this.state = {
      items: _items,
      selectionDetails: this._getSelectionDetails()
    };
  }

  public componentDidMount() {
    //this.props.dataProvider.readListItems(this);
    this.props.dataProvider.readDocumentsFromSearch().then(
      (_items: IListItem[]) => {
        //debugger;
        this.setState({
          items: _items
        });
       }
      )
  }
  
  public render(): React.ReactElement<IReportStatusProps> {
    let { items, selectionDetails } = this.state;
    
    return (
      <div>
      <div>{ selectionDetails }</div>
      <TextField
        label='Filter by name:'
        onChanged={ this._onChanged }
      />
        
        <MarqueeSelection selection={ this._selection }>
        <DetailsList
          items={ items }
          columns={ _columns }
          setKey='set'
          layoutMode={ DetailsListLayoutMode.fixedColumns }
          selection={ this._selection }
          selectionPreservedOnEmptyClick={ true }
          ariaLabelForSelectionColumn='Toggle selection'
          ariaLabelForSelectAllCheckbox='Toggle selection for all items'
          onItemInvoked={ this._onItemInvoked }
        />
                </MarqueeSelection>
    </div>
  );
  }

  private _getSelectionDetails(): string {
    let selectionCount = this._selection.getSelectedCount();

    switch (selectionCount) {
      case 0:
        return 'No items selected';
      case 1:
        return '1 item selected: ' + (this._selection.getSelection()[0] as any).name;
      default:
        return `${selectionCount} items selected`;
    }
  }

  @autobind
  private _onChanged(text: any): void {
    this.setState({ items: text ? _items.filter(i => i.name.toLowerCase().indexOf(text) > -1) : _items });
  }

  private _onItemInvoked(item: any): void {
    alert(`Item invoked: ${item.name}`);
  }


}
