import mongoose, { Schema, Document } from 'mongoose';

export interface UserDocument extends Document {
  id?: string;
  name: string;
  email: string;
  cpf: string;
  birthday: Date;
  passwordHash: string;
  createdAt?: Date;
  updatedAt?: Date;
  status: 'Ativo' | 'Inativo';
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  cpf: { type: String, required: true, unique: true },
  birthday: { type: Date, required: true },
  passwordHash: { type: String, required: true },
  status: { type: String, enum: ['Ativo', 'Inativo'], default: 'Ativo' },
}, {
  timestamps: true,
});

UserSchema.pre('save', function (this: UserDocument, next) {
  if (this.cpf) {
    this.cpf = this.cpf.replace(/\D/g, '');
  }
  next();
});

const User = mongoose.model<UserDocument>('User', UserSchema);

export default User;