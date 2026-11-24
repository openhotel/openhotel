import React from "react";
import { SetupStepProps, HotelStepForm } from "shared/types/setup.types.ts";
import { ButtonComponent } from "shared/components/forms/button.component.tsx";
import { useAppForm } from "shared/hooks/use-app-form.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import { HOTEL_SETUP_SCHEMA } from "shared/consts/setup.consts.ts";
import { useTranslation } from "react-i18next";
import { InputComponent } from "shared/components/forms/input.component.tsx";
import { SETUP_DEBUG } from "shared/consts/development.consts.ts";

export const HotelStepComponent: React.FC<SetupStepProps<HotelStepForm>> = ({
  onSubmit,
  defaultValues,
  onBack,
}) => {
  const { t } = useTranslation();

  const { field, handleSubmit } = useAppForm<HotelStepForm>({
    resolver: SETUP_DEBUG ? undefined : zodResolver(HOTEL_SETUP_SCHEMA),
    mode: "all",
    defaultValues: { website: location.origin, ...defaultValues },
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
          {...field("website")}
        />
        <InputComponent
          title={t("setup.steps.email.description.title")}
          className="max-w-100"
          {...field("description")}
        />
        <InputComponent
          title={t("setup.steps.email.website.title")}
          className="max-w-100"
          {...field("website")}
        />
        <InputComponent
          title={t("setup.steps.email.client.title")}
          className="max-w-100"
          {...field("client")}
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
