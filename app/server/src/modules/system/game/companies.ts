import { System } from "modules/system/main.ts";
import { INITIAL_COMPANY_BALANCE } from "shared/consts/economy.consts.ts";
import {
  Company,
  CompanyMutable,
  Contract,
} from "shared/types/company.types.ts";
import { ulid } from "@std/ulid";
import { log } from "shared/utils/log.utils.ts";

export const companies = () => {
  const $getCompany = (company: Company): CompanyMutable => {
    if (!company) return null;
    let $company: Company = { ...company };

    const getId = () => $company.id;
    const getName = () => $company.name;
    const getOwnerId = () => $company.ownerId;
    const getRooms = () => $company.rooms;

    const getCredits = async (): Promise<number> => {
      return System.db.get(["companies", $company.id, "balance"]);
    };

    const addRoom = async (roomId: string) => {
      if (!roomId) return;
      if ($company.rooms.includes(roomId)) return;
      $company.rooms.push(roomId);

      await $save();
    };
    const removeRoom = async (roomId: string) => {
      if (!roomId) return;
      if (!$company.rooms.includes(roomId)) return;
      $company.rooms = $company.rooms.filter((id) => id !== roomId);

      await $save();
    };

    const getContracts = async (): Promise<Contract[]> => {
      const { items } = await System.db.list({
        prefix: ["contracts", $company.id],
      });

      return items.map((item) => item.value);
    };

    const addContract = async (contract: Contract) => {
      const contractKey = ["contracts", $company.id, contract.accountId];
      const contractsByUserKey = ["contractsByUser", contract.accountId];

      const existing = await System.db.get(contractKey);
      if (existing) {
        return;
      }

      if (contract.accountId === $company.ownerId) {
        return;
      }

      const contractsByUser = await System.db.get(contractsByUserKey);
      const prev = contractsByUser ?? [];
      await System.db.set(contractsByUserKey, [...prev, contract.companyId]);

      await System.db.set(contractKey, contract);
    };
    const editContract = async (
      accountId: string,
      updates: Partial<Contract>,
    ) => {
      const key = ["contracts", $company.id, accountId];
      const curr = await System.db.get(key);
      if (!curr) return;

      const updated: Contract = {
        ...curr,
        ...updates,
        companyId: $company.id,
        accountId,
      };
      await System.db.set(key, updated);
    };
    const removeContract = async (accountId: string) => {
      const contractKey = ["contracts", $company.id, accountId];
      const contractsByUserKey = ["contractsByUser", accountId];

      const contractsByUser = await System.db.get(contractsByUserKey);
      if (contractsByUser) {
        const newContractsByUser = contractsByUser.filter(
          (id: string) => id !== $company.id,
        );
        await System.db.set(contractsByUserKey, newContractsByUser);
      }

      await System.db.delete(contractKey);
    };

    const $save = async () =>
      await System.db.set(["companies", $company.id], $company);

    return {
      getId,
      getName,
      getOwnerId,
      getRooms,

      getCredits,

      addRoom,
      removeRoom,

      getContracts,
      addContract,
      editContract,
      removeContract,
    };
  };

  const get = async (companyId: string): Promise<CompanyMutable | null> => {
    try {
      const companyData = await System.db.get(["companies", companyId]);
      if (!companyData) return null;
      return $getCompany(companyData);
    } catch (e) {
      return null;
    }
  };

  const create = async ({
    name,
    ownerId,
  }: {
    name: string;
    ownerId: string;
  }): Promise<Company> => {
    const $company: Company = {
      id: ulid(),
      name,
      ownerId,
      rooms: [],
      createdAt: Date.now(),
    };

    await System.db.set(["companies", $company.id], $company);
    await System.db.set(
      ["companies", $company.id, "balance"],
      INITIAL_COMPANY_BALANCE,
    );

    const companiesByUser = await System.db.get(["companiesByUser", ownerId]);
    const prev = companiesByUser ?? [];
    await System.db.set(["companiesByUser", ownerId], [...prev, $company.id]);

    return $company;
  };

  const remove = async (companyId: string) => {
    const $company = await get(companyId);
    if (!$company) return;

    const rooms = $company.getRooms();
    for (const roomId of rooms) {
      const room = await System.game.rooms.get(roomId);
      if (room) {
        // TODO: delete rooms
        // await room.remove();
      }
    }

    // Delete contracts
    const contracts = await $company.getContracts();
    await Promise.all(
      contracts.map((contract) => $company.removeContract(contract.accountId)),
    );

    await System.db.delete(["companies", companyId]);
    await System.db.delete(["companies", companyId, "balance"]);

    const companyOwnerId = $company.getOwnerId();
    const companiesByUser = await System.db.get([
      "companiesByUser",
      companyOwnerId,
    ]);
    if (companiesByUser) {
      const newCompaniesByUser = companiesByUser.filter(
        (id: string) => id !== companyId,
      );
      await System.db.set(
        ["companiesByUser", companyOwnerId],
        newCompaniesByUser,
      );
    }

    log(`Company [${companyId}] ${$company.getName()} removed`);
  };

  return {
    get,
    create,
    remove,
  };
};
