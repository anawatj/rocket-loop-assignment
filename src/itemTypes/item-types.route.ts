import express from 'express'
import {indexItemTypeRoute} from './routes/index'
import {newItemTypeRoute}  from './routes/new'
import { deleteItemTypeRoute } from './routes/delete';
import { showItemTypeRoute } from './routes/show';

const router = express.Router();

router.use(indexItemTypeRoute);
router.use(newItemTypeRoute);
router.use(deleteItemTypeRoute);
router.use(showItemTypeRoute);

export {router as itemTypeRoute}