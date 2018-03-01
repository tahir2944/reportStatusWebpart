import interfaceApi   from "./interfaceApi";
import { Dropdown, IDropdown, DropdownMenuItemType, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import * as $ from 'jquery';
import { Web,List,ListEnsureResult,ViewAddResult} from "sp-pnp-js";
import pnp from "sp-pnp-js";
let loginid;

export default class getData implements interfaceApi {
  public checkusergroup(groupname): any {
    return new Promise((resolve, reject) =>{
        pnp.sp.web.siteGroups.getByName(groupname).users.get().then((result) =>{
            resolve(result)
        }).catch(()=>reject(Error));
    });
  }
  public getlistitem(listname): any {
    return new Promise((resolve, reject) =>{
        pnp.sp.web.lists.getByTitle(listname).items.get().then((result) => {
            resolve(result)
        }).catch(()=>reject(Error));
    });
  }

  


}

