import * as React from 'react';
import pnp from "sp-pnp-js";
import { Web,List,ListEnsureResult,ViewAddResult,ItemAddResult,Util} from "sp-pnp-js";
import { autobind,BaseComponent } from 'office-ui-fabric-react/lib/Utilities';
import * as $ from 'jquery';
import {Breadcrumb,Button,Tooltip,Nav,NavItem,Modal,OverlayTrigger} from 'react-bootstrap';
import { SPComponentLoader } from '@microsoft/sp-loader';
import styles from './ReportStatus.module.scss';
import * as logo from "../components/brandlogo.gif";

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
        this.state={
            _myitem:[],
            areadivs:[],
            loader:<div className={styles.loaderback}><div className={styles.loader} style={{ background: "#333 url("+logo+") no-repeat center center"}}></div></div>,
        };
    }
    public componentWillMount(): void {
        pnp.sp.web.siteUsers.get().then((user) => {
            pnp.sp.web.lists.getByTitle("Schedule").items
            .select("Title","AssignedToId","Modified" ,"ID","Frequency/Title", "Frequency/ID","Frequency/No_x002e__x0020_of_x0020_days","Area/Title","Division/Title","attachmentFiles")
            .expand("Frequency","Area","Division","attachmentFiles").get()
            .then((item)=>{

                let areadivision=item.map((item)=>({area:item.Area.Title,div:item.Division.Title}))
                .map((a,b)=>{if(a.area!=b.area && a.div!=b.div){return a}})
                .reduce((x, y) => x.findIndex(e=>(e.area==y.area && e.div==y.div))<0 ? [...x, y]: x, [])
                .groupBy('area');
                //console.log(areadivision,'areadivision');
                (Object as any).entries(areadivision).forEach((val)=>{
                   // console.log(<ul>{val[0]}{val[1].map((item)=>(<li>{item.div}</li>))}</ul>,'uuuu');
                    let joined = this.state.areadivs.concat(<div><div className={styles.filterheader} onClick={() => this.filterheader(val[0],'')} data-toggle="collapse" data-target={"#"+val[0]}>{val[0]}</div><ul id={val[0]} className="collapse">{val[1].map((item)=>(<li onClick={() => this.filterheader(val[0],item.div)} className={styles.filterlis}>{item.div}</li>))}</ul></div>)
                    this.setState({areadivs:joined});
                });
                    
           
                console.log(user,'user>>',item);
                user.filter(user =>{item.map(item =>{if(item.AssignedToId && item.AssignedToId.indexOf(user.Id)>-1){
                item.responsibility+= ','+user.Title;
                 } })})
            item.map((item)=>{item.responsibility=item.responsibility.substring(10,);
                              pnp.sp.web.lists.getByTitle("ScheduleReport").items
                              .filter("scheduleIDId eq "+item.ID+"").get()
                              .then((repo)=>{
                                    item.reports=repo;
                                    item= this.renderPerson(item);
                                    let joined = this.state._myitem.concat(item);
                                    (joined.length>1) ?joined= joined.sort((a,b) =>{return (new Date(a.props.children[5].props.children) > new Date(b.props.children[5].props.children)) ? 1 : (new Date(a.props.children[5].props.children) < new Date(b.props.children[5].props.children) ? -1 : 0);} ) :'';
                                    this.setState({_myitem:joined,loader:''});
                                    this.setState({originalmyitem:this.state._myitem});
                                    });
                              });
                             
            }); 
        })
          
    }
    public render(): React.ReactElement<IManagerProps> {
        return (
            <div>
            <div style={{overflowX:"auto"}}>
            {this.state.loader}
           <div className={styles.searchdiv}><input type="text" id="searchbox" onChange={() => this.searchreport()} placeholder="&#xF002; Search for a Report" className={styles.searchbox} /></div>
           {this.state.areadivs}
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
            </div>
        );
      }
    private searchreport(){
        //console.log(this.state.originalmyitem,'this.state.originalmyitem');
        this.setState({_myitem:this.state.originalmyitem.filter(i => i.props.children[0].props.children.toLowerCase().indexOf((event.target as any).value) > -1)});
    }
    private filterheader(header,listitem){
        if(!listitem){
            this.setState({_myitem:this.state.originalmyitem.filter((item)=>{if(item.props.children[1].props.children==header)return item})});
        }
        else{
            this.setState({_myitem:this.state.originalmyitem.filter((item)=>{if(item.props.children[2].props.children==listitem && item.props.children[1].props.children==header)return item})});
        }
    }
    private downloadattach(val){
        console.log(val)
        pnp.sp.web.lists.getByTitle("ScheduleReport").items.select('EncodedAbsUrl').filter("scheduleIDId eq "+val.ID+"")
        .orderBy("Modified",false).top(1).get().then(r => {
            console.log(r,'r')
            window.open(r[0].EncodedAbsUrl,'_blank');
        });
    }

    private viewattach(val){
        pnp.sp.web.lists.getByTitle("ScheduleReport").items.select('EncodedAbsUrl').filter("scheduleIDId eq "+val.ID+"")
        .orderBy("Modified",false).top(1).get().then(r => {
            window.open(r[0].EncodedAbsUrl+'?web=1');
        });
    }
    private renderPerson(person) {
       let latestreport = person.reports.filter((obj)=> {
        return !person.reports.some((obj2) =>{
            return obj.Created < obj2.Created;
        });});
        //console.log(latestreport,'latestreport',person.reports);
        let statuslogic=person.reports.length?(1+person.Frequency.No_x002e__x0020_of_x0020_days-(new Date(new Date((new Date() as any).format('yyyy-M-dd')).getTime() - new Date((new Date(latestreport[0].Created) as any).format('yyyy-M-dd')).getTime()).getDate())):''
        return (
        <tr>
            <td className="cell">{person.Title}</td>
            <td className="cell">{person.Area.Title}</td>
            <td className="cell">{person.Division.Title}</td>
            <td className="cell">{person.Frequency.Title}</td>
            <td className="cell">{person.responsibility}</td>
            <td className="cell">{person.reports.length?latestreport[0].Created.substring(0, latestreport[0].Created.indexOf('T')):'No Report Yet'}</td>
            <td className="cell">{person.reports.length?<div id="statusid" className={(statuslogic>=0)?styles.statusgreen:styles.statusred}>{statuslogic}</div>:''}</td>
            <td className="cell">{person.reports.length?<div style={{width:"78px"}} className={styles.reportStatus}><div className={styles.downloadbutton} ><OverlayTrigger placement="top" overlay={<Tooltip id="tooltip">Download</Tooltip>}><button type="button"  className={styles.download} onClick={() => this.downloadattach(person)}><i className="fa fa-download" style={{padding:"3px",fontSize:"10px"}} ></i></button></OverlayTrigger><OverlayTrigger placement="top" overlay={<Tooltip id="tooltip">View</Tooltip>}><button type="button" className={styles.download}  style={{marginLeft:"6px"}} onClick={() => this.viewattach(person)}><i className="fa fa-eye" style={{padding:"3px",fontSize:"10px"}}></i></button></OverlayTrigger></div></div>:''}</td>

        </tr>
        )
    }
    
   
}
(window as any).Array.prototype.groupBy = function(prop) {
    return this.reduce(function(groups, item) {
      const val = item[prop]
      groups[val] = groups[val] || []
      groups[val].push(item)
      return groups
    }, {})
  }