import pool from '../database/pool'
import {Storage} from './storage.interface'
export const findAllStorage=async()=>{
    let sql =`
        SELECT 
                id,
                name,
                maximum_capacity,
                CASE 
                 WHEN refrigerated=1 THEN 'true' 
                 ELSE 'false' 
                END as refrigerated
        FROM storages

    `
    const result = await pool.query(sql)
    return result.rows;

}
export const createStorage=async(storage:Storage)=>{
    let sql =`
        INSERT INTO storages(
            name,
            maximum_capacity,
            refrigerated
        )
        VALUES(
            $1,
            $2,
            $3
        )
        RETURNING id

    `
    const res = await pool.query(sql,[storage.name,storage.maximum_capacity,storage.refrigerated?1:0])
    return res.rows[0].id;
}

export const findStorageById=async(id:number)=>{
    let sql =`
       SELECT 
                id,
                name,
                maximum_capacity,
                CASE 
                 WHEN refrigerated=1 THEN 'true' 
                 ELSE 'false' 
                END as refrigerated
        FROM storages
        WHERE id=$1


    `
    const result = await pool.query(sql,[id]);
    return result.rows[0];
}

export const updateStorage=async(storage:Storage)=>{
    let sql =`
      UPDATE storages
      SET 
            name=$1
      WHERE
            id=$2


    `
    const result = await pool.query(sql,[storage.name,storage.id]);
    return storage.id;
}

export const deleteStorage=async(id:Number)=>{
    let sql =`
    DELETE
    FROM storages
    WHERE 
         id=$1
    `
    const result = await pool.query(sql,[id])
    return true;
}