import React from "react";
import { SetupStepProps, EmailStepForm } from "shared/types/setup.types.ts";
import { ButtonComponent } from "shared/components/forms/button.component.tsx";
import { useAppForm } from "shared/hooks/use-app-form.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import { EMAIL_SETUP_SCHEMA } from "shared/consts/setup.consts.ts";
import { useTranslation } from "react-i18next";
import { InputComponent } from "shared/components/forms/input.component.tsx";
import { SETUP_DEBUG } from "shared/consts/development.consts.ts";
import { SelectComponent } from "shared/components/forms/select.component.tsx";

export const EmailStepComponent: React.FC<SetupStepProps<EmailStepForm>> = ({
  onSubmit,
  defaultValues,
  onBack,
}) => {
  const { t } = useTranslation();

  const { field, handleSubmit } = useAppForm<EmailStepForm>({
    resolver: SETUP_DEBUG ? undefined : zodResolver(EMAIL_SETUP_SCHEMA),
    mode: "all",
    defaultValues: { server: "smtp.example.com", port: 587, ...defaultValues },
  });

  return (
    <form
      className="p-card flex gap-6 flex-col"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex gap-3 flex-col">
        <label className="title">{t("setup.steps.email.title")}</label>
        <InputComponent
          title={t("setup.steps.email.server.title")}
          className="max-w-100"
          {...field("server")}
        />
        <div className="flex gap-3">
          <InputComponent
            title={t("setup.steps.email.port.title")}
            className="max-w-100 w-1/2"
            {...field("port")}
          />
          <SelectComponent
            title={t("setup.steps.email.port.title")}
            className="max-w-100 w-1/2"
            {...field("port")}
          >
            <option>STARTTLS</option>
          </SelectComponent>
        </div>
        <InputComponent
          title={t("setup.steps.email.user.title")}
          className="max-w-100"
          {...field("user")}
        />
        <InputComponent
          title={t("setup.steps.email.password.title")}
          className="max-w-100"
          {...field("password")}
        />
        <InputComponent
          title={t("setup.steps.email.from.title")}
          className="max-w-100"
          {...field("from")}
        />
        <div className="flex gap-3 items-center">
          <ButtonComponent type="button">
            {t("setup.steps.email.send_test_email")}
          </ButtonComponent>
          <label className="text-(--muted)">
            {t("setup.steps.email.hint_test_email")}
          </label>
        </div>
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
