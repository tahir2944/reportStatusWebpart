import * as React from 'react';
import pnp from "sp-pnp-js";
import { Web,List,ListEnsureResult,ViewAddResult,ItemAddResult,Util} from "sp-pnp-js";
import { autobind,BaseComponent } from 'office-ui-fabric-react/lib/Utilities';
import * as $ from 'jquery';
import {Breadcrumb,Button,Tooltip,Nav,NavItem,Modal} from 'react-bootstrap';
import { SPComponentLoader } from '@microsoft/sp-loader';

export interface ISchedulersProps {
    
  }
export class Schedulers extends React.Component<ISchedulersProps, any>{
    constructor(props){
        super();   
        SPComponentLoader.loadCss('https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css');
        SPComponentLoader.loadCss('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css'); 
        SPComponentLoader.loadScript('https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js', { globalExportsName: 'jQuery' }).then((jQuery: any): void => {
        SPComponentLoader.loadScript('https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min.js',  { globalExportsName: 'jQuery' }).then((): void => {         
          });
        });   
    }

    public componentWillMount(): void {  

           
            // .then((item) => {
            //     item = item.filter(detail => {
            //         if (detail.AssignedToId == result.data.Id){
            //             detail.responsibility=result.data.Title
            //             return detail;} 
            //     })
            //     debugger;
            //     item=item.map(person => ({ key: person.ID, name:person.Title,area:person.Area.Title, division:person.Division.Title, frequency:person.Frequency.Title, resp:person.responsibility,value:person.Modified.substring(0, person.Modified.indexOf('T')) ,status:<div id="statusid" style={(1+person.Frequency.No_x002e__x0020_of_x0020_days-(new Date(new Date().getTime() - new Date(person.Modified).getTime()).getDate()))>=0 ? {background: "#3b923b",color:"white", padding: "4px 1px 7px",textAlign: "center",width: "68%"}:{background: "rgb(197, 51, 51)",color:"white", padding: "4px 1px 7px",textAlign: "center",width: "68%"}}>{(1+person.Frequency.No_x002e__x0020_of_x0020_days-(new Date(new Date().getTime() - new Date(person.Modified).getTime()).getDate()))}</div>,download:<div style={{cursor: "pointer", fontSize: "18px",textAlign:"center"}}><i className="fa fa-download" ></i><i style={{paddingLeft:"12px",marginLeft:"8px"}} className="fa fa-eye" ></i></div>}))
                           
            // })
        
        

    }

    public render(): React.ReactElement<ISchedulersProps> {
        return (
            <div>
                Schedulersscreen
            </div>
        );
      }
}