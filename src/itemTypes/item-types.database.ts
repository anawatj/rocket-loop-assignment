import pool from '../database/pool'
import {ItemType}  from '../itemTypes/item-types.interface'
export const findAllItemType=async()=>{
    let sql =`
        SELECT 
                id,
                name,
                CASE 
                 WHEN refrigerated=1 THEN 'true' 
                 ELSE 'false' 
                END as refrigerated
        FROM item_types

    `
    const result = await pool.query(sql);
    return result.rows;
}
export const createItemType=async(itemType:ItemType)=>{
    let sql =`
        INSERT INTO item_types
        (
            name,
            refrigerated
        )
        VALUES(
            $1,
            $2
        )
         RETURNING id
    `
    const res = await pool.query(sql,[itemType.name,itemType.refrigerated?1:0]);
    return res.rows[0].id;

}
export const findItemTypeById=async(id:Number)=>{
    let sql =`
    SELECT 
            id,
            name,
            CASE 
             WHEN refrigerated=1 THEN 'true' 
             ELSE 'false' 
            END as refrigerated
    FROM item_types
    WHERE id = $1

`
    const result = await pool.query(sql,[id])
    return result.rows[0];
}
export const findItemTypeByIds=async(ids:Number[])=>{
    let sql =`
    SELECT 
            id,
            name,
            CASE 
             WHEN refrigerated=1 THEN 'true' 
             ELSE 'false' 
            END as refrigerated
    FROM item_types

`
sql = sql +" WHERE id in("+ids.map(id=>id.toString()).join(",")+") ";
const result = await pool.query(sql);
return result.rows;
}
export const updateItemType=async(itemType:ItemType)=>{
    let sql =`
    UPDATE item_types
    SET 
        name=$1
    WHERE id = $2
    `
    const res = await pool.query(sql,[itemType.name,itemType.id])
    return itemType.id;
}
export const deleteItemType=async(id:Number)=>{
    let sql =`
        DELETE
        FROM item_types
        WHERE id=$1
    `
    const res = await pool.query(sql,[id])
    return true
}