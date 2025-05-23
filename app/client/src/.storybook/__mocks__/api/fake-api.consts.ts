import { Catalog, CatalogCategoryData } from "../../../shared/types";
import { ulid } from "ulidx";
import { FurnitureType } from "../../../shared/enums";
import { FAKE_ACCOUNT_ID_1 } from "../account";

type Call = {
  pathname: string;
  method: string;
  response: (props: {
    pathname: string;
    searchParams: URLSearchParams;
    data: any;
  }) => unknown;
};

// Catalog
const CATEGORY_1_ID = ulid();
const CATEGORY_2_ID = ulid();

// Navigator
const PRIVATE_ROOM_1_ID = ulid();
const PRIVATE_ROOM_2_ID = ulid();
const PRIVATE_ROOM_3_ID = ulid();
const PRIVATE_ROOM_4_ID = ulid();

export const FAKE_API_CALLS_DATA: Call[] = [
  {
    pathname: "/catalog",
    method: "GET",
    response: ({ data, searchParams }): Catalog | CatalogCategoryData => {
      const categoryId = searchParams.get("category");
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
  {
    pathname: "/room/list",
    method: "GET",
    response: ({ data: { ownerId } }) => {
      if (ownerId === FAKE_ACCOUNT_ID_1) {
        return {
          rooms: [
            {
              id: PRIVATE_ROOM_1_ID,
              title: "Room 1",
              description: "Room 1 description",
              ownerUsername: "storybook",
              userCount: 0,
              maxUsers: 10,
              favorite: true,
              layoutIndex: 0,
            },
            {
              id: PRIVATE_ROOM_3_ID,
              title: "Room 3",
              description: "Room 3 description",
              ownerUsername: "storybook",
              userCount: 7,
              maxUsers: 10,
              favorite: true,
              layoutIndex: 0,
            },
          ],
        };
      }

      return {
        rooms: [
          {
            id: PRIVATE_ROOM_1_ID,
            title: "Room 1",
            description: "Room 1 description",
            ownerUsername: "storybook",
            userCount: 0,
            maxUsers: 10,
            favorite: true,
            layoutIndex: 0,
          },
          {
            id: PRIVATE_ROOM_2_ID,
            title: "Room 2",
            description: "Room 2 description",
            ownerUsername: "storybook",
            userCount: 2,
            maxUsers: 10,
            favorite: true,
            layoutIndex: 0,
          },
          {
            id: PRIVATE_ROOM_3_ID,
            title: "Room 3",
            description: "Room 3 description",
            ownerUsername: "storybook",
            userCount: 7,
            maxUsers: 10,
            favorite: true,
            layoutIndex: 0,
          },
          {
            id: PRIVATE_ROOM_4_ID,
            title: "Room 4",
            description: "Room 4 description",
            ownerUsername: "test",
            userCount: 15,
            maxUsers: 15,
            favorite: true,
            layoutIndex: 0,
          },
        ],
      };
    },
  },
];
