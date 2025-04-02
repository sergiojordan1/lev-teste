import mongoose, { Schema, Document } from 'mongoose';
import { isValidCPF } from '../utils/cpfValidator';
import { isOver18 } from '../utils/dateValidator';

export interface ContractDocument extends Document {
  registerCode: string;
  sellerName: string;
  sellerCPF: string;
  clientName: string;
  clientCPF: string;
  clientBirthday: Date;
  situation: 'Pendente' | 'Concluido' | 'Cancelado' | 'Recusado';
  importUserId: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const ContractSchema: Schema = new Schema({
  registerCode: { type: String, required: true, unique: true, trim: true },
  sellerName: { type: String, required: true, trim: true },
  sellerCPF: {
    type: String,
    required: true,
    trim: true,
  },
  clientName: { type: String, required: true, trim: true },
  clientCPF: {
    type: String,
    required: true,
    trim: true,
  },
  clientBirthday: {
    type: Date,
    required: true,
    validate: [isOver18, 'Cliente deve ter mais de 18 anos'],
  },
  situation: {
    type: String,
    enum: ['Pendente', 'Concluido', 'Cancelado', 'Recusado'],
    default: 'Pendente',
  },
  importUserId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

ContractSchema.pre('save', function (this: ContractDocument, next) {
  if (this.sellerCPF) {
    this.sellerCPF = this.sellerCPF.replace(/\D/g, '');
  }
  if (this.clientCPF) {
    this.clientCPF = this.clientCPF.replace(/\D/g, '');
  }
  next();
});

const Contract = mongoose.model<ContractDocument>('Contract', ContractSchema);

export default Contract;