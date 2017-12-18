import { IListItem } from "../common/IObjects";
import IDataProvider from "./IDataProvider";
import { IWebPartContext } from '@microsoft/sp-webpart-base';
// import pnp and pnp logging system
import { Logger, FunctionListener, LogEntry, LogLevel, Web } from "sp-pnp-js";
///import { Utils } from '../common/Utils';

export default class SharePointDataProvider implements IDataProvider {
    private _webPartContext: IWebPartContext;
    private _webAbsoluteUrl: string;
    
    constructor(value: IWebPartContext) {
        this._webPartContext = value;
        this._webAbsoluteUrl = value.pageContext.web.absoluteUrl;
    }    

    public readListItems(): Promise<IListItem[]>{
    // do PnP JS query, some notes:
      //   - .expand() method will retrive Item.File item but only Length property
      //   - .usingCaching() will be using SessionStorage by default to cache the  results
      //   - .get() always returns a promise
      //   - await converts Promise<IResponseItem[]> into IResponse[]
      let webAbsoluteUrl = this._webPartContext.pageContext.web.absoluteUrl;      
      const web: Web = new Web(webAbsoluteUrl);
      const response: IListItem = await web.lists
        .getByTitle("Schedule")
        .items
        .select("Title", "Frequency", "LastUpdated")
        .usingCaching()
        .get();

      // use map to convert IResponseItem[] into our internal object IFile[]
      const items: IListItem[] = response.map((item: IListItem) => {
        return {
          Title: item.Title,
          Frequency:  item.Frequency,
          LastUpdated: item.LastUpdated
        };
      });

      // set our Component´s State
      this.setState({ ...this.state, items });

      // intentionally set wrong query to see console errors...
      const failResponse: IResponseItem[] = await web.lists
        .getByTitle(libraryName)
        .items
        .select("Title", "FileLeafRef", "File/Length", "NonExistingColumn")
        .expand("File/Length")
        .usingCaching()
        .get();

    } catch (error) {
      // set a new state conserving the previous state + the new error
      this.setState({ ...this.state, errors: [...this.state.errors, error] });
    }
    
    
    }
}
