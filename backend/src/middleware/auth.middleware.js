import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();
export const authenticateToken= async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'unauthorized'})
        }
        const tokenFromHeader = authHeader.split(" ")[1];
        const decodedToken = await jwt.verify(tokenFromHeader, process.env.JWT_SECRET);
        //setting the user property to the req object
        req.user = decodedToken; //will have all info of the user
        next();
    } catch(err) {
        return res.status(401).json({message: 'token authentication failed'})
    }
}