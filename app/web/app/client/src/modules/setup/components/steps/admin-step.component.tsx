import React from "react";
import { SetupStepProps, AdminStepForm } from "shared/types/setup.types.ts";
import { ButtonComponent } from "shared/components/forms/button.component.tsx";
import { useAppForm } from "shared/hooks/use-app-form.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import { ADMIN_SETUP_SCHEMA } from "shared/consts/setup.consts.ts";
import { useTranslation } from "react-i18next";
import { InputComponent } from "shared/components/forms/input.component.tsx";
import { SETUP_DEBUG } from "shared/consts/development.consts.ts";

export const AdminStepComponent: React.FC<SetupStepProps<AdminStepForm>> = ({
  onSubmit,
  defaultValues,
  onBack,
}) => {
  const { t } = useTranslation();

  const { field, handleSubmit } = useAppForm<AdminStepForm>({
    resolver: SETUP_DEBUG ? undefined : zodResolver(ADMIN_SETUP_SCHEMA),
    mode: "all",
    defaultValues: { username: "admin", ...defaultValues },
  });

  return (
    <form
      className="p-card flex gap-6 flex-col"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex gap-3 flex-col">
        <label className="title">{t("setup.steps.admin.title")}</label>
        <InputComponent
          title={t("setup.steps.admin.username.title")}
          type="username"
          className="max-w-100"
          {...field("username")}
        />
        <InputComponent
          title={t("setup.steps.admin.email.title")}
          type="email"
          className="max-w-100"
          {...field("email")}
        />
        <InputComponent
          title={t("setup.steps.admin.password.title")}
          type="password"
          className="max-w-100"
          {...field("password")}
        />
        <InputComponent
          title={t("setup.steps.admin.repeat_password.title")}
          type="password"
          className="max-w-100"
          {...field("repeat_password")}
        />
      </div>
      <div className="mt-auto flex gap-3 justify-end">
        <ButtonComponent type="button" onClick={onBack}>
          {t("setup.navigation.back")}
        </ButtonComponent>
        <ButtonComponent accent>{t("setup.navigation.next")}</ButtonComponent>
      </div>
    </form>
  );
};
