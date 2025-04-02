import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './DashboardPage.module.css';
import { api } from '../services/api';
import NewContractModal from './NewContractModal';
import ImportSpreadsheetModal from './ImportSpreadsheetModal';
import EditContractModal from './EditContractModal';
import { ContractDocument } from '../../../src/models/Contract';

interface DashboardPageProps { }

const DashboardPage: React.FC<DashboardPageProps> = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [contracts, setContracts] = useState<ContractDocument[]>([]);
  const [isNewContractModalOpen, setIsNewContractModalOpen] = useState(false);
  const [isImportSpreadsheetModalOpen, setIsImportSpreadsheetModalOpen] = useState(false);
  const [isEditContractModalOpen, setIsEditContractModalOpen] = useState(false);
  const [contractToEdit, setContractToEdit] = useState<ContractDocument | null>(null);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const openNewContractModal = () => {
    setIsNewContractModalOpen(true);
  };

  const closeNewContractModal = () => {
    setIsNewContractModalOpen(false);
  };

  const openImportSpreadsheetModal = () => {
    setIsImportSpreadsheetModalOpen(true);
  };

  const closeImportSpreadsheetModal = () => {
    setIsImportSpreadsheetModalOpen(false);
  };

  const openEditContractModal = (contract: ContractDocument) => {
    setContractToEdit(contract);
    setIsEditContractModalOpen(true);
  };

  const closeEditContractModal = () => {
    setContractToEdit(null);
    setIsEditContractModalOpen(false);
  };

  const fetchContracts = async () => {
    try {
      const response = await api.get<ContractDocument[]>('/contracts');
      console.log('Dados da API de contratos:', response.data);
      response.data.forEach(contract => console.log('Tipo de _id:', typeof contract._id));
      setContracts(response.data);
    } catch (error: any) {
      console.error('Erro ao buscar contratos:', error.response?.data?.message || error.message);
      if (error.response?.status === 401) {
        handleLogout();
      }
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/users/me');
        setUserName(response.data.name);
        setUserId(response.data.id);
      } catch (error: any) {
        console.error('Erro ao buscar nome do usuário:', error.response?.data?.message || error.message);
        if (error.response?.status === 401) {
          handleLogout();
        }
      }
    };

    fetchUserData();
    fetchContracts();
  }, []);

  const handleDeleteContract = async (contractId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este contrato?')) {
      try {
        await api.delete(`/contracts/${contractId}`);
        fetchContracts();
      } catch (error: any) {
        console.error('Erro ao excluir contrato:', error);
        alert(error.response?.data?.message || 'Erro ao excluir o contrato.');
      }
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.header}>
        <div className={styles.userInfo}>
          <span>Bem-vindo(a), {userName}</span>
        </div>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Sair
        </button>
      </header>
      <div className={styles.content}>
        <h2>Lista de Contratos</h2>
        <button onClick={openNewContractModal} className={styles.newContractButton}>
          Novo Contrato
        </button>
        <button onClick={openImportSpreadsheetModal} className={styles.importSpreadsheetButton}>
          Importar Planilha
        </button>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Código de Registro</th>
              <th>Nome do Vendedor</th>
              <th>CPF do Vendedor</th>
              <th>Nome do Cliente</th>
              <th>CPF do Cliente</th>
              <th>Data de Nascimento</th>
              <th>Situação</th>
              <th>Criado em</th>
              <th>Atualizado em</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {contracts.map((contract) => (
              <tr key={`${contract._id}`}>
                <td>{`${contract._id}`}</td>
                <td>{contract.registerCode}</td>
                <td>{contract.sellerName}</td>
                <td>{contract.sellerCPF}</td>
                <td>{contract.clientName}</td>
                <td>{contract.clientCPF}</td>
                <td>{contract.clientBirthday ? new Date(contract.clientBirthday).toLocaleDateString() : '-'}</td>
                <td>{contract.situation}</td>
                <td>{contract.createdAt ? new Date(contract.createdAt).toLocaleDateString() : '-'}</td>
                <td>{contract.updatedAt ? new Date(contract.updatedAt).toLocaleDateString() : '-'}</td>
                <td>
                  <button className={styles.actionButton} onClick={() => openEditContractModal(contract)}>Alterar</button>
                  <button className={styles.actionButton} onClick={() => handleDeleteContract(`${contract._id}`)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {isNewContractModalOpen && (
          <NewContractModal
            onClose={closeNewContractModal}
            onContractSaved={fetchContracts}
          />
        )}
        {isImportSpreadsheetModalOpen && (
          <ImportSpreadsheetModal
            onClose={closeImportSpreadsheetModal}
            onContractsImported={fetchContracts}
            userId={userId}
          />
        )}
        {isEditContractModalOpen && contractToEdit && (
          <EditContractModal
            contract={contractToEdit}
            onClose={closeEditContractModal}
            onContractUpdated={fetchContracts}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardPage;