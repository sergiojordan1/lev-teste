import React, { useState } from 'react';
import styles from './NewContractModal.module.css';
import { api } from '../services/api';
import * as XLSX from 'xlsx';

interface ImportSpreadsheetModalProps {
  onClose: () => void;
  onContractsImported: () => void;
  userId: string | null;
}

interface ContractData {
  NUMERO_CONTRATO: string;
  NOME_CLIENTE: string;
  NOME_VENDEDOR: string;
  CPF_CLIENTE: string;
  CPF_VENDEDOR: string;
  DATA_NASCIMENTO_CLIENTE: string;
}

const ImportSpreadsheetModal: React.FC<ImportSpreadsheetModalProps> = ({ onClose, onContractsImported, userId }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  function excelDateToJSDate(serial: number | string): string {
    let serialNumber: number;
    if (typeof serial === 'string') {
      serialNumber = parseInt(serial, 10);
      if (isNaN(serialNumber)) {
        console.error('Erro ao converter data da planilha para número:', serial);
        return '';
      }
    } else {
      serialNumber = serial;
    }

    const utcDays = Math.floor(serialNumber - 25569);
    const utcValue = utcDays * 86400;
    const date = new Date(utcValue * 1000);
    return date.toISOString().slice(0, 10);
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) {
      setError('Por favor, selecione um arquivo.');
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async (e: ProgressEvent<FileReader>) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData: ContractData[] = XLSX.utils.sheet_to_json(worksheet);

        if (jsonData.length > 0) {
          const contractsToImport = jsonData.map(item => ({
            registerCode: item.NUMERO_CONTRATO,
            clientName: item.NOME_CLIENTE,
            sellerName: item.NOME_VENDEDOR,
            clientCPF: item.CPF_CLIENTE,
            sellerCPF: item.CPF_VENDEDOR,
            clientBirthday: new Date(excelDateToJSDate(item.DATA_NASCIMENTO_CLIENTE)),
            importUserId: userId,
            situation: 'Pendente',
          }));

          console.log('Contratos PARA IMPORTAR:', contractsToImport);

          const response = await api.post('/contracts/import', contractsToImport);
          console.log('Contratos importados com sucesso:', response.data);
          onContractsImported();
          onClose();
        } else {
          setError('A planilha está vazia ou não possui dados no formato esperado.');
        }
      };
      reader.onerror = (error) => {
        console.error('Erro ao ler o arquivo:', error);
        setError('Erro ao ler o arquivo.');
      };
      reader.readAsArrayBuffer(selectedFile);
    } catch (error: any) {
      console.error('Erro ao importar contratos:', error);
      setError(error.response?.data?.message || 'Erro ao importar os contratos.');
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>Importar Planilha de Contratos</h3>
        {error && <p className={styles.error}>{error}</p>}
        <div>
          <label htmlFor="spreadsheetFile">Selecione a planilha:</label>
          <input type="file" id="spreadsheetFile" accept=".xlsx, .csv" onChange={handleFileChange} />
        </div>
        <div className={styles.modalActions}>
          <button onClick={handleImport} disabled={!selectedFile}>Importar</button>
          <button type="button" onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default ImportSpreadsheetModal;