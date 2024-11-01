import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response, RequestHandler } from 'express';
import User from '../models/User';

const JWT_SECRET = process.env.JWT_KEY || '';

// SignUp
export const signup: RequestHandler =  async (req: Request, res: Response): Promise<void> => {
    const { firstName, lastName, email, password, dateOfBirth, gender} = req.body;

    try{
        const existingUser = await User.findOne({email});
        if(existingUser) {
            res.status(400).json({message: 'Email already Exists'});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            dateOfBirth,
            gender
        });
        try{
            const savedUser = await newUser.save();
            console.log("User saved:", savedUser);
            res.status(201).json({ message: "User registered successfully" });
        }catch (err) {
            console.error("Error saving user:", err);
        }
    }catch(error) {
        res.status(500).json({message: 'Error registering user'});
        return;
    }
};

//Login
export const login: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try{
        const user = await User.findOne({email});
        if (!user) {
            res.status(400).json({ message: 'User not found' });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(400).json({ message: 'Invalid password' });
            return;
        }

        const token = jwt.sign({ userId: user!._id}, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({message: 'User logged in successfully', token});
        // res.json({message: ' User Logged '})
    }catch(error) {
        res.status(500).json({ message: 'Error logging in' });
    }
};
