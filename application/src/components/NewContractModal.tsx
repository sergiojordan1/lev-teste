import React, { useState } from 'react';
import styles from './NewContractModal.module.css';
import { api } from '../services/api';

interface NewContractModalProps {
  onClose: () => void;
  onContractSaved: () => void;
}

const NewContractModal: React.FC<NewContractModalProps> = ({ onClose, onContractSaved }) => {
  const [registerCode, setRegisterCode] = useState('');
  const [sellerName, setSellerName] = useState('');
  const [sellerCPF, setSellerCPF] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientCPF, setClientCPF] = useState('');
  const [clientBirthday, setClientBirthday] = useState('');
  const [situation, setSituation] = useState<'Pendente' | 'Concluido' | 'Cancelado' | 'Recusado'>('Pendente');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await api.post('/contracts', {
        registerCode,
        sellerName,
        sellerCPF,
        clientName,
        clientCPF,
        clientBirthday,
        situation,
      });
      console.log('Contrato salvo:', response.data);
      onContractSaved();
      onClose();
    } catch (error: any) {
      console.error('Erro ao salvar contrato:', error);
      setError(error.response?.data?.message || 'Erro ao salvar o contrato.');
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>Novo Contrato</h3>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="registerCode">Código de Registro:</label>
            <input type="text" id="registerCode" value={registerCode} onChange={(e) => setRegisterCode(e.target.value)} required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="sellerName">Nome do Vendedor:</label>
            <input type="text" id="sellerName" value={sellerName} onChange={(e) => setSellerName(e.target.value)} required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="sellerCPF">CPF do Vendedor:</label>
            <input type="text" id="sellerCPF" value={sellerCPF} onChange={(e) => setSellerCPF(e.target.value)} required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="clientName">Nome do Cliente:</label>
            <input type="text" id="clientName" value={clientName} onChange={(e) => setClientName(e.target.value)} required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="clientCPF">CPF do Cliente:</label>
            <input type="text" id="clientCPF" value={clientCPF} onChange={(e) => setClientCPF(e.target.value)} required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="clientBirthday">Data de Nascimento:</label>
            <input type="date" id="clientBirthday" value={clientBirthday} onChange={(e) => setClientBirthday(e.target.value)} required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="situation">Situação:</label>
            <select id="situation" value={situation} onChange={(e) => setSituation(e.target.value as 'Pendente' | 'Concluido' | 'Cancelado' | 'Recusado')}>
              <option value="Pendente">Pendente</option>
              <option value="Concluido">Concluido</option>
              <option value="Cancelado">Cancelado</option>
              <option value="Recusado">Recusado</option>
            </select>
          </div>
          <div className={styles.modalActions}>
            <button type="submit">Salvar Contrato</button>
            <button type="button" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewContractModal;