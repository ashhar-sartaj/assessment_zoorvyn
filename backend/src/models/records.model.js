import { pool } from "../config/db.js";
export const createRecordDB = async ({ user_id, amount, type, category, dateForDb,note, }) => {
    await pool.execute(
        `INSERT INTO txsdetails 
     (user_id, amount, type, category, transaction_date, note, is_deleted, created_at) VALUES (?, ?, ?, ?, ?, ?, false, NOW())`,
        [user_id, amount, type, category, dateForDb, note]
    );
}
export const getRecordsDB = async ({ type, category, startDate, endDate }) => {
    let query = `SELECT * FROM txsdetails WHERE is_deleted = 0`;
    const values = [];
    if (type) {
        query += " AND type = ?";
        values.push(type);
    }
    // Category filter
    if (category) {
        query += " AND category = ?"; //we are adddign or buiding our query
        values.push(category);
    }
    //  range of date filter
    if (startDate && endDate) {
        query += " AND transaction_date BETWEEN ? AND ?";  //we are adddign or buiding our query
        values.push(startDate, endDate);
    }
    // sort latest first
    query += " ORDER BY transaction_date DESC";

    const [rows] = await pool.execute(query, values);

    return rows;
};
export const getRecordById = async(id) => {
    const [rows] = await pool.execute(`SELECT * FROM txsdetails WHERE id = ?`, [id])
    return rows[0];
}
export const updateRecordDB = async (recordId, data) => {
    const updates = [];
    const values = [];

    const allowedFields = ["amount", "type", "category", "transaction_date", "note"];

    Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && allowedFields.includes(key)) {
            updates.push(`${key} = ?`);
            values.push(value);
        }
    });

    // if the updates array is empty..memans nothing to update..so return
    if (updates.length === 0) return;

    const query = `UPDATE txsdetails SET ${updates.join(", ")} WHERE id = ? AND is_deleted = 0`;
    values.push(recordId);
    await pool.execute(query, values);
};
export const deleteRecordDB = async (recordId) => {
    await pool.execute(
        //for our tiDB.. true is rrpesented as 1 and false as 0
        "UPDATE txsdetails SET is_deleted = 1 WHERE id = ?",
        [recordId]
    );
};