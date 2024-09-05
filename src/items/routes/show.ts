import express, {Request,Response, NextFunction } from 'express'
import { BadRequestError } from '../../errors/bad-request-error';
import { findItemById, findItemItemTypeByItemId } from '../item.database';
import { NotFoundError } from '../../errors/not-found-error';
import { ResponseData } from '../../middlewares/response-data';


const router = express.Router();
router.get('/:id',async(req:Request,res:Response,next:NextFunction)=>{
    const id= Number(req.params.id)
    if(isNaN(id)){
        next(new BadRequestError("invalid id"))
        return 
    }
    const result = await findItemById(id);
    if(!result || !result.id || result.id==0){
        next(new NotFoundError())
        return;
    }
    const itemTypes = await findItemItemTypeByItemId(id);
    result.itemTypes=itemTypes.map(t=>t.item_type_id);
    const data:ResponseData={
        payload:result,
        count:1
    }
    res.status(200).send(data);
});
export {router as showItemRoute}