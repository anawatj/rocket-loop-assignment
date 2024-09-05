import express, {Request,Response, NextFunction } from 'express';
import {NotFoundError}  from '../../errors/not-found-error'
import { findItemByStorage } from '../../items/item.database';
import {Storage} from '../storage.interface'
import {deleteStorage, findStorageById} from '../storage.database'
import { ResponseData } from '../../middlewares/response-data';
import { DatabaseConnectionError } from '../../errors/database-connection-error';
import { BadRequestError } from '../../errors/bad-request-error';

const router = express.Router();
router.delete('/:id',async(req:Request,res:Response,next:NextFunction)=>{
    const id = Number(req.params.id);
    const storage:Storage = await findStorageById(id);
    if(!storage || !storage.id || storage.id==0){
        next(new NotFoundError())
        return;
    }
    const number_of_items = await findItemByStorage(id);
    if(number_of_items && number_of_items>0){
        next(new BadRequestError("cannot delete storage that have items"))
        return;
    }
    const isDeleted = await deleteStorage(id);
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
export {router as deleteStorageRoute}