import express, {Request,Response, NextFunction } from 'express'
import { body } from 'express-validator';
import {validateRequest} from '../../middlewares/validate-request'
import {Storage} from '../storage.interface'
import {createStorage, findStorageById, updateStorage} from '../storage.database'
import { ResponseData } from '../../middlewares/response-data';

const router = express.Router();
router.post('',
    [
        body("name")
        .isString()
        .withMessage("name must be provided"),
        body("maximum_capacity")
        .isNumeric()
        .withMessage("maximum_capacity must be provided"),
        body("refrigerated")
        .isBoolean()
        .withMessage("refrigerated must be provided")
    ],
    validateRequest,
    async(req:Request,res:Response,next:NextFunction)=>{
            const {id,name,maximum_capacity,refrigerated} =req.body;
            
            const storage :Storage ={
                id:id ,
                name:name,
                maximum_capacity:maximum_capacity,
                refrigerated:refrigerated
            }
            let res_id = 0
            if(!id||id==0){
                 res_id = await createStorage(storage);
            }else{
                res_id = await updateStorage(storage);
            }
            const rows = await findStorageById(res_id);
            const data :ResponseData={
                payload:rows,
                count:1
            }
            res.status(200).send(data);

            
    }

);
export {router as newStorageRoute}