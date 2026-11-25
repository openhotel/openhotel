import React, { useMemo } from "react";
import {
  SetupStepProps,
  ManagedAdminStepForm,
} from "shared/types/setup.types.ts";
import { ButtonComponent } from "shared/components/forms/button.component.tsx";
import { useAppForm } from "shared/hooks/use-app-form.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import { MANAGED_ADMIN_SETUP_SCHEMA } from "shared/consts/setup.consts.ts";
import { useTranslation } from "react-i18next";
import { SETUP_DEBUG } from "shared/consts/development.consts.ts";

export const ManagedAdminStepComponent: React.FC<
  SetupStepProps<ManagedAdminStepForm>
> = ({ onSubmit, defaultValues, setupData, onBack }) => {
  const { t } = useTranslation();

  const { field, handleSubmit } = useAppForm<ManagedAdminStepForm>({
    resolver: SETUP_DEBUG ? undefined : zodResolver(MANAGED_ADMIN_SETUP_SCHEMA),
    mode: "all",
    defaultValues,
  });

  return (
    <form
      className="p-card flex gap-6 flex-col"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex gap-3 flex-col">
        <label className="title">{t("setup.steps.managed_admin.title")}</label>
        <label>{t("setup.steps.managed_admin.description")}</label>
        <div className="flex flex-col divide-y divide-dotted divide-(--line) max-w-100">
          <div className="flex justify-between">
            <label>{t("setup.steps.managed_admin.account_id")}</label>
            <label className="font-bold">01M87KEN1PGC42F4JFYN5AQK1V</label>
          </div>
          <div className="flex justify-between">
            <label>{t("setup.steps.managed_admin.signed_as")}</label>
            <label className="font-bold">example@example.com</label>
          </div>
          <div className="flex justify-between">
            <label>{t("setup.steps.managed_admin.role")}</label>
            <label className="font-bold">
              {t("setup.steps.managed_admin.hotel_admin")}
            </label>
          </div>
        </div>
        <div className="flex gap-3">
          <ButtonComponent type="button" accent className="max-w-100">
            {t("setup.steps.managed_admin.log_in")}
          </ButtonComponent>
          <ButtonComponent type="button" className="max-w-100">
            {t("setup.steps.managed_admin.logout")}
          </ButtonComponent>
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
