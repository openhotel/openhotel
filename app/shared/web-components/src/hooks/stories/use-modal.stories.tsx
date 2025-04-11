import { ModalProvider, useModal } from "../use-modal";
import type { Meta, StoryObj } from "@storybook/react";
import {
  ButtonComponent,
  ConfirmationModalComponent,
  CrossIconComponent,
  ModalComponent,
} from "../../components";
import { useCallback } from "react";

export default {
  title: "Components/Layout/Modal/Hook",
  component: ModalProvider,
} as Meta;

const ContentA = () => {
  const { open, close } = useModal();

  const onOpenModal = useCallback(() => {
    open({
      children: (
        <ModalComponent>
          <div style={{ padding: "1rem 2rem" }}>
            <div>
              <CrossIconComponent onClick={close} />
            </div>
            test modal
          </div>
        </ModalComponent>
      ),
      style: {
        width: "30rem",
        height: "20rem",
      },
    });
  }, [open, close]);

  return (
    <div style={{ padding: "1rem 2rem" }}>
      <ButtonComponent onClick={onOpenModal}>Open modal</ButtonComponent>
    </div>
  );
};

export const Primary: StoryObj = {
  render: (args) => {
    return (
      <ModalProvider>
        <ContentA />
      </ModalProvider>
    );
  },
};

const ContentB = () => {
  const { open, close } = useModal();

  const onOpenModal = useCallback(() => {
    open({
      children: (
        <ConfirmationModalComponent
          title={"Confirm this"}
          description={
            "Are you sure you want to delete the account `pagoru`?\n This action is not reversible and can cause a catastrophic error on the system. Are you really-really sure to delete the user??"
          }
          onConfirm={() => console.log("OK!")}
          confirmText="Yeah!"
          cancelText="Nah..."
          onClose={close}
        />
      ),
    });
  }, [open, close]);

  return (
    <div style={{ padding: "1rem 2rem" }}>
      <ButtonComponent onClick={onOpenModal}>Open modal</ButtonComponent>
    </div>
  );
};

export const Confirmation: StoryObj = {
  render: (args) => {
    return (
      <ModalProvider>
        <ContentB />
      </ModalProvider>
    );
  },
};
