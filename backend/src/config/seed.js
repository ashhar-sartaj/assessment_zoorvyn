// this will have a seed script to create admin 
import bcrypt from 'bcryptjs'
import { pool } from "./db.js";
import dotenv from 'dotenv'
dotenv.config();
const seedAdminRole = async () => {
    const [rows] = await pool.execute(`SELECT * FROM users WHERE role='admin' LIMIT 1`);
    if (rows.length === 0) {
        //no one exist as admin
        //create admin
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;
        const hashedPassword = await bcrypt.hash(adminPassword,10)

        const [rows] = await pool.execute(`INSERT INTO users (name, email, password, role, status) VALUES (?, ?, ?, ?, ?) `, ['admin', adminEmail, hashedPassword, 'admin', 'active'])
        console.log('admin created successfully')
    }  else {
        //admin already exist
        console.log('admin already exist')
    }
}
export default seedAdminRole;