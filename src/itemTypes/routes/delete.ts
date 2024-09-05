import express, {Request,Response, NextFunction } from 'express';
import {NotFoundError}  from '../../errors/not-found-error'
import {ItemType}  from '../item-types.interface'
import {findItemTypeById,deleteItemType} from '../item-types.database'
import { findItemByItemType } from '../../items/item.database';
import { ResponseData } from '../../middlewares/response-data';
import { DatabaseConnectionError } from '../../errors/database-connection-error';
import { BadRequestError } from '../../errors/bad-request-error';

const router = express.Router();
router.delete('/:id',async(req:Request,res:Response,next:NextFunction)=>{
    const id = Number(req.params.id);
    const itemTye:ItemType = await findItemTypeById(id);
    if(!itemTye || !itemTye.id || itemTye.id==0){
        next(new NotFoundError())
        return;
    }
    const number_of_items = await findItemByItemType(id);
    if(number_of_items && number_of_items>0){
        next(new BadRequestError("Cannot delete item type that has item"));
        return;
    }
    const isDeleted = await deleteItemType(id)
    if(isDeleted){
        const data:ResponseData={
            payload:["Success"],
            count:1
        }
        res.status(200).send(data)
    }else{
        next(new DatabaseConnectionError())
        return;
    }
})
export {router as deleteItemTypeRoute}