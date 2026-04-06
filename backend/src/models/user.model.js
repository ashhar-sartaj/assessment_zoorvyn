import { pool } from "../config/db.js"

export const getUserByEmail = async (email) => {
    const [rows] = await pool.execute(`SELECT * FROM users WHERE email=? LIMIT 1`,[email]);
   //will be [] if no user exist
    if (rows.length !== 0) {
        return rows[0]
    }
    return rows;
}
export const createUserDB = async (name, email, password, role, status)  => {
    const [rows] = await pool.execute(`INSERT INTO users (name, email, password, role, status) VALUES (?, ?, ?, ?, ?)`, [name, email, password, role, status])
    return rows;
}
export const checkUserbyId = async (userid)  => {
    const [rows] = await pool.execute(`SELECT id FROM users WHERE id=?`,[userid]);
    // console.log('from user model ',rows)
    return rows;
}
export const updateUserDB = async (userId, data) => {
    const updates = [];
    const values = [];

    Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
            updates.push(`${key} = ?`);
            values.push(value);
        }
    });

    if (updates.length === 0) return;

    const query = `UPDATE users SET ${updates.join(", ")} WHERE id = ?`;
    values.push(userId);

    await pool.execute(query, values);
}

export const getUserById = async (id) => {
    const [rows] = await pool.execute(
        "SELECT * FROM users WHERE id = ?",
        [id]
    );
    return rows[0];
};

export const deleteUserDB = async (id) => {
    await pool.execute(
        "UPDATE users SET status = 'inactive' WHERE id = ?",
        [id]
    );
};