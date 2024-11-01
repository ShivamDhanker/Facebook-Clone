"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const JWT_SECRET = process.env.JWT_KEY || '';
// SignUp
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, password, dateOfBirth, gender } = req.body;
    try {
        const existingUser = yield User_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: 'Email already Exists' });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newUser = new User_1.default({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            dateOfBirth,
            gender
        });
        try {
            const savedUser = yield newUser.save();
            console.log("User saved:", savedUser);
            res.status(201).json({ message: "User registered successfully" });
        }
        catch (err) {
            console.error("Error saving user:", err);
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error registering user' });
        return;
    }
});
exports.signup = signup;
//Login
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            res.status(400).json({ message: 'User not found' });
            return;
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(400).json({ message: 'Invalid password' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'User logged in successfully', token });
        // res.json({message: ' User Logged '})
    }
    catch (error) {
        res.status(500).json({ message: 'Error logging in' });
    }
});
exports.login = login;
