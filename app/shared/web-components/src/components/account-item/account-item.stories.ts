import { fn } from "@storybook/test";
import { AccountItemComponent } from "./account-item.component";

export default {
  title: "Components/Header/Account Item",
  component: AccountItemComponent,
  parameters: {
    layout: "centered",
  },
  args: { onClick: fn() },
};

export const Primary = {
  args: {
    username: "pagoru",
    email: "pagoru@openhotel.club",
  },
};
