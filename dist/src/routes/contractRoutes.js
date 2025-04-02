"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const ContractController_1 = __importDefault(require("../controllers/ContractController"));
const router = express_1.default.Router();
router.get('/', authMiddleware_1.default, ContractController_1.default.getAllContracts);
router.post('/', authMiddleware_1.default, ContractController_1.default.createContract);
router.get('/:id', authMiddleware_1.default, ContractController_1.default.getContractById);
router.put('/:id', authMiddleware_1.default, ContractController_1.default.updateContract);
router.delete('/:id', authMiddleware_1.default, ContractController_1.default.deleteContract);
router.post('/import', authMiddleware_1.default, ContractController_1.default.importContractsFromSpreadsheet);
exports.default = router;
