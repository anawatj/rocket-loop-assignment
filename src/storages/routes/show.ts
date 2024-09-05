import express, {Request,Response, NextFunction } from 'express';
import {NotFoundError}  from '../../errors/not-found-error'
import {Storage} from '../storage.interface'
import { findStorageById} from '../storage.database'
import { ResponseData } from '../../middlewares/response-data';

const router = express.Router();
router.get('/:id',async(req:Request,res:Response,next:NextFunction)=>{
    const id = Number(req.params.id);
    const result = await findStorageById(id);
    if(!result || !result.id || result.id==0){
        next(new NotFoundError())
        return;
    }
    const data :ResponseData={
        payload:result,
        count:1
    }
    res.status(200).send(data);
});
export {router as showStorageRoute}