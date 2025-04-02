import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from '../src/models/User';
import connectDB from '../src/config/database';
import dotenv from 'dotenv';

dotenv.config();

async function createAdminUser() {
  try {
    await connectDB();

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@email.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const adminName = process.env.ADMIN_NAME || 'Admin';
    const adminCPF = process.env.ADMIN_CPF || '666.565.600-40';
    const adminBirthday = new Date();

    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('Usuário administrador já existe.');
      process.exit(0);
    }

    const passwordHash = await bcrypt.hash(adminPassword, 10);

    const newAdmin = new User({
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
  } catch (error) {
    console.error('Erro ao criar usuário administrador:', error);
    process.exit(1);
  }
}

createAdminUser();