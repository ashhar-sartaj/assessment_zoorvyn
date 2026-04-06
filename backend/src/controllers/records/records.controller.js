import { createRecordDB, deleteRecordDB, getRecordById, getRecordsDB, updateRecordDB } from "../../models/records.model.js";

const dateConvert = (date) => {
    const dateObj = new Date(date);
    const dbFormattedDate = dateObj.toISOString().slice(0, 19).replace('T', ' ');
    return dbFormattedDate;
}
export const createRecord = async (req, res) => {
    try {
        const { amount, type, category, note, date} = req.body
        if (!amount || !type || !category || !date) {
            return res.status(400).json({
                message: "amount, type, category and date are required",
            });
        }
        //coverting the this date to utc format to db insertion
        const dateForDb = await dateConvert(date);
        console.log('date conversion success')
        const validTypes = ["income", "expense"];
        if (!validTypes.includes(type)) {
            return res.status(400).json({
                message: "Invalid type (must be income or expense)",
            });
        }
        const user_id = req.user.id; // this will be coming from the middleware
        await createRecordDB({ user_id, amount, type, category, dateForDb, note});
        return res.status(201).json({
            message: "record created successfully",
        });
    } catch(err) {
        console.error("recprd creation error:", err.message);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}


export const getRecords = async (req, res) => {
    try {
        const { type, category, startDate, endDate } = req.query;
        const filters = {type, category, startDate, endDate };
        const records = await getRecordsDB(filters);

        return res.status(200).json({
            data: records,
        });
    } catch (err)  {
        console.error("Get records error:", err.message);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}
export const updateRecord = async (req, res) => {
    try {
        const recordId = req.params.id;
        const { amount, type, category, transaction_date, note } = req.body;

        // existence of record
        const record = await getRecordById(recordId);
        if (!record || record.is_deleted) {
            return res.status(404).json({ message: "Record not found" });
        }

        // the record type validation
        if (type) {
            const validTypes = ["income", "expense"];
            if (!validTypes.includes(type)) {
                return res.status(400).json({ message: "Invalid type" });
            }
        }

        // its obvious that the amount to be updated must be > 0
        if (amount && amount <= 0) {
            return res.status(400).json({ message: "Amount must be > 0" });
        }

        // 4. at at least one field to beb entered for updation
        if (!amount && !type && !category && !transaction_date && !note) {
            return res.status(400).json({
                message: "At least one field is required",
            });
        }

        // 5. Update
        await updateRecordDB(recordId, {amount,type,category,transaction_date,note});

        return res.status(200).json({
            message: "Record updated successfully",
        });
    } catch (err) {
        console.error("Update record error:", err.message);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

export const deleteRecord = async (req, res) => {
    try {
        const recordId = req.params.id;

        // record ixist 
        const record = await getRecordById(recordId);

        if (!record || record.is_deleted) {
            return res.status(404).json({
                message: "Record not found",
            });
        }

        // deleting but not hard way
        await deleteRecordDB(recordId);

        return res.status(200).json({
            message: "Record deleted successfully",
        });
    } catch (err) {
        console.error("delete record error:", err.message);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};