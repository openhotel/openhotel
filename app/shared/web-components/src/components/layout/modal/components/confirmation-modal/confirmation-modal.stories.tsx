import { ConfirmationModalComponent } from "./confirmation-modal.component";

export default {
  title: "Components/Layout/Modal/Confirmation",
  component: ConfirmationModalComponent,
};

export const Primary = {
  args: {
    title: "Confirm this",
    description:
      "Are you sure you want to delete the account `pagoru`?\n This action is not reversible and can cause a catastrophic error on the system. Are you really-really sure to delete the user??",
  },
};
