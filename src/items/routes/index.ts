import express,{Request,Response,NextFunction} from 'express'
import {NotFoundError} from '../../errors/not-found-error'
import { Item } from '../item.interface';
import { findAllItem } from '../item.database';
import { ResponseData } from '../../middlewares/response-data';

const router = express.Router();

  
router.get('',async(req:Request,res:Response,next:NextFunction)=>{
    const {skip,take} = req.query
    
    const results = await findAllItem(skip? skip as string:undefined,take?take as string:undefined)
    if(results.length==0){
        next(new NotFoundError());
        return;
    }
    const data:ResponseData={
        payload:results,
        count:results.length
    };
    res.status(200).send(data);
});
export {router as indexItemRoute}