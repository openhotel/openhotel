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
};
