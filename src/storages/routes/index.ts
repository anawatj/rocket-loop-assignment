import express, {Request,Response, NextFunction } from 'express';
import {NotFoundError}  from '../../errors/not-found-error'
import {ResponseData} from '../../middlewares/response-data'
import {findAllStorage} from '../storage.database';

const router = express.Router();

router.get('',async(req:Request,res:Response,next:NextFunction)=>{
    const results = await findAllStorage();
    if(results.length==0){
        next(new NotFoundError())
        return ;
       
    }
    const data:ResponseData= {
        payload:results,
        count:results.length
    }
    return res.status(200).send(data);
});
export {router as indexStorageRoute}