import { RequestMethod } from "@oh/utils";
import { System } from "modules/system/main.ts";
import { ProxyRequestType } from "shared/types/api.types.ts";
import { TransactionType } from "shared/enums/economy.enum.ts";
import { isCatalogCategoryAvailable } from "shared/utils/catalog.utils.ts";
import {
  CatalogCategory,
  CatalogFurniture,
} from "shared/types/catalog.types.ts";
import { ulid } from "@std/ulid";

export const catalogBuyRequest: ProxyRequestType = {
  pathname: "/buy",
  method: RequestMethod.POST,
  func: async ({ user, data }) => {
    const { furnitureId } = data;

    const catalog = await System.game.furniture.getCatalog();
    const catalogData = catalog.categories.reduce<{
      category: CatalogCategory;
      furniture: CatalogFurniture;
    } | null>((found, category) => {
      if (found) return found;
      const furniture = category.furniture.find((f) => f.id === furnitureId);
      return furniture ? { category, furniture } : null;
    }, null);

    if (!catalogData)
      return {
        status: 404,
        error: "Furniture not found",
      };

    const { category, furniture } = catalogData;
    const isAvailable = isCatalogCategoryAvailable(category);
    if (!isAvailable) {
      return {
        status: 404,
        error: "Furniture not found",
      };
    }

    const id = ulid();

    const transaction = await System.game.economy.executeTransaction({
      type: TransactionType.PURCHASE,
      description: `Buy ${furniture.id}`, // TODO: add furniture name
      amount: furniture.price,
      fromAccount: user.getAccountId(),
      toAccount: "hotel",
      meta: {
        furnitureId,
        id,
      },
    });

    if (!transaction) {
      return {
        status: 500,
        data: {
          error: "Transaction failed",
        },
      };
    }

    if (!transaction.success) {
      return {
        status: 402,
        data: {
          error: transaction.error,
        },
      };
    }

    await user.addFurniture(furniture.id, id);

    return {
      status: 200,
      data: {
        transaction,
      },
    };
  },
};
