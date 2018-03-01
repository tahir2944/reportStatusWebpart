import * as React from 'react';
import styles from './ReportStatus.module.scss';
import { IReportStatusProps } from './IReportStatusProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { IListItem } from "../../../common/IObjects";
import pnp from "sp-pnp-js";
import { SPComponentLoader } from '@microsoft/sp-loader';
import {Button,Modal} from 'react-bootstrap';
import {Manager} from '../components/Manager';
import {Users} from '../components/Users';
import {Schedulers} from '../components/Schedulers';
import getData   from "./api/getData";
import interfaceApi   from "./api/interfaceApi";
export default class ReportStatus extends React.Component<IReportStatusProps, any> {
  
  constructor(props) {
    super(props);
    this.state={showscreen:''};
  }
  public componentWillMount(): void {
    let getManagersgroup = new getData().checkusergroup('Managers');
    getManagersgroup.then((result) =>{
      result= result.map(mail => mail.Email);
      (result.indexOf(this.props.usermail)>-1) ? this.setState({showscreen:'manager'}) : '' 
    });
    let getSchedulersgroup = new getData().checkusergroup('Schedulers');
    getSchedulersgroup.then((result) =>{
      result= result.map(mail => mail.Email);
      (result.indexOf(this.props.usermail)>-1) ? this.setState({showscreen:'Schedulers'}) : '' 
    });
    let getusergroup = new getData().checkusergroup('User');
    getusergroup.then((result) =>{
      result= result.map(mail => mail.Email);
      (result.indexOf(this.props.usermail)>-1) ? this.setState({showscreen:'user'}) : '' 
    });
 
  }
  public render(): React.ReactElement<IReportStatusProps> {
    return (
        <div>
        {this.state.showscreen=='manager'?<Manager user=""/>:this.state.showscreen=='user'?<Users />:this.state.showscreen=='Schedulers'?<Schedulers />:'Please assign yourself in a group'}
        </div>
    );
  }
}