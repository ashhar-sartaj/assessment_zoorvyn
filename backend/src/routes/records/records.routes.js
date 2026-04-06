import express from 'express'
import { authenticateToken } from '../../middleware/auth.middleware.js';
import { authorizeRoles } from '../../middleware/role.middleware.js';
import { createRecord, deleteRecord, getRecords, updateRecord } from '../../controllers/records/records.controller.js';

const router = express.Router();

//to get the txs details
router.post('/', authenticateToken, authorizeRoles('admin'), createRecord) //create record
router.get('/', authenticateToken, authorizeRoles('admin', 'analyst'), getRecords) //get records
//to update records : /:id
router.patch('/:id', authenticateToken, authorizeRoles('admin'), updateRecord);
//deleting the record: it will be a soft delete-- not completely removal from the db entry
router.delete('/:id', authenticateToken, authorizeRoles('admin'), deleteRecord);

export default router