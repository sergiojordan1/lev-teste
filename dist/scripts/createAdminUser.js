"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = __importDefault(require("../src/models/User"));
const database_1 = __importDefault(require("../src/config/database"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function createAdminUser() {
    try {
        await (0, database_1.default)();
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@email.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
        const adminName = process.env.ADMIN_NAME || 'Admin';
        const adminCPF = process.env.ADMIN_CPF || '666.565.600-40';
        const adminBirthday = new Date();
        const existingAdmin = await User_1.default.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log('Usuário administrador já existe.');
            process.exit(0);
        }
        const passwordHash = await bcrypt_1.default.hash(adminPassword, 10);
        const newAdmin = new User_1.default({
            name: adminName,
            email: adminEmail,
            cpf: adminCPF,
            birthday: adminBirthday,
            passwordHash: passwordHash,
            role: 'admin',
            status: 'Ativo',
        });
        await newAdmin.save();
        console.log('Usuário administrador criado com sucesso!');
        process.exit(0);
    }
    catch (error) {
        console.error('Erro ao criar usuário administrador:', error);
        process.exit(1);
    }
}
createAdminUser();
