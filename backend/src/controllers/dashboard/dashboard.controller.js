import { getCategoryBreakdownDB, getTotalsDB } from "../../models/dashboard.model.js";

export const getSummary = async (req, res) => {
    try {
        const totals = await getTotalsDB(); //to get the total value of trasactions - db call
        const categoryBreakdown = await getCategoryBreakdownDB(); //to get categorical breakdown - db call

        return res.status(200).json({
            totalIncome: totals.totalIncome || 0,
            totalExpense: totals.totalExpense || 0,
            netBalance:
                (totals.totalIncome || 0) - (totals.totalExpense || 0),
            categoryBreakdown,
        });
    } catch (err) {
        console.error("Dashboard error:", err.message);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}