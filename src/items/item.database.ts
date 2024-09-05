import { EventEmitterAsyncResource } from 'stream'
import pool from '../database/pool'
import { Item, ItemItemType } from './item.interface'

export const findAllItem = async (skip: string | undefined, take: string | undefined) => {
    let sql = `
    SELECT 
            id,
            name,
            expiration_date,
            storage_id
    FROM items
    ORDER BY expiration_date

`

    if (skip && take) {
        sql += ` OFFSET ${skip} LIMIT ${take} `
    } else if (skip && !take) {
        sql += ` OFFSET ${skip} `
    } else if (!skip && take) {
        sql += ` LIMIT ${take} `
    }
    const result = await pool.query(sql);
    return result.rows;
}
export const createItem = async (item: Item) => {
    let sql = `
    INSERT INTO items
    (
        name,
        expiration_date,
        storage_id
    )
    VALUES
    (
        $1,
        $2,
        $3
    )
    RETURNING id
`
    const res = await pool.query(sql, [item.name, item.expiration_date, item.storage_id]);
    return res.rows[0].id
}
export const findItemById = async (id: Number) => {
    let sql = `
    SELECT 
            id,
            name,
            expiration_date,
            storage_id
    FROM items
    WHERE id = $1

`
    const result = await pool.query(sql, [id]);
    return result.rows[0];
}
export const updateItem = async (item: Item) => {
    let sql = `
    UPDATE items
    SET 
        expiration_date=$1,
        storage_id=$2
    WHERE
        id=$3
`
    const res = await pool.query(sql, [item.expiration_date, item.storage_id, item.id]);
    return item.id;
}
export const deleteItem = async (id: Number) => {
    let sql = `
        DELETE
        FROM items
        WHERE id = $1
    `
    const res = await pool.query(sql, [id]);
    return true;
}

export const findItemByItemType = async (item_type_id: Number) => {
    let sql = `
    SELECT 
            count(*) as number_of_items
    FROM item_item_types
    WHERE item_type_id=$1

`
    const result = await pool.query(sql, [item_type_id]);
    return result.rows[0].number_of_items;
}
export const findItemByStorage = async (storage_id: Number) => {
    let sql = `
    SELECT 
            count(*) as number_of_items
    FROM items
    WHERE storage_id=$1

`
    const result = await pool.query(sql, [storage_id]);
    return result.rows[0].number_of_items;
}
export const findItemByStorageId = async (storage_id: Number) => {
    let sql = `
    SELECT 
            id,
            name,
            expiration_date,
            storage_id
    FROM items
    WHERE storage_id=$1
    ORDER BY expiration_date
    
`
    const result = await pool.query(sql, [storage_id])
    return result.rows;
}
export const createItemItemType = async (itemItemType: ItemItemType) => {
    let sql = `
        INSERT INTO item_item_types
        (
            item_id,
            item_type_id
        )
        VALUES(
            $1,
            $2
        )  
    `
    await pool.query(sql, [itemItemType.item_id, itemItemType.item_type_id]);
    return itemItemType;

}
export const deleteItemItemType = async (item_id: number, item_type_id: number) => {
    let sql = `
        DELETE
        FROM item_item_types
        WHERE item_id=$1 AND item_type_id=$2
`
    await pool.query(sql, [item_id, item_type_id]);
    return true;
}
export const findItemItemTypeByItemId = async (item_id: number) => {
    let sql = `
    SELECT 
        item_id,
        item_type_id
    FROM item_item_types
    WHERE item_id=$1 
`
    const result = await pool.query(sql, [item_id]);
    return result.rows;
}

export const findItemItemTypeByKey = async (item_id: Number, item_type_id: Number) => {
    let sql = `
        SELECT count(*) as number_of_items
        FROM item_item_types
        WHERE item_id=$1 AND item_type_id=$2
    `
    const result = await pool.query(sql, [item_id, item_type_id]);
    return result.rows[0].number_of_items;

}