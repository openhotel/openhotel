import { RequestMethod } from "@oh/utils";
import { ProxyRequestType } from "shared/types/api.types.ts";
import { System } from "modules/system/main.ts";
import { Contract } from "shared/types/company.types.ts";

export const contractRequest: ProxyRequestType = {
  pathname: "/contract",
  method: RequestMethod.GET,
  func: async ({ user }) => {
    const contracts = await user.getContracts();

    return {
      status: 200,
      data: {
        contracts,
      },
    };
  },
};

export const contractPutRequest: ProxyRequestType = {
  pathname: "/contract",
  method: RequestMethod.PUT,
  func: async ({ data, user }) => {
    const { companyId, accountId, permissions, salary } = data;
    if (!companyId || !accountId || !permissions || !salary) {
      return {
        status: 400,
        error: "companyId, accountId, permissions, and salary are required",
      };
    }

    if (isNaN(Number(permissions)) || isNaN(Number(salary))) {
      return {
        status: 400,
        error: "permissions and salary must be valid numbers",
      };
    }

    const company = await System.game.companies.get(companyId);
    if (!company || company.getOwnerId() !== user.getAccountId()) {
      return {
        status: 404,
        error: "Company not found or you are not the owner",
      };
    }

    const contract: Contract = {
      accountId,
      companyId,
      permissions: Number(permissions),
      startDate: Date.now(),
      status: "pending",
      salary: Number(salary),
    };

    await company.addContract(contract);

    return {
      status: 201,
      data: {},
    };
  },
};

export const contractRespondPostRequest: ProxyRequestType = {
  pathname: "/contract/respond",
  method: RequestMethod.POST,
  func: async ({ data, user }) => {
    const { companyId, action } = data;
    if (!companyId) {
      return {
        status: 400,
        error: "companyId is required",
      };
    }

    const company = await System.game.companies.get(companyId);
    if (!company) {
      return {
        status: 404,
        error: "Company not found",
      };
    }

    const contract = await System.db.get([
      "contracts",
      company.getId(),
      user.getAccountId(),
    ]);

    if (!contract || contract.status !== "pending") {
      return {
        status: 404,
        error: "Contract not found or not pending",
      };
    }

    await company.editContract(user.getAccountId(), {
      status: action === "accept" ? "active" : "rejected",
    });

    return {
      status: 200,
      data: {},
    };
  },
};

export const contractDeleteRequest: ProxyRequestType = {
  pathname: "/contract",
  method: RequestMethod.DELETE,
  func: async ({ user }, url) => {
    const companyId = url.searchParams.get("companyId");
    if (!companyId) {
      return {
        status: 400,
        error: "companyId is required",
      };
    }

    const company = await System.game.companies.get(companyId);
    if (!company) {
      return {
        status: 404,
        error: "Company not found",
      };
    }

    const userId = url.searchParams.get("userId");
    const userIdToRemove =
      userId && company.getOwnerId() === user.getAccountId()
        ? userId
        : user.getAccountId();

    await company.removeContract(userIdToRemove);

    return {
      status: 200,
    };
  },
};
