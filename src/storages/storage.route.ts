import express from 'express'
import {indexStorageRoute} from  './routes'
import {newStorageRoute}  from './routes/new'
import { deleteStorageRoute } from './routes/delete';
import { showStorageRoute } from './routes/show';
import { showStorageItemRoute } from './routes/show-items';
const router = express.Router();
router.use(indexStorageRoute);
router.use(newStorageRoute);
router.use(deleteStorageRoute);
router.use(showStorageRoute);
router.use(showStorageItemRoute);
export {router as storageRoute}