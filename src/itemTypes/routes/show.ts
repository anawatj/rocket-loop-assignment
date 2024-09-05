import express, {Request,Response, NextFunction } from 'express';
import {NotFoundError}  from '../../errors/not-found-error'
import {ItemType}  from '../item-types.interface'
import {findItemTypeById} from '../item-types.database'
import { ResponseData } from '../../middlewares/response-data';
import { DatabaseConnectionError } from '../../errors/database-connection-error';

const router = express.Router();
router.get('/:id',async(req:Request,res:Response,next:NextFunction)=>{
    const id = Number(req.params.id);
    const result = await findItemTypeById(id);
    if(!result || !result.id || result.id==0){
        next(new NotFoundError())
        return;
    }
    const data:ResponseData={
        payload:result,
        count:1
    }
    res.status(200).send(data)
})
export {router as showItemTypeRoute}