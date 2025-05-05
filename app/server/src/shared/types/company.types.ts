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

  addContract: (contract: Contract) => Promise<void>;
  editContract: (userId: string, updates: Partial<Contract>) => Promise<void>;
  removeContract: (userId: string) => Promise<void>;
};

export type Contract = {
  userId: string;
  companyId: string;
  permissions: number;
  startDate: number;
  endDate?: number;
  status: "active" | "terminated" | "pending";
  salary: number;
};
