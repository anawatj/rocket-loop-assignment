import express,{Request,Response,NextFunction} from 'express'
import {NotFoundError} from '../../errors/not-found-error'
import {ItemType}  from '../item-types.interface'
import {findAllItemType}  from '../item-types.database'
import { ResponseData } from '../../middlewares/response-data';

const router = express.Router();
router.get('',async(req:Request,res:Response,next:NextFunction)=>{
    const results = await findAllItemType();
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
export {router as indexItemTypeRoute}