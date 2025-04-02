"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../models/User"));
class UserController {
    async getUserInfo(req, res) {
        try {
            const userId = req.userId;
            if (!userId) {
                res.status(401).json({ message: 'Não autorizado' });
                return;
            }
            const user = await User_1.default.findById(userId);
            if (!user) {
                res.status(404).json({ message: 'Usuário não encontrado' });
                return;
            }
            res.json({ name: user.name });
        }
        catch (error) {
            console.error('Erro ao buscar informações do usuário:', error);
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }
}
exports.default = new UserController();
