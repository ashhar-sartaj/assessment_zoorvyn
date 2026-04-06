import bcrypt, { hash } from "bcryptjs";
import { checkUserbyId, createUserDB, deleteUserDB, getUserByEmail, getUserById, updateUserDB } from "../../models/user.model.js";

export const createUser = async (req, res) => {
    try {
        const {name, email, password, role, status} = req.body;
        if (!name ||  !email, !password, !role, !status) {
            return res.status(400).json({
                message: 'provide valid fields'
            })
        }
        const validRoles = ['admin', 'analyst', 'viewer'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }
        //checking if the user with the provided email already exist
        const existingUser = await getUserByEmail(email);
        console.log(existingUser)
        if (existingUser.length!==0) {
            //means we already have some 
            return res.status(400).json({message: 'user already exist'})
        }
        const hashedPassword = await bcrypt.hash(password,10);
        //making a db call
        const result = await createUserDB(name, email, hashedPassword, role, status);
        if (result.affectedRows === 1) {
            return res.status(201).json({message: 'user created'})
        }
    } catch (err) {
        console.error('user creation error ', err.message);
        return res.status(500).json({ message: 'Internal server error' })
    }
}
//this controller will be used to update the user: condition is that the role must be admin
export const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        console.log('user id from params ',userId)
        //validating the userId
        const userExist = await checkUserbyId(userId);
        // console.log(userExist)
        if (userExist.length === 0) {
            //means user does exist with the provided id
            return res.status(404).json({ message: "User not found" })
        } 
        //admin can update user value
        const {name, email, password, role, status} = req.body
        if (!name && !email && !password && !role && !status) {
            return res.status(400).json({
                message: "AT least one field is reuqired for updation",
            });
        }
        //for validating roles : we have to perform 2 checks first to check whether teh provided roles is correct (means not something like student)
        //the other  check is role must have some value not empty space 
        const validRoles = ['admin', 'analyst', 'viewer'];
        //the curent role must not match
        if (role && !validRoles.includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        // Validate status
        const validStatus = ['active', 'inactive'];
        if (status && !validStatus.includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }
        //if password is provided to chenge
        let hashedPassword;
        if (password) {
            hashedPassword = bcrypt.hash(password, hashedPassword)
        }
        //finally call to db for updation
        const dataToUpdate = {
            name, 
            email,
            password: hashedPassword,
            role,
            status 
        }
        await updateUserDB(userId, dataToUpdate)
        return res.status(200).json({
            message: "user updation successfully",
        });
    } catch(err) {
        console.error('user updation error ', err.message);
        return res.status(500).json({ message: 'Internal server error' })
    }
}

export const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        // 1. Check if user exists
        const user = await getUserById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        // 2. Prevent deleting admin (important)
        if (user.role === "admin") {
            return res.status(400).json({
                message: "Admin cannot be deleted",
            });
        }

        // 3. Soft delete → mark inactive
        await deleteUserDB(userId);

        return res.status(200).json({
            message: "User deactivated successfully",
        });
    } catch (err) {
        console.error("Delete user error:", err.message);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};