import express from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import ContractController from '../controllers/ContractController';

const router = express.Router();

router.get('/', authMiddleware, ContractController.getAllContracts);
router.post('/', authMiddleware, ContractController.createContract);
router.get('/:id', authMiddleware, ContractController.getContractById);
router.put('/:id', authMiddleware, ContractController.updateContract);
router.delete('/:id', authMiddleware, ContractController.deleteContract);
router.post('/import', authMiddleware, ContractController.importContractsFromSpreadsheet);

export default router;