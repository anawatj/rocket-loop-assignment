import express, {Request,Response, NextFunction } from 'express'
import { body } from 'express-validator';
import {validateRequest} from '../../middlewares/validate-request'
import {ItemType} from '../item-types.interface'
import {findItemTypeById,createItemType,updateItemType}  from '../../itemTypes/item-types.database'
import { ResponseData } from '../../middlewares/response-data';

const router = express.Router();
router.post('',
    [
        body("name")
        .isString()
        .withMessage("name must be provided"),
        body("refrigerated")
        .isBoolean()
        .withMessage("refrigerated must be provided")
    ],
    validateRequest,
    async(req:Request,res:Response,next:NextFunction)=>{
        const {id,name,refrigerated} =req.body;
            
        const itemType :ItemType ={
            id:id ,
            name:name,
            refrigerated:refrigerated
        }
        let res_id = 0;
        if(!itemType.id || itemType.id==0){
            res_id=await createItemType(itemType)
        }else {
            res_id=await updateItemType(itemType)
        }
        const rows = await findItemTypeById(res_id)
        const data:ResponseData={
            payload:rows,
            count:rows.length
        }
        res.status(200).send(data)

    }
)
export {router as newItemTypeRoute}