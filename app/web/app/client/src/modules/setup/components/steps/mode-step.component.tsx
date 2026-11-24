import React from "react";
import { SetupStepProps, ModeStepForm } from "shared/types/setup.types.ts";
import { ButtonComponent } from "shared/components/forms/button.component.tsx";
import { useAppForm } from "shared/hooks/use-app-form.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import { MODE_SETUP_SCHEMA } from "shared/consts/setup.consts.ts";
import { RadioComponent } from "shared/components/forms/radio.component.tsx";
import { LabelComponent } from "shared/components/label.component.tsx";
import { useTranslation } from "react-i18next";
import { SETUP_DEBUG } from "shared/consts/development.consts.ts";

export const ModeStepComponent: React.FC<SetupStepProps<ModeStepForm>> = ({
  onSubmit,
  defaultValues,
  onBack,
  onChange,
}) => {
  const { t } = useTranslation();

  const { field, handleSubmit } = useAppForm<ModeStepForm>({
    resolver: SETUP_DEBUG ? undefined : zodResolver(MODE_SETUP_SCHEMA),
    mode: "all",
    defaultValues,
    onChange,
  });

  const { error, ...mode } = field("mode");

  return (
    <form
      className="p-card flex gap-6 flex-col"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex gap-3 flex-col">
        <label className="title">{t("setup.steps.mode.title")}</label>
        <RadioComponent
          {...mode}
          value="managed"
          title={
            <div className="flex gap-3">
              <span>{t("setup.steps.mode.mode.managed.title")}</span>
              <LabelComponent>
                {t("setup.steps.mode.mode.managed.recommended")}
              </LabelComponent>
            </div>
          }
          hint={t("setup.steps.mode.mode.managed.hint")}
        />
        <RadioComponent
          {...mode}
          value="standalone"
          title={t("setup.steps.mode.mode.standalone.title")}
          hint={t("setup.steps.mode.mode.standalone.hint")}
        />
        <RadioComponent
          {...mode}
          value="network"
          title={t("setup.steps.mode.mode.network.title")}
          hint={t("setup.steps.mode.mode.network.hint")}
        />
        {error ? <span className="text-(--danger) ">{error}</span> : null}
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
