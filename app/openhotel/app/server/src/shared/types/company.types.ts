export type Company = {
  id: string;
  name: string;
  ownerId: string;
  rooms: string[];
  createdAt: number;
};

export type CompanyMutable = {
  getId: () => string;
  getName: () => string;
  getOwnerId: () => string;
  getRooms: () => string[];

  getCredits: () => Promise<number>;

  addRoom: (roomId: string) => Promise<void>;
  removeRoom: (roomId: string) => Promise<void>;

  getContracts: () => Promise<Contract[]>;
  addContract: (contract: Contract) => Promise<void>;
  editContract: (
    accountId: string,
    updates: Partial<Contract>,
  ) => Promise<void>;
  removeContract: (accountId: string) => Promise<void>;
};

export type Contract = {
  accountId: string;
  companyId: string;
  permissions: number;
  startDate: number;
  endDate?: number;
  status: "active" | "terminated" | "pending" | "rejected";
  salary: number;
};
