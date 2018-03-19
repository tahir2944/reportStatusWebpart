import * as React from 'react';
import pnp from "sp-pnp-js";
import { Web,List,ListEnsureResult,ViewAddResult,ItemAddResult,Util} from "sp-pnp-js";
import { autobind,BaseComponent } from 'office-ui-fabric-react/lib/Utilities';
import * as $ from 'jquery';
import {Breadcrumb,Button,Tooltip,Nav,NavItem,Modal} from 'react-bootstrap';
import { SPComponentLoader } from '@microsoft/sp-loader';
import getData   from "./api/getData";
import interfaceApi   from "./api/interfaceApi";
import styles from './ReportStatus.module.scss';
import * as logo from "../components/havellslogo.png";
import {Manager} from '../components/Manager';

export interface IUsersProps {
    
  }
export class Users extends React.Component<IUsersProps, any>{
    constructor(props){
        super();   
        SPComponentLoader.loadCss('https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css');
        SPComponentLoader.loadCss('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css'); 
        SPComponentLoader.loadScript('https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js', { globalExportsName: 'jQuery' }).then((jQuery: any): void => {
        SPComponentLoader.loadScript('https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min.js',  { globalExportsName: 'jQuery' }).then((): void => {         
          });
        });   
        this.state={
            isDisabled:true,
            loader:<div className={styles.loaderback}><div className={styles.loader} style={{ background: "#333 url("+logo+") no-repeat center center"}}></div></div>,
            dialog:''
        };
    }
    public componentWillMount(): void {  
        let getSchedule = new getData().getlistitem('Schedule');
        getSchedule.then((result) =>{
           // this.setState({schedules:result});
            result= result.map((item,i)=>{return <option key={i} value={item.ID}>{item.Title}</option>})
            this.setState({reports:result});
            this.setState({loader:''});
        })
    }
    public render(): React.ReactElement<IUsersProps> {
        return (
            <div>
                {this.state.loader}
                {this.state.dialog}
             <label htmlFor="reportname">Report Name</label>
                <select id='reportname' className={styles.reportname}  required>
                    <option value=''>Select a Report Name</option>
                    {this.state.reports}
                </select>
            <input type="file" id="choosefile" className={styles.choosefile} onChange={(e) => this.handleFileUpload(e.target)} />
           <div className={styles.uploadbutton}> <button type="button" id="uploadrepo" disabled={this.state.isDisabled}  className="btn btn-danger" onClick={() => this.uploadattach()}><i className="fa fa-upload"></i> &nbsp;Upload Report</button></div>
            <hr />
            <Manager user="user"/>
            </div>
        );
      }

    private handleFileUpload({files}){
        files.length?this.setState({isDisabled:false}):this.setState({ isDisabled:true});
    }

    private uploadattach(){
       document.getElementById('uploadrepo').innerHTML='<i class="fa fa-circle-o-notch fa-spin" style="font-size:16px" ></i>&nbsp;Uploading';
       this.setState({isDisabled:true});
       let file = (document.getElementById('choosefile') as any).files[0];
       let myblob = new Blob([file], {type:'application/pdf'});
       let extra =new Date().toLocaleString().replace(new RegExp('/', 'g'),'').replace(/,/g, '').replace(/:/g, '');
        if(myblob.size <= 10485760){
            pnp.sp.web.folders.getByName('ScheduleReport').files
            .add(file.name.substring(0,file.name.lastIndexOf('.'))+extra+file.name.slice(file.name.lastIndexOf('.')), myblob, true)
            .then(i =>{console.log(i,'iii');
                    i.file.listItemAllFields.get().then((listItemAllFields) => {
                    pnp.sp.web.lists.getByTitle("ScheduleReport").items.getById(listItemAllFields.Id).update({
                        scheduleIDId:(document.getElementById('reportname') as any).value
                    }).then(r=>{document.getElementById('uploadrepo').innerHTML='<i class="fa fa-upload" style="font-size:16px" ></i>&nbsp;Upload Report';
                                (document.getElementById('choosefile')as any).value='';
                                this.dialog('File Uploaded Successfully.','Success');})
                      .catch(err => {this.dialog('Error occured please try again later.','Error');});});
                }).catch(err => {this.dialog('Error occured please try again later.','Error');});
    
        } 
       else{
            pnp.sp.web.folders.getByName('ScheduleReport').files
            .addChunked(file.name.substring(0,file.name.lastIndexOf('.'))+extra+file.name.slice(file.name.lastIndexOf('.')), myblob, data => {
            console.log("upload progress")}, true)
            .then(_ => console.log("uploaded!"))
            .catch(err=>{this.dialog('Error occured please try again later.','Error');});
        }
    }
    public dialog(message,type){
            this.setState({dialog:
            <Modal.Dialog style={{width:"100%",overflow:"auto",top:"30%"}}>
            <Modal.Header>
              <Modal.Title>{type} &nbsp;{type=='Success'?<i className="fa fa-check-circle" style={{color:"green"}}></i>:<i className="fa fa-exclamation-triangle" style={{color:"orange"}}></i>}</Modal.Title>            
              </Modal.Header>
              <Modal.Body>
                  {message}
              </Modal.Body>
              <Modal.Footer>
                <Button style={{background:"#d9534f",width:"72px",color:"white"}} onClick={() => this.setState({dialog:''})} >OK</Button>
              </Modal.Footer>
          </Modal.Dialog>});
        }
    public getPosition(string, subString, index) {
        return string.split(subString, index).join(subString).length;
    } 

}
