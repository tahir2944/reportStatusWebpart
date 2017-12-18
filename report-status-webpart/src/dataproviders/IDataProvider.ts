import { IListItem } from "../common/IObjects";

export default  interface IDataProvider {

    //validateSettings(): boolean;

    readListItems(): Promise<IListItem[]>;

}