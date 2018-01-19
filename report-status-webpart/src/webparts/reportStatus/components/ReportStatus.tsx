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
import { SPComponentLoader } from '@microsoft/sp-loader';
import {Button,Modal} from 'react-bootstrap';

let _items:any[]=[];



let _columns: IColumn[] = [
  {
    key: 'column1',
    name: 'Report Name',
    fieldName: 'name',
    minWidth: 100,
    maxWidth: 100,
    isResizable: true,
    ariaLabel: 'Operations for name'
  },
  {
    key: 'column2',
    name: 'Area',
    fieldName: 'area',
    minWidth: 90,
    maxWidth: 90,
    isResizable: true,
    ariaLabel: 'Operations for area'
  },
  {
    key: 'column3',
    name: 'Division',
    fieldName: 'division',
    minWidth: 90,
    maxWidth: 90,
    isResizable: true,
    ariaLabel: 'Operations for division'
  },
  {
    key: 'column4',
    name: 'Frequency',
    fieldName: 'frequency',
    minWidth: 90,
    maxWidth: 90,
    isResizable: true,
    ariaLabel: 'Operations for frequency'
  },
  {
    key: 'column5',
    name: 'LastUpdated',
    fieldName: 'value',
    minWidth: 90,
    maxWidth: 90,
    isResizable: true,
    ariaLabel: 'Operations for value'
  },
  {
    key: 'column6',
    name: 'Status',
    fieldName: 'status',
    minWidth: 90,
    maxWidth: 90,
    isResizable: true,
    ariaLabel: 'Operations for status'
  },
  {
    key: 'column7',
    name: 'Download/Viewer',
    fieldName: 'download',
    minWidth: 90,
    maxWidth: 90,
    isResizable: true,
    ariaLabel: 'Operations for download'
  }
  
];

let myblob;
let file;
let _options =
  [
    { key: 'Header', text: 'Report Names', itemType: DropdownMenuItemType.Header },
  ];

  pnp.sp.web.lists.getByTitle("Schedule").items.get().then((items: any[]) => {
    //console.log('>>',items);
   let _opt=items.map(person => ({ key: person.ID, text: person.Title }));
   Array.prototype.push.apply(_options,_opt); 
    //console.log('_options',_options)
});
let optionkey;
let itemss;
let today;
let datem;
let partials;
let filterarea;
let filterdiv;
let areatree;
let divtree;
let test;
//let areatree='<div data-toggle="collapse" data-target=Neemrana style="cursor:pointer;width:max-content;background:#fff;padding:3px;margin:3px">&#62; Neemrana</div><ul id=Neemrana class="collapse"><li style="cursor:pointer">loc1</li><li style="cursor:pointer">loc2</li><li style="cursor:pointer">loc3</li></ul><div data-toggle="collapse" data-target=Baddi style="cursor:pointer;width:max-content;background:#fff;padding:3px;margin:3px">&#62; Baddi</div><ul id=Baddi class="collapse"><li style="cursor:pointer">loc1</li><li style="cursor:pointer">loc2</li><li style="cursor:pointer">loc3</li></ul><div data-toggle="collapse" data-target=HO style="cursor:pointer;width:max-content;background:#fff;padding:3px;margin:3px">&#62; HO</div><ul id=HO class="collapse"><li style="cursor:pointer">loc1</li><li style="cursor:pointer">loc2</li><li style="cursor:pointer">loc3</li></ul><div data-toggle="collapse" data-target=Haridwar style="cursor:pointer;width:max-content;background:#fff;padding:3px;margin:3px">&#62; Haridwar</div><ul id=Haridwar class="collapse"><li style="cursor:pointer">loc1</li><li style="cursor:pointer">loc2</li><li style="cursor:pointer">loc3</li></ul><div data-toggle="collapse" data-target=Faridabad style="cursor:pointer;width:max-content;background:#fff;padding:3px;margin:3px">&#62; Faridabad</div><ul id=Faridabad class="collapse"><li style="cursor:pointer">loc1</li><li style="cursor:pointer">loc2</li><li style="cursor:pointer">loc3</li></ul><div data-toggle="collapse" data-target=Alwar style="cursor:pointer;width:max-content;background:#fff;padding:3px;margin:3px">&#62; Alwar</div><ul id=Alwar class="collapse"><li style="cursor:pointer">loc1</li><li style="cursor:pointer">loc2</li><li style="cursor:pointer">loc3</li></ul>';




