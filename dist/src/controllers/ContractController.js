"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Contract_1 = __importDefault(require("../models/Contract"));
class ContractController {
    async getAllContracts(req, res) {
        try {
            const userId = req.userId;
            if (!userId) {
                res.status(401).json({ message: 'Não autorizado' });
                return;
            }
            const contracts = await Contract_1.default.find({ importUserId: userId }).sort({ updatedAt: -1 });
            res.json(contracts);
        }
        catch (error) {
            console.error('Erro ao buscar contratos:', error);
            res.status(500).json({ message: 'Erro ao buscar contratos' });
        }
    }
    async createContract(req, res) {
        try {
            const userId = req.userId;
            if (!userId) {
                res.status(401).json({ message: 'Não autorizado' });
                return;
            }
            const { registerCode, sellerName, sellerCPF, clientName, clientCPF, clientBirthday, situation } = req.body;
            const newContract = new Contract_1.default({
                registerCode,
                sellerName,
                sellerCPF,
                clientName,
                clientCPF,
                clientBirthday,
                situation,
                importUserId: userId,
            });
            const savedContract = await newContract.save();
            res.status(201).json(savedContract);
        }
        catch (error) {
            console.error('Erro ao criar contrato:', error);
            if (error.code === 11000 && error.keyPattern && error.keyPattern.registerCode) {
                res.status(400).json({ message: 'Código de registro já existe.' });
            }
            else if (error.name === 'ValidationError') {
                const errors = Object.values(error.errors).map((err) => err.message);
                res.status(400).json({ message: 'Erro de validação', errors });
            }
            else {
                res.status(500).json({ message: 'Erro ao criar contrato' });
            }
        }
    }
    async getContractById(req, res) {
        try {
            const userId = req.userId;
            const contractId = req.params.id;
            if (!userId) {
                res.status(401).json({ message: 'Não autorizado' });
                return;
            }
            const contract = await Contract_1.default.findOne({ _id: contractId, importUserId: userId });
            if (!contract) {
                res.status(404).json({ message: 'Contrato não encontrado' });
                return;
            }
            res.json(contract);
        }
        catch (error) {
            console.error('Erro ao buscar contrato por ID:', error);
            res.status(500).json({ message: 'Erro ao buscar contrato' });
        }
    }
    async updateContract(req, res) {
        try {
            const userId = req.userId;
            const contractId = req.params.id;
            if (!userId) {
                res.status(401).json({ message: 'Não autorizado' });
                return;
            }
            const { registerCode, sellerName, sellerCPF, clientName, clientCPF, clientBirthday, situation } = req.body;
            const updatedContract = await Contract_1.default.findOneAndUpdate({ _id: contractId, importUserId: userId }, { registerCode, sellerName, sellerCPF, clientName, clientCPF, clientBirthday, situation }, { new: true, runValidators: true });
            if (!updatedContract) {
                res.status(404).json({ message: 'Contrato não encontrado ou não pertence ao usuário' });
                return;
            }
            res.json(updatedContract);
        }
        catch (error) {
            console.error('Erro ao atualizar contrato:', error);
            if (error.code === 11000 && error.keyPattern && error.keyPattern.registerCode) {
                res.status(400).json({ message: 'Código de registro já existe.' });
            }
            else if (error.name === 'ValidationError') {
                const errors = Object.values(error.errors).map((err) => err.message);
                res.status(400).json({ message: 'Erro de validação', errors });
            }
            else {
                res.status(500).json({ message: 'Erro ao atualizar contrato' });
            }
        }
    }
    async deleteContract(req, res) {
        try {
            const userId = req.userId;
            const contractId = req.params.id;
            if (!userId) {
                res.status(401).json({ message: 'Não autorizado' });
                return;
            }
            const deletedContract = await Contract_1.default.findOneAndDelete({ _id: contractId, importUserId: userId });
            if (!deletedContract) {
                res.status(404).json({ message: 'Contrato não encontrado ou não pertence ao usuário' });
                return;
            }
            res.status(204).send(); // No content
        }
        catch (error) {
            console.error('Erro ao excluir contrato:', error);
            res.status(500).json({ message: 'Erro ao excluir contrato' });
        }
    }
    async importContractsFromSpreadsheet(req, res) {
        try {
            // const userId = req.userId;
            // if (!userId) {
            //     res.status(401).json({ message: 'Não autorizado' });
            //     return;
            // }
            const contractsData = req.body;
            if (!Array.isArray(contractsData)) {
                res.status(400).json({ message: 'O corpo da requisição deve ser um array de contratos.' });
                return;
            }
            const importedContracts = [];
            const errors = [];
            for (const contractData of contractsData) {
                // Validação básica dos campos obrigatórios
                if (!contractData.NUMERO_CONTRATO || !contractData.NOME_CLIENTE || !contractData.NOME_VENDEDOR || !contractData.CPF_CLIENTE || !contractData.CPF_VENDEDOR || !contractData.DATA_NASCIMENTO_CLIENTE) {
                    errors.push({ message: 'Campos obrigatórios ausentes em um dos contratos.', data: contractData });
                    continue;
                }
                try {
                    const newContract = new Contract_1.default({
                        registerCode: contractData.registerCode,
                        clientName: contractData.clientName,
                        sellerName: contractData.sellerName,
                        clientCPF: contractData.clientCPF,
                        sellerCPF: contractData.sellerCPF,
                        clientBirthday: contractData.clientBirthday,
                        importUserId: contractData.userId,
                        situation: 'Pendente',
                    });
                    const savedContract = await newContract.save();
                    importedContracts.push(savedContract);
                }
                catch (saveError) {
                    console.error('Erro ao salvar contrato individual:', saveError);
                    errors.push({ message: 'Erro ao salvar contrato no banco de dados.', data: contractData, error: saveError.message });
                }
            }
            if (errors.length > 0 && importedContracts.length > 0) {
                res.status(207).json({ message: `${importedContracts.length} contratos importados com sucesso, mas ${errors.length} apresentaram erros.`, successfulImports: importedContracts, errors: errors });
            }
            else if (errors.length > 0) {
                res.status(400).json({ message: `Nenhum contrato foi importado devido a ${errors.length} erros.`, errors: errors });
            }
            else {
                res.status(200).json({ message: `${importedContracts.length} contratos importados com sucesso.`, contracts: importedContracts });
            }
        }
        catch (error) {
            console.error('Erro ao processar importação de contratos:', error);
            res.status(500).json({ message: 'Erro ao processar a importação de contratos.', error: error.message });
        }
    }
}
exports.default = new ContractController();
