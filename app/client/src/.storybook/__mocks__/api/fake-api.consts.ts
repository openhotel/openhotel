import { Catalog, CatalogCategoryData } from "../../../shared/types";
import { ulid } from "ulidx";
import { FurnitureType } from "../../../shared/enums";

type Call = {
  pathname: string;
  method: string;
  response: (props: {
    pathname: string;
    searchParams: URLSearchParams;
    data: unknown;
  }) => unknown;
};

const CATEGORY_1_ID = ulid();
const CATEGORY_2_ID = ulid();

export const FAKE_API_CALLS_DATA: Call[] = [
  {
    pathname: "/catalog",
    method: "GET",
    response: ({ data, searchParams }): Catalog | CatalogCategoryData => {
      const categoryId = searchParams.get("category");
      console.log(categoryId, searchParams);
      if (categoryId === CATEGORY_1_ID) {
        return {
          furniture: [
            {
              id: "toys@octopus-0",
              price: 10,
              type: FurnitureType.FURNITURE,
            },
            {
              id: "flags@pirate",
              price: 5,
              type: FurnitureType.FRAME,
            },
          ],
        } as CatalogCategoryData;
      }
      if (categoryId === CATEGORY_2_ID) {
        return {
          furniture: [
            {
              id: "teleports@telephone",
              price: 30,
              type: FurnitureType.FURNITURE,
            },
          ],
        } as CatalogCategoryData;
      }

      return {
        categories: [
          {
            id: CATEGORY_1_ID,
            description: "This is a category",
            label: "Random",
          },
          {
            id: CATEGORY_2_ID,
            description: "Another category",
            label: "Rares",
          },
        ],
      };
    },
  },
  {
    pathname: "/catalog/buy",
    method: "POST",
    response: ({}) => ({
      transaction: {
        success: true,
      },
    }),
  },
];