export default class ReportStatus extends React.Component<IReportStatusProps, any> {

  private _selection: Selection;
 

  constructor(props) {
    super(props);

    SPComponentLoader.loadCss('https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css');
    SPComponentLoader.loadCss('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css');
    
    SPComponentLoader.loadScript('https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js', { globalExportsName: 'jQuery' }).then((jQuery: any): void => {
      SPComponentLoader.loadScript('https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min.js',  { globalExportsName: 'jQuery' }).then((): void => {  
             
      });
    });

pnp.sp.web.siteGroups.getByName('Managers').users.get().then((result) =>{ 
  result= result.map(mail => mail.Email);
  //console.log(result.indexOf(this.props.usermail),'manager');
  (result.indexOf(this.props.usermail)>-1) ? this.setState({userlist:'manager'}) : this.setState({userlist:''});
  });
pnp.sp.web.siteGroups.getByName('users').users.get().then((result) =>{
  result= result.map(mail => mail.Email);
  //console.log(result.indexOf(this.props.usermail),'user');
  (result.indexOf(this.props.usermail)>-1) ?(this.setState({userlist:'user'})) :this.setState({userlist:''});
  });
  pnp.sp.web.siteGroups.getByName('Schedulers').users.get().then((result) =>{ 
    result= result.map(mail => mail.Email);
    //console.log(result.indexOf(this.props.usermail),'Schedulers');
    (result.indexOf(this.props.usermail)>-1) ? this.setState({userlist:'Schedulers'}) : this.setState({userlist:''});
    });


    pnp.sp.web.lists.getByTitle("Schedule").items.select("Title","Modified" ,"ID","Frequency/Title", "Frequency/ID","Frequency/No_x002e__x0020_of_x0020_days","Area/Title","Division/Title").expand("Frequency","Area","Division").get().then((itemss: any[]) => {
       itemss = itemss.map(person => ({ key: person.ID, name:person.Title,area:person.Area.Title, division:person.Division.Title, frequency:person.Frequency.Title, value:person.Modified.substring(0, person.Modified.indexOf('T')) ,status:<div id="statusid" style={(1+person.Frequency.No_x002e__x0020_of_x0020_days-(new Date(new Date().getTime() - new Date(person.Modified).getTime()).getDate()))>=0 ? {background: "#3b923b",color:"white", padding: "4px 1px 7px",textAlign: "center",width: "68%"}:{background: "rgb(197, 51, 51)",color:"white", padding: "4px 1px 7px",textAlign: "center",width: "68%"}}>{(1+person.Frequency.No_x002e__x0020_of_x0020_days-(new Date(new Date().getTime() - new Date(person.Modified).getTime()).getDate()))}</div>,download:<div style={{cursor: "pointer", fontSize: "18px",textAlign:"center"}}><i className="fa fa-download" onClick={() => this.downloadattach(person.ID)}></i><i style={{paddingLeft:"12px",marginLeft:"8px"}} className="fa fa-eye" onClick={() => this.viewattach(person.ID)}></i></div>}));
      _items=itemss;
      this.setState({
        items: _items
      });
           
  });    
     
  pnp.sp.web.siteUsers.get().then((user: any[]) => {
    //console.log('usssseeer',user)
    pnp.sp.web.lists.getByTitle("Schedule").items.select("Title","AssignedToId","Modified" ,"ID","Frequency/Title", "Frequency/ID","Frequency/No_x002e__x0020_of_x0020_days","Area/Title","Division/Title").expand("Frequency","Area","Division").get().then((item: any[]) => {
      console.log(item,'itemuser',user)
    })

    })
   
      pnp.sp.profiles.myProperties.get()
      .then(userprops => {
        pnp.sp.site.rootWeb.ensureUser(userprops.Email).then(result => {
          //console.log(result.data.Id,'result');
          pnp.sp.web.lists.getByTitle("Schedule").items.select("Title","AssignedToId","Modified" ,"ID","Frequency/Title", "Frequency/ID","Frequency/No_x002e__x0020_of_x0020_days","Area/Title","Division/Title").expand("Frequency","Area","Division").get().then((item: any[]) => {
           item = item.filter(detail => {
               if (detail.AssignedToId == result.data.Id){
                  detail.responsibility=result.data.Title
                  return detail;
                 // detail.map(person => ({ key: person.ID, name:person.Title,area:person.Area.Title, division:person.Division.Title, frequency:person.Frequency.Title, value:person.Modified.substring(0, person.Modified.indexOf('T')) ,status:<div id="statusid" style={(1+person.Frequency.No_x002e__x0020_of_x0020_days-(new Date(new Date().getTime() - new Date(person.Modified).getTime()).getDate()))>=0 ? {background: "#3b923b",color:"white", padding: "4px 1px 7px",textAlign: "center",width: "68%"}:{background: "rgb(197, 51, 51)",color:"white", padding: "4px 1px 7px",textAlign: "center",width: "68%"}}>{(1+person.Frequency.No_x002e__x0020_of_x0020_days-(new Date(new Date().getTime() - new Date(person.Modified).getTime()).getDate()))}</div>,download:<div style={{cursor: "pointer", fontSize: "18px",textAlign:"center"}}><i className="fa fa-download" onClick={() => this.downloadattach(person.ID)}></i><i style={{paddingLeft:"12px",marginLeft:"8px"}} className="fa fa-eye" onClick={() => this.viewattach(person.ID)}></i></div>}));
                 
                  // this.setState({
                  //   items: detail
                  // });
                    } })
            item=item.map(person => ({ key: person.ID, name:person.Title,area:person.Area.Title, division:person.Division.Title, frequency:person.Frequency.Title, value:person.Modified.substring(0, person.Modified.indexOf('T')) ,status:<div id="statusid" style={(1+person.Frequency.No_x002e__x0020_of_x0020_days-(new Date(new Date().getTime() - new Date(person.Modified).getTime()).getDate()))>=0 ? {background: "#3b923b",color:"white", padding: "4px 1px 7px",textAlign: "center",width: "68%"}:{background: "rgb(197, 51, 51)",color:"white", padding: "4px 1px 7px",textAlign: "center",width: "68%"}}>{(1+person.Frequency.No_x002e__x0020_of_x0020_days-(new Date(new Date().getTime() - new Date(person.Modified).getTime()).getDate()))}</div>,download:<div style={{cursor: "pointer", fontSize: "18px",textAlign:"center"}}><i className="fa fa-download" onClick={() => this.downloadattach(person.ID)}></i><i style={{paddingLeft:"12px",marginLeft:"8px"}} className="fa fa-eye" onClick={() => this.viewattach(person.ID)}></i></div>}))
            if(this.state.userlist=='user'){
              console.log(item,'itemitem');
              this.setState({
                    itemsuser: item
                  });
            }
          }); 
        }) 
    });
    
  

  pnp.sp.web.lists.getByTitle("Division").items.select("Title","ID").get().then((item: any[]) => {
    //console.log('item.map(',item.map(per =>console.log(per.Title)));
    divtree=item.map(per =>'<li class="divis" id="'+per.Title+'" style="cursor:pointer;width:25%;background:#ccc8c8;padding:3px;margin:3px" onclick="elementt(event.path)" >'+per.Title+'</li>');
    divtree.toString().replace(/,/g , "");
    
    pnp.sp.web.lists.getByTitle("Area").items.select("Title","ID").get().then((itemss: any[]) => {
      areatree =itemss.map(person =>'<div class="area" title="'+person.Title+'" data-toggle="collapse" onclick="elementt(event.path)" data-target= "#'+person.Title+'" style="cursor:pointer;width:25%;background:#fff;padding:3px;margin:3px">&#62;  '+person.Title+'</div><ul id='+person.Title+' class="collapse">'+divtree+'</ul>')
      areatree=areatree.toString().replace(/,/g , "");
      //console.log('areae',areatree);
      this.setState({
        areatree: areatree
      });
      
    });  
  }); 
  let eles = this; 
  
  (window as any).elementt=function(uiid){
    console.log(uiid);
    eles.setState({items:_items});
    if(uiid[0].className=='area'){
      console.log(uiid[0].title,'header',eles.state.items.filter(i => {  if (i.area ==uiid[0].title) return i; }));
      eles.setState({ items: eles.state.items.filter(i => {  if (i.area ==uiid[0].title) return i; }) });

    }
    else if(uiid[0].className=='divis'){
      console.log(uiid,'hee',uiid[0].id,uiid[1].id,eles.state.items)
      eles.setState({ items: eles.state.items.filter(i => {  if (i.division ==uiid[0].id && i.area ==uiid[1].id) return i; }) });
}
    }

 
    this._selection = new Selection({
      onSelectionChanged: () => this.setState({ selectionDetails: this._getSelectionDetails() })
    });

    this.state = {
      items: _items,
      selectionDetails: this._getSelectionDetails(),
      isDisabled:true,
      userlist:'',
      instance:'',
      loader:'',
      flag:''
      
    };
    //(document.querySelectorAll('[aria-colindex="5"]') as HTMLImageElement).textContent;
   
  }
  
