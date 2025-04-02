"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const JWT_SECRET = process.env.JWT_SECRET || 'MY_SECRET';
class AuthController {
    async login(req, res) {
        const { email, password } = req.body;
        try {
            const user = await User_1.default.findOne({ email });
            if (!user) {
                res.status(401).json({ message: 'Credenciais inválidas' });
                return;
            }
            const passwordMatch = await bcrypt_1.default.compare(password, user.passwordHash);
            if (!passwordMatch) {
                res.status(401).json({ message: 'Credenciais inválidas' });
                return;
            }
            const token = jsonwebtoken_1.default.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
            res.json({ token });
        }
        catch (error) {
            console.error('Erro ao fazer login:', error);
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }
    async register(req, res) {
        const { email, password } = req.body;
        try {
            const existingUser = await User_1.default.findOne({ email });
            if (existingUser) {
                res.status(409).json({ message: 'Email já registrado' });
                return;
            }
            const passwordHash = await bcrypt_1.default.hash(password, 10);
            const newUser = new User_1.default({ email, passwordHash });
            await newUser.save();
            res.status(201).json({ message: 'Usuário registrado com sucesso' });
        }
        catch (error) {
            console.error('Erro ao registrar usuário:', error);
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }
}
exports.default = new AuthController();
