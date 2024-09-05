

export interface ItemItemType{
    item_id:number;
    item_type_id:number;
}
export interface Item{
    id:number;
    name:string;
    expiration_date:Date;
    storage_id:number;
    itemTypes:number[];
}