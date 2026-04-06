import express from 'express'
import cors from 'cors'
import { pool } from './config/db.js';
const app = express();
app.use(express.json());
app.use(cors());
import seedAdminRole from './config/seed.js';
// careting the db connection 
try {
    await pool.execute("SELECT 1");
    console.log('db connected successfully');
    //now runing the seedAdminRole: this will check if the admin already exist if no then it will create one.
    await seedAdminRole(); 
} catch (err) {
    console.error('db connection failed ', err.message);
    process.exit(1);
}
app.get('/', async (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'base url hit'
    })
})
export default app;