import React, { useState, useEffect } from 'react';
import { ContractDocument } from '../../../src/models/Contract';
import { api } from '../services/api';
import styles from './NewContractModal.module.css';

interface EditContractModalProps {
  contract: ContractDocument | null;
  onClose: () => void;
  onContractUpdated: () => void;
}

const EditContractModal: React.FC<EditContractModalProps> = ({ contract, onClose, onContractUpdated }) => {
  const [registerCode, setRegisterCode] = useState('');
  const [sellerName, setSellerName] = useState('');
  const [sellerCPF, setSellerCPF] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientCPF, setClientCPF] = useState('');
  const [clientBirthday, setClientBirthday] = useState('');
  const [situation, setSituation] = useState<'Pendente' | 'Concluido' | 'Cancelado' | 'Recusado'>('Pendente');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (contract) {
      setRegisterCode(contract.registerCode);
      setSellerName(contract.sellerName);
      setSellerCPF(contract.sellerCPF);
      setClientName(contract.clientName);
      setClientCPF(contract.clientCPF);
      setClientBirthday(new Date(contract.clientBirthday).toISOString().split('T')[0]);
      setSituation(contract.situation);
    }
  }, [contract]);

  const handleSave = async () => {
    if (!contract) return;

    try {
      setSuccessMessage('');
      setError('');
      const response = await api.put(`/contracts/${contract._id}`, {
        registerCode,
        sellerName,
        sellerCPF,
        clientName,
        clientCPF,
        clientBirthday,
        situation,
      });
      console.log('Contrato atualizado com sucesso:', response.data);
      setSuccessMessage('Contrato atualizado com sucesso!');
      onContractUpdated();
      onClose();
    } catch (error: any) {
      console.error('Erro ao atualizar contrato:', error);
      setError(error.response?.data?.message || 'Erro ao atualizar o contrato.');
    }
  };

  const handleCancel = () => {
    onClose();
  };

  if (!contract) {
    return null;
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>Editar Contrato</h3>
        {error && <p className={styles.error}>{error}</p>}
        {successMessage && <p className={styles.success}>{successMessage}</p>}
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className={styles.form}>
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
            <button type="submit">Salvar</button>
            <button type="button" onClick={handleCancel}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditContractModal;