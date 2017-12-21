import * as React from 'react';
import styles from './ReportStatus.module.scss';
import { IReportStatusProps } from './IReportStatusProps';
import { escape } from '@microsoft/sp-lodash-subset';
/* tslint:enable:no-unused-variable */
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Dropdown, IDropdown, DropdownMenuItemType, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';

import {
  DetailsList,
  DetailsListLayoutMode,
  Selection,
  IColumn
} from 'office-ui-fabric-react/lib/DetailsList';
import { MarqueeSelection } from 'office-ui-fabric-react/lib/MarqueeSelection';
import { autobind,BaseComponent } from 'office-ui-fabric-react/lib/Utilities';
import { IListItem } from "../../../common/IObjects";
import pnp from "sp-pnp-js";
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { FileInput, SVGIcon } from 'react-md';
import { FocusZone } from 'office-ui-fabric-react/lib/FocusZone';
import { List } from 'office-ui-fabric-react/lib/List';
import RaisedButton from 'material-ui/RaisedButton';
import { SPComponentLoader } from '@microsoft/sp-loader';


let _items:any[]=[];

// let _columns: IColumn[] = [
//   {
//     key: 'column1',
//     name: 'ReportName',
//     fieldName: 'Title',
//     minWidth: 100,
//     maxWidth: 200,
//     isResizable: true,
//     ariaLabel: 'Operations for name'
//   },
//   {
//     key: 'column2',
//     name: 'Frequency',
//     fieldName: 'Frequency',
//     minWidth: 100,
//     maxWidth: 200,
//     isResizable: true,
//     ariaLabel: 'Operations for value'
//   },
//   {
//     key: 'column3',
//     name: 'LastUpdated',
//     fieldName: 'LastUpdated',
//     minWidth: 100,
//     maxWidth: 200,
//     isResizable: true,
//     ariaLabel: 'Operations for value'
//   },
// ];

let _columns: IColumn[] = [
  {
    key: 'column1',
    name: 'Report Name',
    fieldName: 'name',
    minWidth: 100,
    maxWidth: 200,
    isResizable: true,
    ariaLabel: 'Operations for name'
  },
  {
    key: 'column2',
    name: 'Frequency',
    fieldName: 'frequency',
    minWidth: 100,
    maxWidth: 200,
    isResizable: true,
    ariaLabel: 'Operations for frequency'
  },
  {
    key: 'column3',
    name: 'LastUpdated',
    fieldName: 'value',
    minWidth: 100,
    maxWidth: 200,
    isResizable: true,
    ariaLabel: 'Operations for value'
  }
  
];

let myblob;
let file;
let _options =
  [
    { key: 'Header', text: 'Report Names', itemType: DropdownMenuItemType.Header },
  ];

  pnp.sp.web.lists.getByTitle("Schedule").items.get().then((items: any[]) => {
   let _opt=items.map(person => ({ key: person.ID, text: person.Title }));
   Array.prototype.push.apply(_options,_opt); 
    console.log('_options',_options)
});
let optionkey;
let itemss;




export default class ReportStatus extends React.Component<IReportStatusProps, any> {

  private _selection: Selection;

  constructor() {
    super();

    SPComponentLoader.loadCss('https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css');
    SPComponentLoader.loadCss('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css');

    SPComponentLoader.loadScript('https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js', { globalExportsName: 'jQuery' }).then((jQuery: any): void => {
      SPComponentLoader.loadScript('https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min.js',  { globalExportsName: 'jQuery' }).then((): void => {        
      });
    });
    

    // Populate with items for demos.
    
    pnp.sp.web.lists.getByTitle("Schedule").items.get().then((itemss: any[]) => {
      itemss = itemss.map(person => ({ key: person.ID, name: person.Title, frequency:person.Frequency, value:person.Modified.substring(0, person.Modified.indexOf('T')) }));
     
      _items=itemss;
      this.setState({
        items: _items
      });
      console.log(_items,'listitemss',itemss);
    
     
    });
         
    

    this._selection = new Selection({
      onSelectionChanged: () => this.setState({ selectionDetails: this._getSelectionDetails() })
    });

    this.state = {
      items: _items,
      selectionDetails: this._getSelectionDetails(),
      isDisabled:true
    };
  }

  
  
  public render(): React.ReactElement<IReportStatusProps> {
    //let { items, selectionDetails } = this.state;
    let items = this.state.items;
    let selectionDetails = this.state.selectionDetails;
    
    return (
      <div style={{visibility:"visible"}}>
          <div style={{ textAlign: "center", borderBottom:"1px dotted"}}>
            <h4>User Report Screen</h4>
          </div>
      <div className="row" style={{ paddingTop: "16px"}}>
        <div className="col-md-6">
      <Dropdown
          className='Dropdown-example'
          placeHolder='Select a Report Name'
          label=''
          id='Basicdrop1'
          ariaLabel='Basic dropdown example'
          options={_options}
          onChanged={ this._dropDownSelected }
          onBlur={ this._log('onBlur called') }
         
        />
        </div>
        <div className="col-md-6">
            <div>
              <input type="file" onChange={(e) => this.handleFileUpload(e.target)}  />
            </div>
        </div>    
      </div>
      <div  style={{ textAlign: "center", paddingTop: "12px"}}>
          <button type="button" id="uploadrepo" disabled={this.state.isDisabled} className="btn btn-danger" onClick={() => this.uploadattach(optionkey)}><i className="fa fa-upload"></i> &nbsp;Upload Report</button>
      </div>
      
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
  
  @autobind
  private _dropDownSelected(option: IDropdownOption) {
    optionkey=option.key;
  }
  
  private handleFileUpload({ files })
{ 
    this.setState({ isDisabled: false });
  file = files[0];
  myblob = new Blob([file], {
    type:'application/pdf'
});

  // send file to server here the way you need
}
private uploadattach(optionkey): void {
  
  if(!optionkey)
    alert("Please select a Report Name");
  
  else
     { 
    
      let item = pnp.sp.web.lists.getByTitle("Schedule").items.getById(optionkey);
      console.log('itemmmm',item.attachmentFiles.get());
      
        item.attachmentFiles.get().then(v => {
          console.log(v,'names');
          if(v.length){
              item.attachmentFiles.getByName(v[0].FileName).delete().then(ve => {
               console.log(ve);
               if(file){
                  item.attachmentFiles.add(file.name, myblob).then(vee => {
                  console.log(vee);
                  alert("Report Uploaded Successfully");
               });
               }
               else
                  alert("Please select a File");
              
        });
       
          }
          else if(v.length==0){
            if(file){
              item.attachmentFiles.add(file.name, myblob).then(v => {
              console.log(v);
              alert("Report Uploaded Successfully");
           });
           }
           else
              alert("Please select a File");
          }
          else
            alert("Error occured please try again later");
        
      });
    
    }

  }
  private _log(str: string): () => void {
    return (): void => {
      console.log(str);
    };
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
