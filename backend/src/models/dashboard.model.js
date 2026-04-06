import { pool } from "../config/db.js";

//this will get the sum(total income) and the sum(total expense)
export const getTotalsDB = async () => {
    const [rows] = await pool.execute(`
    SELECT 
      SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS totalIncome,
      SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS totalExpense
    FROM txsdetails
    WHERE is_deleted = 0 
  `);

    return rows[0];
};

//this will get the categorical wise sum of expense: we will sum(amount columns)
export const getCategoryBreakdownDB = async () => {
    const [rows] = await pool.execute(`
    SELECT category, SUM(amount) as total
    FROM txsdetails
    WHERE is_deleted = 0
    GROUP BY category
    ORDER BY total DESC
  `);
    return rows;
};