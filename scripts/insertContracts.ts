import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Contract from '../src/models/Contract';
import User from '../src/models/User';

dotenv.config();

async function insertContracts() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/lev-teste');
    console.log('Conectado ao MongoDB');

    const existingUser = await User.findOne({});
    if (!existingUser) {
      console.error('Nenhum usuário encontrado para associar aos contratos. Crie um usuário primeiro.');
      mongoose.connection.close();
      return;
    }
    const importUserId = existingUser._id;

    const contractsData = [
      {
        registerCode: "ABC123XYZ",
        sellerName: "Maria Silva",
        sellerCPF: "58397804037",
        clientName: "João Pereira",
        clientCPF: "30962871005",
        clientBirthday: new Date("2000-03-15"),
        situation: "Pendente",
        importUserId: importUserId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        registerCode: "DEF456UVW",
        sellerName: "Carlos Oliveira",
        sellerCPF: "14725836914",
        clientName: "Ana Souza",
        clientCPF: "85296374125",
        clientBirthday: new Date("1995-11-20"),
        situation: "Concluido",
        importUserId: importUserId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        registerCode: "GHI789RST",
        sellerName: "Fernanda Lima",
        sellerCPF: "74185296308",
        clientName: "Pedro Santos",
        clientCPF: "96385274119",
        clientBirthday: new Date("2002-01-05"),
        situation: "Cancelado",
        importUserId: importUserId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        registerCode: "JKL012MNO",
        sellerName: "Ricardo Gomes",
        sellerCPF: "10293847560",
        clientName: "Mariana Alves",
        clientCPF: "65478932101",
        clientBirthday: new Date("1988-07-10"),
        situation: "Recusado",
        importUserId: importUserId,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const result = await Contract.insertMany(contractsData);
    console.log('Contratos inseridos com sucesso:', result);

    mongoose.connection.close();
  } catch (error) {
    console.error('Erro ao inserir contratos:', error);
    mongoose.connection.close();
  }
}

insertContracts();