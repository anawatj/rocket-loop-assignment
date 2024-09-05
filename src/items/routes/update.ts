import express, {Request,Response, NextFunction } from 'express'
import { body } from 'express-validator';

import {validateRequest} from '../../middlewares/validate-request'

import { ResponseData } from '../../middlewares/response-data';
import { Item,ItemItemType } from '../item.interface';
import { findItemTypeByIds } from '../../itemTypes/item-types.database';
import { BadRequestError } from '../../errors/bad-request-error';
import { findStorageById } from '../../storages/storage.database';
import { updateItem, findItemById, findItemByStorage, deleteItemItemType,findItemItemTypeByKey,createItemItemType, findItemItemTypeByItemId } from '../item.database';
import { NotFoundError } from '../../errors/not-found-error';

const router = express.Router()

router.put("/:id",
    [
    body("expiration_date")
        .isDate()
        .withMessage("expiration_date must be provided"),
    body("storage_id")
        .isNumeric()
        .withMessage("storage_id must be provided")
    ],
    validateRequest,
    async(req:Request,res:Response,next:NextFunction)=>{
        const id = Number(req.params.id)
        if(isNaN(id)){
            next(new BadRequestError("id is invalid"))
            return 
        }
        const {expiration_date,storage_id,itemTypes} = req.body;
        const now = new Date();
        const item = await findItemById(id);
        if(!item || !item.id || item.id==0){
            next(new NotFoundError());
            return 
        }

        const resultItemTypes = await findItemTypeByIds(itemTypes)
        const inputs = new Set(itemTypes)
        if(resultItemTypes.length!=inputs.size){
             next(new BadRequestError("Item type not found"))
             return ;
        }
        
        const storage = await findStorageById(storage_id);
        if(!storage || !storage.id || storage.id==0){
            next(new BadRequestError("Storage not found"));
            return 
        }

        if(resultItemTypes.filter(t=>t.refrigerated=='true').length>0){
            if(storage.refrigerated=='false'){
                next(new BadRequestError("Cannot add refrigerated in not refrigerated storage"))
                return;
            }
       }
       if(storage_id != item.storage_id){
        const number_of_items = await findItemByStorage(storage_id);
        if(number_of_items>=storage.maximum_capacity){
             next(new BadRequestError("Storage is full"));
             return ;
        }
       }
       
        if(item.expiration_date<=now){
            next(new BadRequestError("expiration_date must be future"));
            return;
        }
        item.expiration_date=expiration_date;
        item.storage_id=storage_id
        const res_id = await updateItem(item);
        const sItemTypes = itemTypes;
        const itemItemTypes:ItemItemType[] = []
        const dbItemItemTypes = await findItemItemTypeByItemId(res_id);
        for(var index=0;index<dbItemItemTypes.length;index++){
            var dItemItemType = dbItemItemTypes[index];
            await deleteItemItemType(res_id,dItemItemType.item_type_id);
        }
     
       for(var index = 0 ;index<sItemTypes.length;index++){
        var item_type_id = sItemTypes[index];
        var number_of_item_types= await findItemItemTypeByKey(res_id,item_type_id);
        if(number_of_item_types==0){
            var itemItemType:ItemItemType={
                item_id:res_id,
                item_type_id:item_type_id
            }
            await createItemItemType(itemItemType);
            itemItemTypes.push(itemItemType);
        }
   }

        const result = await findItemById(res_id);
        result.itemTypes=itemItemTypes.map(t=>t.item_type_id);
        
        const data:ResponseData={
            payload:result,
            count:1
        }
        res.status(200).send(data);




    }
)

export {router as updateItemRoute}