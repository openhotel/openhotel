import React, { useCallback } from "react";
import {
  ButtonComponent,
  ConfirmationModalComponent,
  useModal,
} from "@openhotel/components";
import { useAccount } from "shared/hooks";
import { useNavigate } from "react-router-dom";

export const DeleteComponent: React.FC = () => {
  const { open, close } = useModal();
  const { __deleteAccount } = useAccount();
  const navigate = useNavigate();

  const $onDeleteAccount = useCallback(() => {
    __deleteAccount().then(() => navigate("/login"));
  }, [__deleteAccount, navigate]);

  return (
    <div>
      <h1>Delete account</h1>
      <p>Are you sure you want to delete your account?</p>
      <p>- Your username would be free to use to anyone!</p>
      <p>- All your hotels would be deleted!</p>
      <p>
        If you continue, it will not be reversible and all data will be deleted
        forever.
      </p>
      <ButtonComponent
        color="grey"
        onClick={() =>
          open({
            children: (
              <ConfirmationModalComponent
                onClose={close}
                description="Are you really sure to delete it? Remember, this action cannot be reversed!"
                onConfirm={$onDeleteAccount}
              />
            ),
          })
        }
      >
        I'm sure!
      </ButtonComponent>
    </div>
  );
};
