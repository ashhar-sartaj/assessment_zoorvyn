import express from 'express'
import cors from 'cors'
import { pool } from './config/db.js';
import seedAdminRole from './config/seed.js';
import authRoutes from './routes/auth/auth.routes.js';
import userRoutes from './routes/user/user.routes.js'
import path from "path";
import { fileURLToPath } from "url";
import recordsRoutes from './routes/records/records.routes.js'
import dashboardRoutes from './routes/dashboard/dashboard.routes.js'
import swaggerUi from "swagger-ui-express";
// import swaggerSpec from "./config/swagger.js";
import YAML from 'yamljs'
// const swaggerDocument = YAML.load('./swagger.yaml');

const app = express();
app.use(express.json());
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerPath = path.join(__dirname, "swagger.yaml");
const swaggerDocument = YAML.load(swaggerPath);


// console.log(swaggerDocument)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
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
app.use('/api/auth', authRoutes); //will handle only login (caters to all)
app.use('/api/user', userRoutes); //will handle new user craetion, updation, deletion (only by admin)
app.use('/api/records', recordsRoutes); //this will manage all the record routes (only by the admin)
app.use('/api/dashboard', dashboardRoutes); //will get the dashboard summary (applicable for all)
app.get('/', async (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'base url hit'
    })
})
export default app;