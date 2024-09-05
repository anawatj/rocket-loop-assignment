import express, {Request,Response, NextFunction } from 'express'
import { body } from 'express-validator';

import {validateRequest} from '../../middlewares/validate-request'

import { ResponseData } from '../../middlewares/response-data';
import { Item, ItemItemType } from '../item.interface';
import { findItemTypeByIds } from '../../itemTypes/item-types.database';
import { BadRequestError } from '../../errors/bad-request-error';
import { findStorageById } from '../../storages/storage.database';
import { createItem, createItemItemType, findItemById, findItemByStorage, findItemItemTypeByKey } from '../item.database';

const router = express.Router();
router.post('',
    [
        body("name")
        .isString()
        .withMessage("name must be provided"),
        body("expiration_date")
        .isDate()
        .withMessage("expiration_date must be provided"),
        body("storage_id")
        .isNumeric()
        .withMessage("storage_id must be provided")
    ],
    validateRequest,
    async(req:Request,res:Response,next:NextFunction)=>{
       const {name,expiration_date,storage_id,itemTypes} = req.body;
       const item:Item={
        id:0,
        name:name,
        expiration_date:expiration_date,
        storage_id:storage_id,
        itemTypes:itemTypes
       }
       const now = new Date();
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
       const number_of_items = await findItemByStorage(storage_id);
       if(number_of_items>=storage.maximum_capacity){
            next(new BadRequestError("Storage is full"));
            return ;
       }

       if(item.expiration_date<=now){
           next(new BadRequestError("expiration_date must be future"));
           return;
       }
       const res_id =await createItem(item);
       const sItemTypes = itemTypes;
       const itemItemTypes:ItemItemType[] = []
       
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
      
       const rows = await findItemById(res_id);
       rows.itemTypes=itemItemTypes.map(t=>t.item_type_id);

       const data:ResponseData={
        payload:rows,
        count:rows.length
       }
       return res.status(201).send(data);

    }
)
export {router as newItemRoute}