  public render(): React.ReactElement<IReportStatusProps> {


    let items = this.state.items;
    let selectionDetails = this.state.selectionDetails;

    if(this.state.userlist=='manager'){
        var partials = <div>                
                <div dangerouslySetInnerHTML={{__html: this.state.areatree}} ></div>
                            <MarqueeSelection selection={ this._selection }>
                            <div style={{paddingTop:"13px"}}>
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
                             
                            /></div>
                            </MarqueeSelection>
                        </div>
    }
    else if(this.state.userlist=='user'){
      
        partials = <div >
                      <div className="" style={{ paddingTop: "16px"}}>
                        <div className="">
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
                        <div className="">
                            <div style={{paddingTop:"15px"}}>
                              <input type="file" style={{backgroundColor: "initial"}} onChange={(e) => this.handleFileUpload(e.target)}  />
                            </div>
                        </div>    
                      </div>
                      <div  style={{ textAlign: "center", paddingTop: "12px",marginTop: "22px"}}>
                          <button type="button" id="uploadrepo" disabled={this.state.isDisabled} className="btn btn-danger" onClick={() => this.uploadattach(optionkey)}><i className="fa fa-upload"></i> &nbsp;Upload Report</button>
                      </div>
                      <MarqueeSelection selection={ this._selection }>
                        <div style={{paddingTop:"13px"}}>
                        <DetailsList 
                          
                          items={ this.state.itemsuser }
                          columns={ _columns }
                          setKey='set'
                          layoutMode={ DetailsListLayoutMode.fixedColumns }
                          selection={ this._selection }
                          selectionPreservedOnEmptyClick={ true }
                          ariaLabelForSelectionColumn='Toggle selection'
                          ariaLabelForSelectAllCheckbox='Toggle selection for all items'
                          onItemInvoked={ this._onItemInvoked }
                        
                        /></div>
                      </MarqueeSelection>
                      
                      
                  </div>
                  
    }
    else if(this.state.userlist=='Schedulers'){
      partials = <div>
                    <div>

                    <div className="" style={{ paddingTop: "16px"}}>
                      <div className="">

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
                      <div className="">
                          <div style={{paddingTop:"15px"}}>
                            <input type="file" style={{backgroundColor: "initial"}} onChange={(e) => this.handleFileUpload(e.target)}  />
                          </div>
                      </div>    
                    </div>
                    <div  style={{ textAlign: "center"}}>
                        <button type="button" id="uploadrepo" disabled={this.state.isDisabled} className="btn btn-danger" onClick={() => this.uploadattach(optionkey)}><i className="fa fa-upload"></i> &nbsp;Upload Report</button>
                    </div>
                    
                    
                </div>
                <hr style={{borderTop: "1px solid #252323"}}/>
                <div>
                               
                  <div dangerouslySetInnerHTML={{__html: this.state.areatree}} ></div>

                
                {/* <div style={{paddingTop:"15px"}} className='row'>
                  <div className='col-md-4'><TextField
                    id='areaid'
                    placeholder='Filter by area'
                     onChanged={ this._onChanged }
                     /></div>
                     <div  className='col-md-4'><TextField
                     placeholder='Filter by division'
                    id='divid'
                    onChanged={ this._onChanged }
                     /></div>
                    <div  className='col-md-4'> <button type="button" style={{width:"45%",boxShadow:"rgba(10, 10, 10, 0.19) 0px 8px 15px"}} className="btn btn-primary" onClick={() => this._onstatusChanged('heyeyye')}>Filter</button></div>
                </div> */}
      

                  <MarqueeSelection selection={ this._selection }>
                  <div style={{paddingTop:"13px"}}>
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
                   
                  /></div>
                  </MarqueeSelection>
              </div>
              </div>
    }
   
    return (
      <div style={{visibility:"visible" ,background: "#f4f4f4",padding:"10px 12px 36px 12px",boxShadow:"2px 5px #a09f9f"}}>
          <div style={{ textAlign: "center", borderBottom:"1px dotted",paddingBottom:"15px"}}>
         
            <h4>{this.state.userlist=='manager' ? <div> <i className="fa fa-user" style={{fontSize: "43px",float: "left"}}> </i><span style={{fontSize:"20px"}}>Manager Screen</span></div> : <div><i className="fa fa-users" style={{fontSize: "43px",float: "left"}}> </i><span style={{fontSize:"20px"}}>User Report Screen</span></div>}</h4>
          </div>
            {partials}
            {this.state.instance}
            {this.state.loader}
          

         
    </div>
  );
  }
  private viewattach(key): void {
    let item = pnp.sp.web.lists.getByTitle("Schedule").items.getById(key);
    item.attachmentFiles.get().then(v => {
      if(v.length)
        window.open('https://havells.sharepoint.com'+v[0].ServerRelativePath.DecodedUrl+'?web=1');
      else{
          this.setState({ instance:  <div className="static-modal">
                                              <Modal.Dialog>
                                                <Modal.Header>
                                                  <Modal.Title>Error!!</Modal.Title>
                                                </Modal.Header>

                                                <Modal.Body>
                                                  No Report Uploaded yet
                                                </Modal.Body>

                                                <Modal.Footer>
                                                  <Button bsStyle="danger" onClick={() => this.setState({instance:'',loader:''})}>OK</Button>
                                                </Modal.Footer>

                                              </Modal.Dialog>
                                            </div> });
        }
      
    })

  }
  private downloadattach(key): void {
    let item = pnp.sp.web.lists.getByTitle("Schedule").items.getById(key);
      item.attachmentFiles.get().then(v => {
        if(v.length)
          window.open(window.location.origin+v[0].ServerRelativeUrl,'_blank');
        else{
          this.setState({ instance:  <div className="static-modal">
                                              <Modal.Dialog>
                                                <Modal.Header>
                                                  <Modal.Title>Error!!</Modal.Title>
                                                </Modal.Header>

                                                <Modal.Body>
                                                  No Report Uploaded yet
                                                </Modal.Body>

                                                <Modal.Footer>
                                                  <Button bsStyle="danger" onClick={() => this.setState({instance:'',loader:''})}>OK</Button>
                                                </Modal.Footer>

                                              </Modal.Dialog>
                                            </div> });
        }
      });
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
    {//alert("Please select a Report Name");
    this.setState({ instance:  <div className="static-modal">
                                  <Modal.Dialog>
                                    <Modal.Header>
                                      <Modal.Title>Error Occured</Modal.Title>
                                    </Modal.Header>

                                    <Modal.Body>
                                      Please select a Report Name from the Dropdown Menu
                                    </Modal.Body>

                                    <Modal.Footer>
                                      <Button bsStyle="danger" onClick={() => this.setState({instance:'',loader:''})}>OK</Button>
                                    </Modal.Footer>

                                  </Modal.Dialog>
                                </div> });
            
  }
  
  else
     { this.setState({loader:<div style={{position:"fixed",left: "0",top: "0",zindex: "2000" ,width: "100%",height: "100%",overflow: "visible",background: "#333 url('http://files.mimoymima.com/images/loading.gif') no-repeat center center"}}></div>})
    
      let item = pnp.sp.web.lists.getByTitle("Schedule").items.getById(optionkey);
      //console.log('itemmmm',item.attachmentFiles.get());
      
        item.attachmentFiles.get().then(v => {
         // console.log(v,'names');
          if(v.length){
              item.attachmentFiles.getByName(v[0].FileName).delete().then(ve => {
              // console.log(ve);
               if(file){
                  item.attachmentFiles.add(file.name, myblob).then(vee => {
                  //console.log(vee);
                 
                  this.setState({ instance:  <div className="static-modal">
                                              <Modal.Dialog>
                                                <Modal.Header>
                                                  <Modal.Title>Success!!</Modal.Title>
                                                </Modal.Header>

                                                <Modal.Body>
                                                  File uploaded Successfully
                                                </Modal.Body>

                                                <Modal.Footer>
                                                  <Button bsStyle="danger" onClick={() => this.setState({instance:'',loader:''})}>OK</Button>
                                                </Modal.Footer>

                                              </Modal.Dialog>
                                            </div> });
               });
               }
               else
                 {this.setState({ instance:  <div className="static-modal">
                 <Modal.Dialog>
                   <Modal.Header>
                     <Modal.Title>Error Occured</Modal.Title>
                   </Modal.Header>

                   <Modal.Body>
                     Please select a File
                   </Modal.Body>

                   <Modal.Footer>
                     <Button bsStyle="danger" onClick={() => this.setState({instance:'',loader:''})}>OK</Button>
                   </Modal.Footer>

                 </Modal.Dialog>
               </div> });}
              
        });
       
          }
          else if(v.length==0){
            if(file){
              item.attachmentFiles.add(file.name, myblob).then(v => {
              //console.log(v);
              this.setState({ instance:  <div className="static-modal">
              <Modal.Dialog>
                <Modal.Header>
                  <Modal.Title>Success!!</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                 Report uploaded Successfully
                </Modal.Body>

                <Modal.Footer>
                  <Button bsStyle="danger" onClick={() => this.setState({instance:'',loader:''})}>OK</Button>
                </Modal.Footer>

              </Modal.Dialog>
            </div> });
           });
           }
           else
            {
              this.setState({ instance:  <div className="static-modal">
                                  <Modal.Dialog>
                                    <Modal.Header>
                                      <Modal.Title>Error Occured</Modal.Title>
                                    </Modal.Header>

                                    <Modal.Body>
                                      Please select a File
                                    </Modal.Body>

                                    <Modal.Footer>
                                      <Button bsStyle="danger" onClick={() => this.setState({instance:'',loader:''})}>OK</Button>
                                    </Modal.Footer>

                                  </Modal.Dialog>
                                </div> });
            }
          }
          else
             {
              this.setState({ instance:  <div className="static-modal">
              <Modal.Dialog>
                <Modal.Header>
                  <Modal.Title>Error Occured</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                  Please try again later
                </Modal.Body>

                <Modal.Footer>
                  <Button bsStyle="danger" onClick={() => this.setState({instance:'',loader:''})}>OK</Button>
                </Modal.Footer>

              </Modal.Dialog>
            </div> });
             }
        
      });
    
    }

  }
  private _log(str: string): () => void {
    return (): void => {
     // console.log(str);
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
  private _onChanged(text:any): void {
      this.setState({ items: _items });
  }
  @autobind
  private _onstatusChanged(text: any): void {
    let areaval = (document.getElementById('areaid') as HTMLInputElement).value;
    let divval = (document.getElementById('divid') as HTMLInputElement).value;
    //console.log(divval,areaval,'areavalareaval');
    //console.log(this.state.items.filter(i => i.division.toLowerCase().indexOf(divval) > -1 && i.area.toLowerCase().indexOf(areaval) > -1 ));
    this.setState({ items: this.state.items.filter(i => i.division.toLowerCase().indexOf(divval) > -1 && i.area.toLowerCase().indexOf(areaval) > -1 ) });
  }

  
  private _onItemInvoked(item: any): void {
    //alert(`Item invoked: ${item.name}`);
  }
 
}
// (window as any).elementt=function(uiid){
//   console.log('hee',uiid[0].id,uiid[1].id)
  
// }

