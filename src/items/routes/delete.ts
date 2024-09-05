import express, {Request,Response, NextFunction } from 'express';
import {NotFoundError}  from '../../errors/not-found-error'
import { BadRequestError } from '../../errors/bad-request-error';
import { deleteItem, deleteItemItemType, findItemById, findItemItemTypeByItemId } from '../item.database';
import { ResponseData } from '../../middlewares/response-data';
import { DatabaseConnectionError } from '../../errors/database-connection-error';

const router = express.Router();
router.delete("/:id",async(req:Request,res:Response,next:NextFunction)=>{
    const id = Number(req.params.id)
    if(isNaN(id)){
        next(new BadRequestError("invalid id"))
        return 
    }
    const item = await findItemById(id)
    if(!item || !item.id || item.id==0){
        next(new NotFoundError())
        return 
    }
    const itemItemTypes = await findItemItemTypeByItemId(id);
    for(var index=0;index<itemItemTypes.length;index++){
        var itemItemType = itemItemTypes[index];
        await deleteItemItemType(itemItemType.item_id,itemItemType.item_type_id);
    }
    const isDeleted = await deleteItem(id);
    if(isDeleted){
        const data:ResponseData={
            payload:["Success"],
            count:1
        }
        res.status(200).send(data)
    }else{
        next(new DatabaseConnectionError())
        return
    }
})
export {router as deleteItemRoute}