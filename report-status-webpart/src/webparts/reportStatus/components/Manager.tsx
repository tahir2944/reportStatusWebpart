import * as React from 'react';
import pnp from "sp-pnp-js";
import { Web,List,ListEnsureResult,ViewAddResult,ItemAddResult,Util} from "sp-pnp-js";
import { autobind,BaseComponent } from 'office-ui-fabric-react/lib/Utilities';
import * as $ from 'jquery';
import {Breadcrumb,Button,Tooltip,Nav,NavItem,Modal,OverlayTrigger} from 'react-bootstrap';
import { SPComponentLoader } from '@microsoft/sp-loader';
import styles from './ReportStatus.module.scss';
export interface IManagerProps {
    user:any;
  }
  
export class Manager extends React.Component<IManagerProps, any>{
    constructor(props){
        super();   
        SPComponentLoader.loadCss('https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css');
        SPComponentLoader.loadCss('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css'); 
        SPComponentLoader.loadScript('https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js', { globalExportsName: 'jQuery' }).then((jQuery: any): void => {
        SPComponentLoader.loadScript('https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min.js',  { globalExportsName: 'jQuery' }).then((): void => {         
          });
        });  
        this.state={_myitem:[]};
    }
    public componentWillMount(): void {
        pnp.sp.web.siteUsers.get().then((user) => {
            pnp.sp.web.lists.getByTitle("Schedule").items
            .select("Title","AssignedToId","Modified" ,"ID","Frequency/Title", "Frequency/ID","Frequency/No_x002e__x0020_of_x0020_days","Area/Title","Division/Title","attachmentFiles")
            .expand("Frequency","Area","Division","attachmentFiles").get()
            .then((item)=>{
                user.filter(user =>{item.map(item =>{if(item.AssignedToId.indexOf(user.Id)>-1){
                item.responsibility+= ','+user.Title;
                 } })})
            item.map((item)=>{item.responsibility=item.responsibility.substring(10,);
                              pnp.sp.web.lists.getByTitle("ScheduleReport").items
                              .filter("scheduleIDId eq "+item.ID+"").get()
                              .then((repo)=>{
                                    item.reports=repo;
                                    item= this.renderPerson(item);
                                    let joined = this.state._myitem.concat(item);
                                    this.setState({_myitem:joined});
                                    });
                              });
            }); 
        })
          
    }
    public render(): React.ReactElement<IManagerProps> {
        return (
            <div style={{overflowX:"auto"}}>
                <table  style={{boxShadow:"3px 3px 3px #ccc"}} className="table table-striped">
                        <thead>
                        <tr>
                            <th>Report Name</th><th>Area</th><th>Division</th><th>Frequency</th><th>Responsibility</th><th>LastUpdated</th><th>Status</th><th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                            {this.state._myitem && this.state._myitem.length>0?this.state._myitem:<tr><td></td><td>No items available</td><td></td></tr>}
                        </tbody>
                    </table>
            </div>
        );
      }
    private downloadattach(val){
        pnp.sp.web.lists.getByTitle("ScheduleReport").items.select('EncodedAbsUrl').filter("scheduleIDId eq "+val.ID+"")
        .orderBy("Modified",false).top(1).get().then(r => {
            console.log(r[0].EncodedAbsUrl,'resss',r);
            window.open(r[0].EncodedAbsUrl,'_blank');
        });
    }

    private viewattach(val){
        pnp.sp.web.lists.getByTitle("ScheduleReport").items.select('EncodedAbsUrl').filter("scheduleIDId eq "+val.ID+"")
        .orderBy("Modified",false).top(1).get().then(r => {
            console.log(r[0].EncodedAbsUrl,'resss',r);
            window.open(r[0].EncodedAbsUrl+'?web=1');
        });
    }
    private renderPerson(person) {
       let latestreport = person.reports.filter((obj)=> {
        return !person.reports.some((obj2) =>{
            return obj.Created < obj2.Created;
        });});
        let statuslogic=person.reports.length?(1+person.Frequency.No_x002e__x0020_of_x0020_days-(new Date(new Date().getTime() - new Date(latestreport[0].Created).getTime()).getDate())):''
        return (
        <tr>
            <td className="cell">{person.Title}</td>
            <td className="cell">{person.Area.Title}</td>
            <td className="cell">{person.Division.Title}</td>
            <td className="cell">{person.Frequency.Title}</td>
            <td className="cell">{person.responsibility}</td>
            <td className="cell">{person.reports.length?latestreport[0].Created.substring(0, latestreport[0].Created.indexOf('T')):'No Report Yet'}</td>
            <td className="cell">{person.reports.length?<div id="statusid" className={(statuslogic>=0)?styles.statusgreen:styles.statusred}>{statuslogic}</div>:''}</td>
            <td className="cell">{person.reports.length?<div style={{width:"78px"}} className={styles.reportStatus}><div className={styles.downloadbutton} ><OverlayTrigger placement="top" overlay={<Tooltip id="tooltip"><strong>Download</strong> </Tooltip>}><button type="button"  className={styles.download} onClick={() => this.downloadattach(person)}><i className="fa fa-download" style={{padding:"3px"}} ></i></button></OverlayTrigger><OverlayTrigger placement="top" overlay={<Tooltip id="tooltip"><strong>View</strong> </Tooltip>}><button type="button" className={styles.download}  style={{marginLeft:"6px"}} onClick={() => this.viewattach(person)}><i className="fa fa-eye" style={{padding:"3px"}}></i></button></OverlayTrigger></div></div>:''}</td>

        </tr>
        )
    }
}