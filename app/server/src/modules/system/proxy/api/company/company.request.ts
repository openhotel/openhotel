import { RequestMethod } from "@oh/utils";
import { ProxyRequestType } from "shared/types/api.types.ts";
import { System } from "modules/system/main.ts";

export const companyRequest: ProxyRequestType = {
  pathname: "",
  method: RequestMethod.GET,
  func: async ({}, url) => {
    const companyId = url.searchParams.get("companyId");
    if (!companyId) {
      return {
        status: 400,
        error: "company id is required",
      };
    }

    const company = await System.game.companies.get(companyId);
    if (!company) {
      return {
        status: 404,
        error: "Company not found",
      };
    }

    return {
      status: 200,
      data: {
        company: {
          id: company.getId(),
          name: company.getName(),
          ownerId: company.getOwnerId(),
          rooms: company.getRooms(),
          credits: await company.getCredits(),
        },
      },
    };
  },
};

export const companyPutRequest: ProxyRequestType = {
  pathname: "",
  method: RequestMethod.PUT,
  func: async ({ data, user }) => {
    const { name } = data;
    if (!name) {
      return {
        status: 400,
        error: "name is required",
      };
    }

    const ownerId = user.getAccountId();
    const company = await System.game.companies.create({
      name,
      ownerId,
    });

    if (!company) {
      return {
        status: 500,
        error: "Company creation failed",
      };
    }

    return {
      status: 201,
      data: {
        company,
      },
    };
  },
};

export const companyDeleteRequest: ProxyRequestType = {
  pathname: "",
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

    const ownerId = user.getAccountId();
    if (company.getOwnerId() !== ownerId) {
      return {
        status: 403,
        error: "You are not the owner of this company",
      };
    }

    await System.game.companies.remove(companyId);

    return {
      status: 200,
    };
  },
};
