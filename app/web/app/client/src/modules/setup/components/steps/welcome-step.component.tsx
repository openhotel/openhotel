import React, { useCallback } from "react";
import { InputComponent } from "shared/components/forms/input.component.tsx";
import { ButtonComponent } from "shared/components/forms/button.component.tsx";
import { useAppForm } from "shared/hooks/use-app-form.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import { WELCOME_SETUP_SCHEMA } from "shared/consts/setup.consts.ts";
import { SetupStepProps, WelcomeStepForm } from "shared/types/setup.types.ts";
import { useTranslation } from "react-i18next";
import { SelectComponent } from "shared/components/forms/select.component.tsx";
import { useLanguage } from "shared/hooks/language/use-language.tsx";

export const WelcomeStepComponent: React.FC<
  SetupStepProps<WelcomeStepForm>
> = ({ onSubmit, defaultValues }) => {
  const { t, i18n } = useTranslation();
  const { changeLanguage } = useLanguage();

  const { field, handleSubmit } = useAppForm<WelcomeStepForm>({
    resolver: zodResolver(WELCOME_SETUP_SCHEMA),
    mode: "all",
    defaultValues,
  });

  const $onSubmit = useCallback(
    (data: WelcomeStepForm) => {
      //TODO api to check if code is valid
      onSubmit(data);
    },
    [onSubmit],
  );

  const onChangeLanguage = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      changeLanguage(event.target.value);
    },
    [changeLanguage],
  );

  return (
    <form
      className="p-card flex gap-6 flex-col"
      onSubmit={handleSubmit($onSubmit)}
    >
      <div className="flex gap-3 flex-col">
        <label className="title">{t("setup.welcome.title")}</label>
        <label>{t("setup.welcome.description")}</label>
        <SelectComponent
          title={t("setup.welcome.language.title")}
          hint={t("setup.welcome.language.hint")}
          className="max-w-100"
          onChange={onChangeLanguage}
          defaultValue={i18n.language}
        >
          <option value="en">English</option>
          <option value="es">Español</option>
        </SelectComponent>
        <InputComponent
          title={t("setup.welcome.code.title")}
          hint={t("setup.welcome.code.hint")}
          placeholder="xxx-xxx-xxx"
          maxLength={11}
          className="max-w-100"
          {...field("code")}
        />
      </div>
      <div className="mt-auto flex gap-3 justify-end">
        <ButtonComponent accent>{t("setup.navigation.next")}</ButtonComponent>
      </div>
    </form>
  );
};
