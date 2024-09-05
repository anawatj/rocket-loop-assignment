import express from 'express';
import { indexItemRoute } from './routes';
import { newItemRoute } from './routes/new';
import { showItemRoute } from './routes/show';
import { updateItemRoute } from './routes/update';
import { deleteItemRoute } from './routes/delete';

const router = express.Router();

router.use(indexItemRoute);
router.use(newItemRoute);
router.use(showItemRoute);
router.use(updateItemRoute);
router.use(deleteItemRoute);

export {router as itemRoute};