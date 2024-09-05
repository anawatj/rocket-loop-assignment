import express, {Request,Response, NextFunction } from 'express';
import {NotFoundError}  from '../../errors/not-found-error'
import {ResponseData} from '../../middlewares/response-data'
import { BadRequestError } from '../../errors/bad-request-error';
import { findStorageById } from '../storage.database';
import { findItemByStorageId } from '../../items/item.database';

const router = express.Router();
router.get('/:id/items',async(req,res,next:NextFunction)=>{
    const id = Number(req.params.id)
    if(isNaN(id)){
        next(new BadRequestError("invalid id"));
        return;
    }
    const storage = await findStorageById(id);
    if(!storage || !storage.id || storage.id==0){
        next(new NotFoundError());
        return ;
    }
    const rows = await findItemByStorageId(id);
    if(rows.length==0){
        next(new NotFoundError());
        return;
    }
    const data:ResponseData={
        payload:rows ,
        count:rows.length
    };
    res.status(200).send(data);

})
export {router as showStorageItemRoute}