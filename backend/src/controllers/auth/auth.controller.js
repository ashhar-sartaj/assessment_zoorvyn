import { getUserByEmail } from "../../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
export const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: 'email and password required'
            })
        }
        //get the user from db
        const user = await getUserByEmail(email);
        console.log(user)//will return the single user object.
        if (!user) {
            return res.status(401).json({mesage: 'invalid credentials'})
        }
        console.log(user)
        //check the status of that user: most probably it will be active as when admin is registering that user, we are setting the status as active
        if (user.status !== 'active') {
            return res.status(403).json({message: 'user is inactive, contact your admin'});

        }
        //checking the password
        const passverified  = await bcrypt.compare(password, user.password);
        if (!passverified) {
            return res.status(401).json({ mesage: 'invalid credentials' })
        }
        //finally generate jwt
        const payload = {
            id: user.id,
            role: user.role,
            status: user.status
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET);
        return res.status(200).json({
            token,
            user
        })
    } catch(err) {
        console.error('login error ',err.message);
        return res.status(500).json({message: 'Internal server error'})
    }
}
