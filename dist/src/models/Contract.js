"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const dateValidator_1 = require("../utils/dateValidator");
const ContractSchema = new mongoose_1.Schema({
    registerCode: { type: String, required: true, unique: true, trim: true },
    sellerName: { type: String, required: true, trim: true },
    sellerCPF: {
        type: String,
        required: true,
        trim: true,
        // validate: {
        //     validator: isValidCPF,
        //     message: 'CPF do vendedor inválido',
        // },
    },
    clientName: { type: String, required: true, trim: true },
    clientCPF: {
        type: String,
        required: true,
        trim: true,
        // validate: {
        //     validator: isValidCPF,
        //     message: 'CPF do cliente inválido',
        // },
    },
    clientBirthday: {
        type: Date,
        required: true,
        validate: [dateValidator_1.isOver18, 'Cliente deve ter mais de 18 anos'],
    },
    situation: {
        type: String,
        enum: ['Pendente', 'Concluido', 'Cancelado', 'Recusado'],
        default: 'Pendente',
    },
    importUserId: { type: mongoose_1.default.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });
// Middleware para remover caracteres não numéricos do CPF antes de salvar
ContractSchema.pre('save', function (next) {
    if (this.sellerCPF) {
        this.sellerCPF = this.sellerCPF.replace(/\D/g, '');
    }
    if (this.clientCPF) {
        this.clientCPF = this.clientCPF.replace(/\D/g, '');
    }
    next();
});
const Contract = mongoose_1.default.model('Contract', ContractSchema);
exports.default = Contract;
