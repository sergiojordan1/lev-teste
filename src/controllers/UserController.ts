import { Request, Response } from 'express';
import User from '../models/User';

interface AuthRequest extends Request {
  userId?: string;
}

class UserController {
  async getUserInfo(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId;

      if (!userId) {
        res.status(401).json({ message: 'Não autorizado' });
        return;
      }

      const user = await User.findById(userId);

      if (!user) {
        res.status(404).json({ message: 'Usuário não encontrado' });
        return;
      }

      res.json({ name: user.name, id: user._id });
    } catch (error) {
      console.error('Erro ao buscar informações do usuário:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }
}

export default new UserController();