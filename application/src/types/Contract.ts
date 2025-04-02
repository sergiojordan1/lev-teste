export interface Contract {
    _id: string | undefined;
    registerCode: string;
    sellerName: string;
    sellerCPF: string;
    clientName: string;
    clientCPF: string;
    clientBirthday: string | undefined;
    situation: 'Pendente' | 'Concluido' | 'Cancelado' | 'Recusado';
    importUserId: string | undefined;
    createdAt: string | undefined;
    updatedAt: string | undefined;
  }