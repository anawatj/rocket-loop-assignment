import express, { json } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import pool  from './database/pool'
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';
import { storageRoute}  from './storages/storage.route'
import {itemTypeRoute} from './itemTypes/item-types.route'
import { itemRoute } from './items/item.route';
const app = express();
var options = {
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
}
app.use(cors(options));
app.use(json());
app.use('/api/v1/storages',storageRoute);
app.use('/api/v1/itemTypes',itemTypeRoute);
app.use('/api/v1/items',itemRoute);
console.log(pool);
pool.connect(function (err, client, done) {
    if (err) throw new Error(err.message);
    console.log('Connected');
    
    
  }); 



app.use(errorHandler)
app.all('*', async (req, res,next) => {
  next(new NotFoundError());
});
export {app} ;